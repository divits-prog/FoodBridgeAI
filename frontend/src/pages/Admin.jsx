import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodService from "../services/FoodService";
import RestaurantService from "../services/RestaurantService";
import OrderService from "../services/OrderService";

function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [newFood, setNewFood] = useState({
        foodName: "",
        description: "",
        price: "",
        category: "Main Course",
        imageUrl: "",
        available: true,
        restaurantId: ""
    });

    const [newRestaurant, setNewRestaurant] = useState({
        restaurantName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "Coimbatore",
        rating: 4.8,
        imageUrl: ""
    });

    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        loadAllData();
    }, [navigate]);

    const loadAllData = () => {
        setIsLoading(true);
        setError("");

        Promise.all([
            OrderService.getAllOrders().catch(() => ({ data: [] })),
            FoodService.getFoods().catch(() => ({ data: [] })),
            RestaurantService.getRestaurants().catch(() => ({ data: [] }))
        ])
            .then(([ordersRes, foodsRes, restsRes]) => {
                setOrders(ordersRes.data || []);
                setFoods(foodsRes.data || []);
                setRestaurants(restsRes.data || []);
                if (restsRes.data?.length > 0 && !newFood.restaurantId) {
                    setNewFood((prev) => ({ ...prev, restaurantId: restsRes.data[0].id }));
                }
            })
            .catch(() => {
                setError("Unable to load admin data. Ensure you are signed in with an ADMIN account.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleStatusChange = (orderId, newStatus) => {
        setError("");
        OrderService.updateOrderStatus(orderId, newStatus)
            .then(() => {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
                );
                showSuccess(`Order #${orderId} marked as ${newStatus}`);
            })
            .catch((err) => {
                setError(`Failed to update order status: ${err.response?.data?.message || err.message || "Network error"}`);
            });
    };

    const handleCreateFood = (e) => {
        e.preventDefault();
        if (!newFood.foodName || !newFood.price || !newFood.restaurantId) {
            setError("Please fill all required dish fields.");
            return;
        }

        const payload = {
            foodName: newFood.foodName,
            description: newFood.description,
            price: Number(newFood.price),
            category: newFood.category,
            imageUrl: newFood.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            available: newFood.available,
            restaurant: { id: Number(newFood.restaurantId) }
        };

        FoodService.createFood(payload)
            .then(({ data }) => {
                setFoods((prev) => [...prev, data]);
                setNewFood({
                    foodName: "",
                    description: "",
                    price: "",
                    category: "Main Course",
                    imageUrl: "",
                    available: true,
                    restaurantId: restaurants[0]?.id || ""
                });
                showSuccess("New dish added to menu successfully!");
            })
            .catch(() => setError("Failed to create dish."));
    };

    const handleDeleteFood = (foodId) => {
        if (!window.confirm("Are you sure you want to delete this dish from the menu?")) return;
        FoodService.deleteFood(foodId)
            .then(() => {
                setFoods((prev) => prev.filter((f) => f.id !== foodId));
                showSuccess("Dish deleted from menu.");
            })
            .catch(() => setError("Failed to delete dish."));
    };

    const handleCreateRestaurant = (e) => {
        e.preventDefault();
        if (!newRestaurant.restaurantName || !newRestaurant.email) {
            setError("Please fill restaurant name and email.");
            return;
        }

        RestaurantService.createRestaurant({
            ...newRestaurant,
            rating: Number(newRestaurant.rating || 4.5),
            imageUrl: newRestaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        })
            .then(({ data }) => {
                setRestaurants((prev) => [...prev, data]);
                setNewRestaurant({
                    restaurantName: "",
                    ownerName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "Coimbatore",
                    rating: 4.8,
                    imageUrl: ""
                });
                showSuccess("Kitchen partner created successfully!");
            })
            .catch(() => setError("Failed to add kitchen partner."));
    };

    const handleDeleteRestaurant = (restId) => {
        if (!window.confirm("Are you sure you want to remove this kitchen?")) return;
        RestaurantService.deleteRestaurant(restId)
            .then(() => {
                setRestaurants((prev) => prev.filter((r) => r.id !== restId));
                showSuccess("Kitchen partner removed.");
            })
            .catch(() => setError("Failed to delete restaurant."));
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return (
        <div className="admin-layout">
            <Navbar />

            <main className="admin-main-wrapper">
                <div className="admin-header-row">
                    <div>
                        <h1>Kitchen & Partner Portal</h1>
                        <p>Manage customer orders, live menu items, and kitchen profiles.</p>
                    </div>
                    <div className="admin-auth-badge">
                        <span>Signed in:</span>
                        <strong>{localStorage.getItem("fullName")}</strong>
                        <span className="role-tag-pill">Admin</span>
                    </div>
                </div>

                {successMessage && <div className="success-alert-banner">{successMessage}</div>}
                {error && <div className="error-alert-banner">{error}</div>}

                {/* KPI Metrics */}
                <div className="admin-metrics-row">
                    <div className="metric-box">
                        <span className="metric-title">Total Revenue</span>
                        <strong className="metric-value">₹{totalRevenue.toFixed(2)}</strong>
                        <span className="metric-sub">From customer checkouts</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-title">Orders Processed</span>
                        <strong className="metric-value">{orders.length}</strong>
                        <span className="metric-sub">Active & fulfilled</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-title">Menu Dishes</span>
                        <strong className="metric-value">{foods.length}</strong>
                        <span className="metric-sub">Across all kitchens</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-title">Kitchen Partners</span>
                        <strong className="metric-value">{restaurants.length}</strong>
                        <span className="metric-sub">Active kitchens</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="admin-tab-bar">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Customer Orders ({orders.length})
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "foods" ? "active" : ""}`}
                        onClick={() => setActiveTab("foods")}
                    >
                        Menu Items ({foods.length})
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "restaurants" ? "active" : ""}`}
                        onClick={() => setActiveTab("restaurants")}
                    >
                        Kitchen Partners ({restaurants.length})
                    </button>
                </div>

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="admin-panel-card">
                        <div className="panel-title-bar">
                            <h3>Manage Customer Orders</h3>
                            <span>Update fulfillment status in real time</span>
                        </div>

                        {orders.length === 0 ? (
                            <p className="empty-subtext">No orders recorded in the system.</p>
                        ) : (
                            <div className="table-responsive-box">
                                <table className="modern-admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items Summary</th>
                                            <th>Delivery Destination</th>
                                            <th>Total</th>
                                            <th>Current Status</th>
                                            <th>Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td><strong className="text-order-id">#{order.id}</strong></td>
                                                <td>User #{order.user?.id || "?"}</td>
                                                <td className="cell-summary">{order.itemsSummary || "Selected dishes"}</td>
                                                <td className="cell-address">{order.deliveryAddress || "N/A"}</td>
                                                <td><strong className="text-order-total">₹{Number(order.totalAmount || 0).toFixed(2)}</strong></td>
                                                <td>
                                                    <span className={`status-pill-badge badge-${(order.orderStatus || "PLACED").toLowerCase()}`}>
                                                        {order.orderStatus || "PLACED"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={(order.orderStatus || "PLACED").toUpperCase()}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="modern-status-select"
                                                    >
                                                        <option value="PLACED">PLACED</option>
                                                        <option value="PREPARING">PREPARING</option>
                                                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                                                        <option value="DELIVERED">DELIVERED</option>
                                                        <option value="CANCELLED">CANCELLED</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Menu Foods Tab */}
                {activeTab === "foods" && (
                    <div className="admin-two-column-grid">
                        <div className="admin-panel-card">
                            <div className="panel-title-bar">
                                <h3>Active Menu Dishes ({foods.length})</h3>
                            </div>

                            <div className="admin-scrollable-items">
                                {foods.map((food) => (
                                    <div className="admin-item-card-row" key={food.id}>
                                        <img
                                            src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80"}
                                            alt={food.foodName}
                                            className="item-row-thumb"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80";
                                            }}
                                        />
                                        <div className="item-row-info">
                                            <strong>{food.foodName}</strong>
                                            <span>{food.category} • ₹{Number(food.price).toFixed(0)}</span>
                                            <small className="kitchen-subname">{food.restaurant?.restaurantName || "Kitchen"}</small>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-danger-outline"
                                            onClick={() => handleDeleteFood(food.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Dish Form */}
                        <form className="admin-panel-card" onSubmit={handleCreateFood}>
                            <div className="panel-title-bar">
                                <h3>Add New Dish to Menu</h3>
                            </div>

                            <div className="form-stack-fields">
                                <div className="input-group">
                                    <label>Dish Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Garlic Herb Focaccia"
                                        value={newFood.foodName}
                                        onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        placeholder="Description or key ingredients"
                                        value={newFood.description}
                                        onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                                    />
                                </div>

                                <div className="input-grid-2">
                                    <div className="input-group">
                                        <label>Price (₹) *</label>
                                        <input
                                            type="number"
                                            placeholder="180"
                                            value={newFood.price}
                                            onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Category</label>
                                        <select
                                            value={newFood.category}
                                            onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                                        >
                                            <option value="Biryani">Biryani</option>
                                            <option value="Main Course">Main Course</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Italian">Italian</option>
                                            <option value="Healthy">Healthy</option>
                                            <option value="Appetizer">Appetizer</option>
                                            <option value="Dessert">Dessert</option>
                                            <option value="Beverage">Beverage</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Kitchen Partner *</label>
                                    <select
                                        value={newFood.restaurantId}
                                        onChange={(e) => setNewFood({ ...newFood, restaurantId: e.target.value })}
                                        required
                                    >
                                        {restaurants.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.restaurantName} ({r.city})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/photo-..."
                                        value={newFood.imageUrl}
                                        onChange={(e) => setNewFood({ ...newFood, imageUrl: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn-primary-action">
                                    + Add Dish to Menu
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Kitchens Tab */}
                {activeTab === "restaurants" && (
                    <div className="admin-two-column-grid">
                        <div className="admin-panel-card">
                            <div className="panel-title-bar">
                                <h3>Kitchen Partners ({restaurants.length})</h3>
                            </div>

                            <div className="admin-scrollable-items">
                                {restaurants.map((r) => (
                                    <div className="admin-item-card-row" key={r.id}>
                                        <div className="kitchen-initial-box">{r.restaurantName.charAt(0)}</div>
                                        <div className="item-row-info">
                                            <strong>{r.restaurantName}</strong>
                                            <span>{r.city} • ★ {r.rating || 4.8}</span>
                                            <small className="kitchen-subname">{r.email} • {r.phone}</small>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-danger-outline"
                                            onClick={() => handleDeleteRestaurant(r.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Kitchen Form */}
                        <form className="admin-panel-card" onSubmit={handleCreateRestaurant}>
                            <div className="panel-title-bar">
                                <h3>Add New Kitchen Partner</h3>
                            </div>

                            <div className="form-stack-fields">
                                <div className="input-group">
                                    <label>Kitchen / Restaurant Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Green Haven Kitchen"
                                        value={newRestaurant.restaurantName}
                                        onChange={(e) => setNewRestaurant({ ...newRestaurant, restaurantName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Owner Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sarah Chen"
                                        value={newRestaurant.ownerName}
                                        onChange={(e) => setNewRestaurant({ ...newRestaurant, ownerName: e.target.value })}
                                    />
                                </div>

                                <div className="input-grid-2">
                                    <div className="input-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            placeholder="partner@kitchen.com"
                                            value={newRestaurant.email}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="9876543210"
                                            value={newRestaurant.phone}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="input-grid-2">
                                    <div className="input-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            placeholder="Coimbatore"
                                            value={newRestaurant.city}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, city: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Rating (1.0 - 5.0)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="1"
                                            max="5"
                                            value={newRestaurant.rating}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, rating: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        placeholder="Street & locality"
                                        value={newRestaurant.address}
                                        onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn-primary-action">
                                    + Add Kitchen Partner
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import OrderService from "../services/OrderService";

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login", { replace: true });
            return;
        }

        if (!userId) {
            setIsLoading(false);
            return;
        }

        OrderService.getUserOrders(userId)
            .then(({ data }) => {
                setOrders(data || []);
            })
            .catch(() => {
                setError("Unable to load orders. Please make sure the backend is running.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate, userId]);

    const getStatusStep = (status) => {
        const s = (status || "").toUpperCase();
        if (s.includes("DELIVER")) return 4;
        if (s.includes("OUT")) return 3;
        if (s.includes("PREPAR")) return 2;
        return 1;
    };

    const getStatusClass = (status) => {
        const s = (status || "").toUpperCase();
        if (s.includes("DELIVER")) return "badge-delivered";
        if (s.includes("OUT")) return "badge-out";
        if (s.includes("PREPAR")) return "badge-preparing";
        return "badge-placed";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Recent order";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="orders-layout">
            <Navbar />

            <main className="orders-main-wrapper">
                <div className="orders-header-row">
                    <div>
                        <h1>Order History & Tracking</h1>
                        <p>Track your active kitchen deliveries and past orders.</p>
                    </div>
                    <Link to="/browse" className="btn-primary-action">
                        Browse Menu <span>→</span>
                    </Link>
                </div>

                {isLoading && (
                    <div className="loading-card-state">
                        <div className="pulse-spinner"></div>
                        <p>Fetching your orders...</p>
                    </div>
                )}

                {error && <div className="error-alert-banner">{error}</div>}

                {!isLoading && !error && orders.length === 0 && (
                    <div className="empty-orders-view">
                        <span className="empty-plate-icon">🍽️</span>
                        <h3>No orders placed yet</h3>
                        <p>Discover neighborhood kitchens and get freshly prepared food delivered home.</p>
                        <Link to="/browse" className="btn-primary-action">
                            Explore Kitchens & Menu
                        </Link>
                    </div>
                )}

                {!isLoading && !error && orders.length > 0 && (
                    <div className="orders-stack">
                        {orders.map((order) => {
                            const step = getStatusStep(order.orderStatus);
                            return (
                                <article className="modern-order-card" key={order.id}>
                                    <div className="order-top-banner">
                                        <div className="order-id-block">
                                            <span className="order-num">Order #{order.id}</span>
                                            <span className="order-time">{formatDate(order.orderDate)}</span>
                                        </div>

                                        <div className="order-status-right">
                                            <span className={`status-pill-badge ${getStatusClass(order.orderStatus)}`}>
                                                {order.orderStatus || "PLACED"}
                                            </span>
                                            <span className="payment-pill-badge">{order.paymentMethod || "CASH"}</span>
                                        </div>
                                    </div>

                                    {/* Progress Step Bar */}
                                    <div className="order-progress-stepper">
                                        <div className={`step-item ${step >= 1 ? "active" : ""}`}>
                                            <div className="step-circle">1</div>
                                            <span>Placed</span>
                                        </div>
                                        <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
                                        <div className={`step-item ${step >= 2 ? "active" : ""}`}>
                                            <div className="step-circle">2</div>
                                            <span>Preparing</span>
                                        </div>
                                        <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
                                        <div className={`step-item ${step >= 3 ? "active" : ""}`}>
                                            <div className="step-circle">3</div>
                                            <span>On The Way</span>
                                        </div>
                                        <div className={`step-line ${step >= 4 ? "active" : ""}`}></div>
                                        <div className={`step-item ${step >= 4 ? "active" : ""}`}>
                                            <div className="step-circle">4</div>
                                            <span>Delivered</span>
                                        </div>
                                    </div>

                                    <div className="order-card-body-row">
                                        <div className="order-items-col">
                                            <span className="section-label-tiny">Dishes Ordered</span>
                                            <p className="order-dishes-text">{order.itemsSummary || "Selected community specialties"}</p>
                                        </div>

                                        {order.deliveryAddress && (
                                            <div className="order-address-col">
                                                <span className="section-label-tiny">Delivery Address</span>
                                                <p className="order-addr-text">{order.deliveryAddress}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="order-card-footer-row">
                                        <div className="order-price-total">
                                            <span>Total Paid:</span>
                                            <strong>₹{Number(order.totalAmount || 0).toFixed(2)}</strong>
                                        </div>

                                        <Link to="/browse" className="reorder-btn">
                                            Order Again <span>↗</span>
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;

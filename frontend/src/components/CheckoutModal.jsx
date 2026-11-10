import { useState } from "react";
import OrderService from "../services/OrderService";
import PaymentService from "../services/PaymentService";
import CartService from "../services/CartService";

function CheckoutModal({ isOpen, onClose, cartItems, totalAmount, userId, onSuccess }) {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [placedOrder, setPlacedOrder] = useState(null);

    if (!isOpen) return null;

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!address.trim()) {
            setError("Please provide a delivery address.");
            return;
        }
        if (!userId) {
            setError("Please sign in to place your order.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const itemsSummary = cartItems
            .map((item) => {
                const name = item.food?.foodName || item.foodName || "Dish";
                const qty = item.quantity || 1;
                return `${name} x${qty}`;
            })
            .join(", ");

        const fullDeliveryAddress = `${address.trim()}${phone ? ` (Phone: ${phone})` : ""}${notes ? ` [Note: ${notes}]` : ""}`;

        const orderPayload = {
            user: { id: Number(userId) },
            totalAmount: Number(totalAmount),
            orderStatus: "PLACED",
            deliveryAddress: fullDeliveryAddress,
            itemsSummary: itemsSummary,
            paymentMethod: paymentMethod
        };

        OrderService.createOrder(orderPayload)
            .then(async ({ data: newOrder }) => {
                try {
                    await PaymentService.createPayment(newOrder.id, totalAmount, paymentMethod);
                } catch (e) {}

                try {
                    await CartService.clearCart(userId);
                } catch (e) {}

                setPlacedOrder(newOrder);
                if (onSuccess) {
                    onSuccess(newOrder);
                }
            })
            .catch(() => {
                setError("Could not complete order. Please ensure the backend is connected and try again.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="modal-backdrop-blur" onClick={onClose}>
            <div className="modern-checkout-modal" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-top-bar">
                    <div>
                        <h2>{placedOrder ? "Order Confirmed!" : "Checkout"}</h2>
                        <span className="checkout-subhead">
                            {placedOrder ? "Transmitted to local kitchen" : "Fresh meal on its way to you"}
                        </span>
                    </div>
                    <button type="button" className="modal-close-icon" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="checkout-modal-body">
                    {placedOrder ? (
                        <div className="order-success-card">
                            <div className="success-icon-badge">✓</div>
                            <h3>Thank You For Your Order!</h3>
                            <p className="order-id-announce">
                                Order <strong>#{placedOrder.id}</strong> has been placed and received by the kitchen.
                            </p>

                            <div className="modern-receipt-box">
                                <div className="receipt-line">
                                    <span>Status</span>
                                    <span className="status-badge-placed">{placedOrder.orderStatus || "PLACED"}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Items Ordered</span>
                                    <strong className="summary-str">{placedOrder.itemsSummary || "Selected dishes"}</strong>
                                </div>
                                <div className="receipt-line">
                                    <span>Deliver to</span>
                                    <span className="addr-str">{placedOrder.deliveryAddress}</span>
                                </div>
                                <div className="receipt-line">
                                    <span>Payment</span>
                                    <span>{placedOrder.paymentMethod}</span>
                                </div>
                                <div className="receipt-line total-highlight">
                                    <span>Total Paid</span>
                                    <strong>₹{Number(placedOrder.totalAmount || 0).toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="eta-badge-pill">
                                <span>⚡ Estimated Delivery: <strong>30-40 minutes</strong></span>
                            </div>

                            <div className="success-btn-row">
                                <a href="/orders" className="btn-primary-action">
                                    Track in My Orders <span>→</span>
                                </a>
                                <button type="button" className="btn-secondary-action" onClick={onClose}>
                                    Back to Menu
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="modern-checkout-form" onSubmit={handlePlaceOrder}>
                            {/* Order Summary Box */}
                            <div className="checkout-summary-card">
                                <h4>Order Summary ({cartItems.length} items)</h4>
                                <div className="summary-items-scroll">
                                    {cartItems.map((item, idx) => {
                                        const name = item.food?.foodName || item.foodName || "Dish";
                                        const price = item.food?.price || item.totalPrice || item.price || 0;
                                        const qty = item.quantity || 1;
                                        return (
                                            <div className="summary-item-row" key={item.id || idx}>
                                                <span>{name} <small>×{qty}</small></span>
                                                <b>₹{(price * qty).toFixed(2)}</b>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="summary-total-row">
                                    <span>Total Due</span>
                                    <strong>₹{Number(totalAmount).toFixed(2)}</strong>
                                </div>
                            </div>

                            {/* Delivery Address & Contacts */}
                            <div className="input-group">
                                <label>Delivery Address *</label>
                                <input
                                    type="text"
                                    placeholder="House/Flat number, Street, Area, Landmark"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-grid-2">
                                <div className="input-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g. 9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Delivery Instructions</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Leave at door, call on arrival"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="input-group">
                                <label>Select Payment Method</label>
                                <div className="payment-cards-grid">
                                    <label className={`payment-method-card ${paymentMethod === "UPI" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="UPI"
                                            checked={paymentMethod === "UPI"}
                                            onChange={() => setPaymentMethod("UPI")}
                                        />
                                        <span className="pay-icon">⚡</span>
                                        <div>
                                            <strong>UPI / QR</strong>
                                            <small>Google Pay, PhonePe, Paytm</small>
                                        </div>
                                    </label>

                                    <label className={`payment-method-card ${paymentMethod === "CARD" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="CARD"
                                            checked={paymentMethod === "CARD"}
                                            onChange={() => setPaymentMethod("CARD")}
                                        />
                                        <span className="pay-icon">💳</span>
                                        <div>
                                            <strong>Cards</strong>
                                            <small>Visa, Mastercard, RuPay</small>
                                        </div>
                                    </label>

                                    <label className={`payment-method-card ${paymentMethod === "CASH" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="CASH"
                                            checked={paymentMethod === "CASH"}
                                            onChange={() => setPaymentMethod("CASH")}
                                        />
                                        <span className="pay-icon">💵</span>
                                        <div>
                                            <strong>Cash on Delivery</strong>
                                            <small>Pay at your doorstep</small>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {error && <div className="error-alert-banner">{error}</div>}

                            <button
                                type="submit"
                                className="checkout-btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Placing Order..." : `Confirm Order • ₹${Number(totalAmount).toFixed(2)}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;

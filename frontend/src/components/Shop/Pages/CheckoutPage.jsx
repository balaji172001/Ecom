import { useState } from "react";
import { btnStyle, inputStyle } from "../../../utils/shopHelpers";

export default function CheckoutPage({ cart, onPlaceOrder, onNavigate, user }) {
    const [form, setForm] = useState({
        name: user?.name || "",
        mobile: user?.mobile || "",
        email: user?.email || "",
        address: user?.address || "",
        city: user?.city || "",
        state: "Tamil Nadu",
        pincode: "",
    });

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const isFreeDelivery = subtotal >= 19999;
    const total = subtotal;

    const onSubmit = (e) => {
        e.preventDefault();
        onPlaceOrder({ ...form, items: cart, total, id: `ORD-${Date.now()}` });
        onNavigate("success", `ORD-${Date.now()}`);
    };

    return (
        <div className="idx-style-138">
            <h1 className="idx-style-139">Checkout</h1>
            <form onSubmit={onSubmit} className="idx-style-140">
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: 20, border: '1px solid rgba(255,215,0,0.1)' }}>
                    <h3 className="idx-style-167" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>🚚</span> Delivery Details
                    </h3>

                    <div className="idx-style-141" style={{ marginTop: '20px' }}>
                        <div className="idx-style-212">
                            <label className="idx-style-213">Full Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" required style={inputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Mobile Number</label>
                                <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit mobile" required style={inputStyle} />
                            </div>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Email (Optional)</label>
                                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={inputStyle} />
                            </div>
                        </div>

                        <div className="idx-style-212">
                            <label className="idx-style-213">Full Shipping Address</label>
                            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Plot No, Street, Area..." required style={{ ...inputStyle, minHeight: 100 }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="idx-style-212">
                                <label className="idx-style-213">City</label>
                                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City Name" required style={inputStyle} />
                            </div>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Pincode</label>
                                <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="6-digit code" required style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,215,0,0.03)', padding: '30px', borderRadius: 20, border: '1px solid rgba(255,215,0,0.15)' }}>
                    <h3 className="idx-style-167" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>💳</span> Order Summary
                    </h3>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                            <span>Items Total</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                            <span>Delivery Fee</span>
                            <span>{isFreeDelivery ? <span style={{ color: '#4CAF50' }}>FREE</span> : <span style={{ color: '#ff6b35' }}>Based on KM</span>}</span>
                        </div>

                        <div style={{ margin: '10px 0', borderTop: '1px dashed rgba(255,215,0,0.2)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffd700', fontWeight: 900, fontSize: '1.3rem', fontFamily: 'Cinzel' }}>
                            <span>Amount Payable</span>
                            <span>₹{total}</span>
                        </div>
                        {!isFreeDelivery && (
                            <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: '-5px' }}>
                                *Delivery charges extra based on distance
                            </p>
                        )}
                    </div>

                    <div style={{ marginTop: '30px', background: 'rgba(76, 175, 80, 0.1)', padding: '15px', borderRadius: 12, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                        <div style={{ fontWeight: 700, color: '#4CAF50', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📱</span> Payment: GPay / UPI
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                            Place your order now. Our team will contact you for payment via GPay/PhonePe. <strong>No COD available.</strong>
                        </div>
                    </div>

                    <button type="submit" style={{ ...btnStyle("primary"), width: "100%", marginTop: "25px", padding: '16px' }}>
                        Place Order 🎆
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#666', marginTop: '15px' }}>
                        Verified Licensed Vendor • Secure Order Process
                    </p>
                </div>
            </form>
        </div>
    );
}

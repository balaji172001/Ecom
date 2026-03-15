import { btnStyle, qtyBtn, renderImage } from "../../../utils/shopHelpers";

export default function CartPage({ cart, onUpdate, onRemove, onNavigate }) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = subtotal >= 999 ? 0 : 99;
    const total = subtotal + delivery;

    if (cart.length === 0) return (
        <div className="idx-style-130">
            <div className="idx-style-131">🛒</div>
            <h2 className="idx-style-132">Your cart is empty</h2>
            <p className="idx-style-133">Add some high-quality crackers to your celebration!</p>
            <button onClick={() => onNavigate("products")} style={{ ...btnStyle("primary"), padding: '12px 25px' }}>Go Shopping →</button>
        </div>
    );

    return (
        <div className="idx-style-161">
            <h1 className="idx-style-162">Shopping Cart ({cart.length})</h1>
            <p className="idx-style-163">Check your items and proceed to secure checkout.</p>
            <div className="idx-style-166">
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    {cart.map(i => (
                        <div key={i.id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: "rgba(255,255,255,0.04)",
                            padding: '12px 16px',
                            borderRadius: 12,
                            border: '1px solid rgba(255,215,0,0.05)'
                        }}>
                            <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                                {renderImage(i.image, "idx-style-125-img")}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="idx-style-145">{i.name}</div>
                                <div className="idx-style-148">₹{i.price} / {i.unit}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button onClick={() => onUpdate(i.id, i.qty - 1)} style={qtyBtn}>-</button>
                                <span className="idx-style-151">{i.qty}</span>
                                <button onClick={() => onUpdate(i.id, i.qty + 1)} style={qtyBtn}>+</button>
                            </div>
                            <div style={{ minWidth: 80, textAlign: 'right' }}>
                                <div className="idx-style-152">₹{i.price * i.qty}</div>
                                <button onClick={() => onRemove(i.id)} className="idx-style-153">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'rgba(255,215,0,0.04)', padding: 22, borderRadius: 16, border: '1px solid rgba(255,215,0,0.1)' }}>
                    <h3 className="idx-style-167">Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                            <span>Delivery Fee</span>
                            <span>{delivery === 0 ? <span style={{ color: "#4CAF50" }}>FREE</span> : `₹${delivery}`}</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,215,0,0.1)', paddingTop: 12, marginTop: 5, display: 'flex', justifyContent: 'space-between', color: '#ffd700', fontWeight: 900, fontFamily: 'Cinzel', fontSize: '1.1rem' }}>
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    {subtotal < 3000 ? (
                        <div style={{ fontSize: '0.72rem', color: '#ff6b35', textAlign: 'center', marginBottom: 15, background: 'rgba(255,107,53,0.1)', padding: 8, borderRadius: 8 }}>
                            💡 Add ₹{3000 - subtotal} more for FREE delivery!
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.72rem', color: '#4CAF50', textAlign: 'center', marginBottom: 15, background: 'rgba(76,175,80,0.1)', padding: 8, borderRadius: 8 }}>
                            ✅ Free delivery applied!
                        </div>
                    )}
                    <button onClick={() => onNavigate("checkout")} style={{ ...btnStyle("primary"), width: "100%" }}>Proceed to Checkout →</button>
                </div>
            </div>
        </div>
    );
}

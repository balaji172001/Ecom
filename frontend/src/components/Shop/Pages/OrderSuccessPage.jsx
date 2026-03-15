import { btnStyle } from "../../../utils/shopHelpers";

export default function OrderSuccessPage({ orderId, onNavigate }) {
    const whatsappMsg = `Hi, I just placed an order! %0AOrder ID: ${orderId}%0APlease confirm my order and share the payment details.`;
    const whatsappLink = `https://wa.me/916374549935?text=${whatsappMsg}`;

    return (
        <div className="idx-style-193">
            <div className="idx-style-194">🎊</div>
            <h1 className="idx-style-195">Order Placed!</h1>
            <p className="idx-style-196">Thank you for choosing Sri Ram Balaji Agency.</p>

            <div className="idx-style-197" style={{ marginTop: '20px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366' }}>
                <div style={{ color: '#25D366', fontWeight: 900, fontSize: '1.2rem', marginBottom: '10px' }}>✅ FINAL STEP REQUIRED</div>
                <div className="idx-style-198">Order ID: {orderId}</div>

                <div style={{ margin: '20px 0' }}>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                        style={{ ...btnStyle("primary"), display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', background: '#25D366', color: '#fff', fontSize: '1.1rem', padding: '15px 30px' }}>
                        <span>📱</span> Share on WhatsApp
                    </a>
                </div>
                <p className="idx-style-200" style={{ color: '#fff', opacity: 0.9 }}>
                    Please click the button above to send your order details to us.
                    We will send the payment link and confirm your delivery via WhatsApp.
                </p>
            </div>

            <div className="idx-style-206" style={{ marginTop: '30px' }}>
                <button onClick={() => onNavigate("orders")} style={btnStyle("outline")}>View Order History</button>
                <button onClick={() => onNavigate("home")} style={btnStyle("ghost")}>Return to Shop</button>
            </div>
        </div>
    );
}

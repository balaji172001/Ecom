import { btnStyle } from "../../utils/shopHelpers";

export default function Navbar({ page, cart, onNavigate, user, onLogout }) {
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    return (
        <nav className="idx-style-241">
            <div className="idx-style-242" style={{ justifyContent: 'space-between' }}>
                <div className="idx-style-243" onClick={() => onNavigate("home")}>
                    <img src="/RamBalajiShop-AppIcon.png" alt="Logo" className="nav-logo-img" />
                    <div className="idx-style-245 brand-text-container">
                        <div className="idx-style-246">Sri Ram Balaji Agency</div>
                        <div className="idx-style-247">SIVAKASI CRACKERS SHOP</div>
                    </div>
                </div>

                <div className="idx-style-248 nav-links-container">
                    {/* Desktop Text Links */}
                    <button className="nav-text-link" onClick={() => onNavigate("home")} style={{ background: 'none', border: 'none', color: page === 'home' ? '#FFD700' : '#888', cursor: 'pointer', padding: '0 10px', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>Home</button>
                    <button className="nav-text-link" onClick={() => onNavigate("products")} style={{ background: 'none', border: 'none', color: page === 'products' ? '#FFD700' : '#888', cursor: 'pointer', padding: '0 10px', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>Products</button>
                    {user ? (
                        <>
                            <button className="nav-text-link" onClick={() => onNavigate("orders")} style={{ background: 'none', border: 'none', color: page === 'orders' ? '#FFD700' : '#888', cursor: 'pointer', padding: '0 10px', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>Orders</button>
                            <button className="nav-text-link" onClick={onLogout} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: '0 10px', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>Logout</button>
                        </>
                    ) : (
                        <button className="nav-text-link" onClick={() => onNavigate("login")} style={{ background: 'none', border: 'none', color: page === 'login' ? '#FFD700' : '#888', cursor: 'pointer', padding: '0 10px', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>Login</button>
                    )}

                    {/* Mobile Icon Links */}
                    <div className="nav-mobile-icons">
                        <button className="mobile-nav-icon" onClick={() => onNavigate("home")} style={{ color: page === 'home' ? '#FFD700' : '#888' }}>🏠</button>
                        <button className="mobile-nav-icon" onClick={() => onNavigate("products")} style={{ color: page === 'products' ? '#FFD700' : '#888' }}>📋</button>
                        {user ? (
                            <>
                                <button className="mobile-nav-icon" onClick={() => onNavigate("orders")} style={{ color: page === 'orders' ? '#FFD700' : '#888' }}>📦</button>
                                <button className="mobile-nav-icon" onClick={onLogout} style={{ color: '#FF5252' }}>🚪</button>
                            </>
                        ) : (
                            <button className="mobile-nav-icon" onClick={() => onNavigate("login")} style={{ color: page === 'login' ? '#FFD700' : '#888' }}>🔑</button>
                        )}
                    </div>

                    <button className="cart-btn-fixed" onClick={() => onNavigate("cart")} style={{ ...btnStyle("primary"), padding: "6px 12px", position: "relative", marginLeft: '8px' }}>
                        🛒 {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
                    </button>
                </div>
            </div>
        </nav>
    );
}

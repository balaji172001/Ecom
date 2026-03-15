export default function Sidebar({ active, onNav, collapsed, onToggle }) {
    const items = [
        ["dashboard", "📊", "Dashboard"],
        ["orders", "📦", "Orders"],
        ["products", "🛍️", "Products"],
        ["coupons", "🏷️", "Coupons"],
        ["users", "👥", "Users"],
    ];
    return (
        <aside style={{ width: collapsed ? 60 : 220, background: "rgba(8,3,0,0.97)", borderRight: "1px solid rgba(255,215,0,0.1)", minHeight: "100vh", transition: "width 0.3s ease", flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50, overflowX: "hidden" }}>
            <div style={{ padding: "20px 12px", borderBottom: "1px solid rgba(255,215,0,0.1)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
                {!collapsed && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img src="/RamBalajiShop-AppIcon.png" alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                        <span className="adm-style-17">Admin</span>
                    </div>
                )}
                <button onClick={onToggle} className="adm-style-18">☰</button>
            </div>
            <nav className="adm-style-19">
                {items.map(([id, icon, label]) => (
                    <button key={id} onClick={() => onNav(id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", borderRadius: 10, border: "none", marginBottom: 4, cursor: "pointer", background: active === id ? "linear-gradient(135deg,rgba(255,107,53,0.3),rgba(255,215,0,0.15))" : "transparent", color: active === id ? "#FFD700" : "#888", fontFamily: "'Cinzel', serif", fontSize: "0.8rem", fontWeight: active === id ? 700 : 400, transition: "all 0.2s", textAlign: "left", borderLeft: active === id ? "3px solid #FFD700" : "3px solid transparent" }}>
                        <span className="adm-style-20">{icon}</span>
                        {!collapsed && <span>{label}</span>}
                    </button>
                ))}
            </nav>
            {!collapsed && (
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,215,0,0.1)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', marginBottom: 5 }}>Database Sync</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, background: '#4caf50', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#fff' }}>Connected</span>
                    </div>
                </div>
            )}
        </aside>
    );
}

import { StatusBadge } from "./Common";
import { API_BASE } from "../../utils/shopConstants";

export default function Dashboard({ products, orders }) {
    const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === "Pending").length;
    const lowStock = products.filter(p => p.stock < 10).length;

    const stats = [
        { label: "Total Products", value: products.length, icon: "🛍️", color: "#9C27B0" },
        { label: "Total Orders", value: orders.length, icon: "📦", color: "#2196F3" },
        { label: "Total Revenue", value: "₹" + totalRevenue.toLocaleString("en-IN"), icon: "💰", color: "#4CAF50" },
        { label: "Pending Tasks", value: pendingOrders, icon: "⏳", color: "#FF9800", alert: pendingOrders > 0 },
        { label: "Inventory Health", value: lowStock > 0 ? `${lowStock} Low` : "Good", icon: "❤️", color: lowStock > 0 ? "#F44336" : "#4CAF50" },
    ];

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="adm-style-129">
            <div className="adm-style-102">
                <div>
                    <h1 className="page-title" style={{ marginBottom: 5 }}>Business Command Center</h1>
                    <div style={{ color: '#4caf50', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className="live-pulse"></span>
                        Neural Connection Stable
                    </div>
                </div>
                <div className="adm-style-103">Dynamic operational intelligence</div>
            </div>

            <div className="adm-style-21">
                {stats.map(s => (
                    <div key={s.label} className="stat-card" style={{ border: `1px solid ${s.alert ? s.color + "66" : "rgba(255,215,0,0.12)"}`, position: 'relative', overflow: 'hidden' }}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="stat-sync-text">Live Sync Active</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                {/* RECENT ACTIVITY FEED */}
                <div className="adm-style-3" style={{ padding: '28px', margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="adm-style-25" style={{ margin: 0 }}>Recent Flux Orders</h3>
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>Real-time updates</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentOrders.map(o => (
                            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.06)', borderRadius: 12 }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{o.customer.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#666' }}>ID: {o.orderId}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#ffd700', fontWeight: 700 }}>₹{o.total}</div>
                                    <StatusBadge status={o.status} />
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <div className="empty-msg">No recent activity detected.</div>}
                    </div>
                </div>

                {/* INTELLIGENT OPS */}
                <div className="adm-style-3" style={{ padding: '28px', margin: 0 }}>
                    <h3 className="adm-style-25" style={{ marginBottom: '20px' }}>Fast-Track Operations</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {[
                            { label: "New Product", icon: "💎", color: "#9C27B0", desc: "List new crackers" },
                            { label: "Promo Blast", icon: "🚀", color: "#FF9800", desc: "Create coupons" },
                            { label: "Route Intel", icon: "📍", color: "#2196F3", desc: "Delivery charges" },
                            { label: "User Intel", icon: "👥", color: "#4CAF50", desc: "Customer list" }
                        ].map(action => (
                            <div key={action.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 16, border: '1px solid rgba(255,215,0,0.08)', cursor: 'pointer', transition: 'all 0.2s' }} className="op-card">
                                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{action.icon}</div>
                                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{action.label}</div>
                                <div style={{ fontSize: '0.65rem', color: '#888' }}>{action.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PERFORMANCE ANALYSIS (MOCK) */}
            <div className="adm-style-3" style={{ marginTop: '24px', padding: '28px', margin: 0 }}>
                <h3 className="adm-style-25" style={{ marginBottom: '15px' }}>Seasonal Momentum Analysis</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px', padding: '20px 0' }}>
                    {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: h > 80 ? 'linear-gradient(0deg, #ff6b35, #ffd700)' : 'rgba(255,215,0,0.1)', height: `${h}%`, borderRadius: '4px 4px 0 0', transition: 'all 0.5s', position: 'relative' }} className="chart-bar">
                            <div className="bar-tooltip">₹{h * 200}+</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                    <span>Jan 2024</span>
                    <span>Peak Season (Festival)</span>
                    <span>Dec 2024</span>
                </div>
            </div>

            <style>{`
                .live-pulse {
                    width: 8px;
                    height: 8px;
                    background: #4caf50;
                    border-radius: 50%;
                    display: inline-block;
                    animation: pulse 1.5s infinite;
                }
                .stat-sync-text {
                    font-size: 0.65rem;
                    color: #555;
                    margin-top: 10px;
                }
                .op-card:hover {
                    background: rgba(255,215,0,0.06) !important;
                    transform: translateY(-3px);
                    border-color: rgba(255,215,0,0.2) !important;
                }
                .chart-bar:hover {
                    opacity: 0.8;
                    transform: scaleY(1.05);
                }
                .chart-bar:hover .bar-tooltip {
                    opacity: 1;
                }
                .bar-tooltip {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffd700;
                    color: #000;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.6rem;
                    font-weight: 700;
                    opacity: 0;
                    transition: opacity 0.2s;
                    white-space: nowrap;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .empty-msg {
                    color: #444;
                    text-align: center;
                    padding: 30px;
                    font-size: 0.8rem;
                    border: 1px dashed rgba(255,215,0,0.1);
                    border-radius: 12px;
                }
            `}</style>
        </div>
    );
}

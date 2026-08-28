import React from "react";
import {
  ShoppingBag,
  Package,
  IndianRupee,
  Clock,
  Heart,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
  Zap,
  Star,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { pageTitle, actionBtn, cardStyle } from "../utils/adminConstants";
import StatusBadge from "./StatusBadge";

export default function Dashboard({ products, orders, refreshData, lastUpdated, onNav, isMobile }) {
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: <ShoppingBag size={20} />, color: "#9C27B0" },
    { label: "Total Orders", value: orders.length, icon: <Package size={20} />, color: "#2196F3" },
    { label: "Total Revenue", value: "₹" + totalRevenue.toLocaleString("en-IN"), icon: <IndianRupee size={20} />, color: "#4CAF50" },
    { label: "Pending Tasks", value: pendingOrders, icon: <Clock size={20} />, color: "#FF9800", alert: pendingOrders > 0 },
    { label: "Inventory Health", value: lowStock > 0 ? `${lowStock} Low` : "Good", icon: <Heart size={20} />, color: lowStock > 0 ? "#F44336" : "#4CAF50" },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const cityCounts = orders.reduce((acc, o) => {
    const city = (typeof o.customer === "object" ? o.customer.city : o.city) || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const repeatCustomers = orders.reduce((acc, o) => {
    const mob = typeof o.customer === "object" ? o.customer.mobile : o.mobile;
    if (!mob) return acc;
    acc[mob] = (acc[mob] || 0) + 1;
    return acc;
  }, {});
  const loyaltyCount = Object.values(repeatCustomers).filter((v) => v > 1).length;

  const ltvData = Object.entries(
    orders.reduce((acc, o) => {
      const mob = typeof o.customer === "object" ? o.customer.mobile : o.mobile;
      const name = typeof o.customer === "object" ? o.customer.name : o.customer || "Guest";
      if (!mob) return acc;
      if (!acc[mob]) acc[mob] = { name, total: 0, count: 0, mobile: mob };
      acc[mob].total += o.total;
      acc[mob].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map((x) => x[1]);

  return (
    <div className="adm-style-129-inner">
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 12 : 0,
          marginBottom: 25,
        }}
      >
        <div>
          <h1 style={{ ...pageTitle, margin: 0 }}>Business Command Center</h1>
          <div style={{ color: "#4caf50", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
            <span className="live-pulse"></span>
            Sync Frequency: 5m | Last Update: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Just now"}
          </div>
        </div>
        <button
          onClick={refreshData}
          style={{
            ...actionBtn,
            padding: "8px 15px",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RefreshCw size={14} /> Force Refresh
        </button>
      </div>

      <div className="adm-style-21" style={{ gap: isMobile ? 12 : 16 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              border: `1px solid ${s.alert ? s.color + "66" : "rgba(255,215,0,0.12)"}`,
              position: "relative",
              overflow: "hidden",
              padding: "12px 15px",
              borderRadius: 10,
            }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.65rem", color: "#555", marginTop: "10px" }}>Real-time sync enabled</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 320px",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        {/* RECENT ACTIVITY */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 className="adm-style-25" style={{ margin: 0 }}>Recent Flux Orders</h3>
            <span
              style={{ fontSize: "0.7rem", color: "#ffd700", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => onNav("orders")}
            >
              View All <ArrowRight size={12} />
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentOrders.map((o) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 18px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,215,0,0.06)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>
                    {typeof o.customer === "object" ? o.customer.name : o.customer || "Guest Customer"}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#666" }}>{o.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.8rem", color: "#ffd700", fontWeight: 700 }}>₹{o.total}</div>
                  <StatusBadge status={o.status} small />
                </div>
              </div>
            ))}
            {orders.length === 0 && <div style={{ color: "#444", textAlign: "center", padding: 20 }}>No flux activity.</div>}
          </div>
        </div>

        {/* INTERESTING INSIGHTS */}
        <div style={cardStyle}>
          <h3 className="adm-style-25" style={{ marginBottom: "20px" }}>Interesting Insights</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {[
              { label: "Avg. Order Value", value: `₹${aov.toLocaleString("en-IN")}`, sub: "Higher is better", icon: <TrendingUp size={16} />, color: "#4CAF50" },
              { label: "Top Active City", value: topCity, sub: "Highest demand area", icon: <MapPin size={16} />, color: "#2196F3" },
              { label: "Repeat Buyers", value: loyaltyCount, sub: "Loyal customer base", icon: <Users size={16} />, color: "#FFD700" },
              { label: "Growth Potential", value: "84%", sub: "Market reach metric", icon: <Zap size={16} />, color: "#FF9800" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "15px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,215,0,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ color: "#888", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {item.label}
                  </div>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <div style={{ fontSize: "1.2rem", color: "#fff", fontWeight: 700, margin: "5px 0" }}>{item.value}</div>
                <div style={{ fontSize: "0.65rem", color: "#555" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginTop: "24px" }}>
        {/* VIP LEADERBOARD */}
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(15,6,0,0.9), rgba(255,215,0,0.03))" }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 8 : 0,
              marginBottom: 20,
            }}
          >
            <h3 className="adm-style-25" style={{ margin: 0, color: "#FFD700", fontSize: "1.1rem" }}>
              <Star size={18} style={{ marginRight: 8, verticalAlign: "middle" }} /> VIP Customer Club (Top LTV)
            </h3>
            <span style={{ fontSize: "0.7rem", color: "#888" }}>Sorted by Total Lifetime Spend</span>
          </div>
          <div className="adm-style-104" style={{ border: "1px solid rgba(255,215,0,0.08)", borderRadius: 12, overflow: "hidden" }}>
            <table className="adm-style-105">
              <thead>
                <tr style={{ background: "rgba(255,215,0,0.05)" }}>
                  <th style={{ padding: "12px 20px", color: "#666", fontSize: "0.65rem" }}>RANK</th>
                  <th style={{ padding: "12px 20px", color: "#666", fontSize: "0.65rem" }}>CUSTOMER</th>
                  <th style={{ padding: "12px 20px", color: "#666", fontSize: "0.65rem" }}>ORDERS</th>
                  <th style={{ padding: "12px 20px", color: "#666", fontSize: "0.65rem" }}>LIFETIME VALUE</th>
                  <th style={{ padding: "12px 20px", color: "#666", fontSize: "0.65rem" }}>QUICK ACTION</th>
                </tr>
              </thead>
              <tbody>
                {ltvData.map((vip, idx) => (
                  <tr key={vip.mobile} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "15px 20px", fontWeight: 900, color: idx === 0 ? "#ffd700" : "#444" }}># {idx + 1}</td>
                    <td style={{ padding: "15px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#fff" }}>{vip.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "#666" }}>{vip.mobile}</div>
                    </td>
                    <td style={{ padding: "15px 20px", color: "#aaa" }}>{vip.count} Orders</td>
                    <td style={{ padding: "15px 20px", color: "#ffd700", fontWeight: 800 }}>₹{vip.total.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "15px 20px" }}>
                      <button
                        onClick={() =>
                          window.open(
                            `https://wa.me/91${vip.mobile}?text=Hi ${vip.name.split(" ")[0]}, as a VIP customer of Sri Ram Balaji, we have a special discount for you! Check out our new 2025 Price List.`,
                            "_blank"
                          )
                        }
                        style={{
                          background: "rgba(76,175,80,0.1)",
                          border: "1px solid rgba(76,175,80,0.3)",
                          color: "#4caf50",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <MessageCircle size={14} /> Send VIP Promo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

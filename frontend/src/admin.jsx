import "./admin.css";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, ShoppingBag, Package, Tag, Image as ImageIcon, Users, 
  Search, Lock, LogOut, Menu, IndianRupee, Clock, Heart, 
  AlertCircle, ClipboardList, Diamond, Zap, MessageSquare, 
  Download, Calendar, MapPin, Phone, CheckCircle, XCircle, 
  Trash2, Edit, Plus, ArrowRight, RefreshCw, BarChart3, TrendingUp, Star, MessageCircle
} from "lucide-react";

// API base — when running frontend in CRA (port 3000) and backend on 5003
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5005"
  : "https://ecom-rne9.onrender.com";

// ============================================================
// STATUS COLORS
// ============================================================
const STATUS_COLORS = {
  Pending: {
    bg: "rgba(255,152,0,0.15)",
    border: "rgba(255,152,0,0.4)",
    color: "#FF9800",
  },
  Confirmed: {
    bg: "rgba(33,150,243,0.15)",
    border: "rgba(33,150,243,0.4)",
    color: "#2196F3",
  },
  Shipped: {
    bg: "rgba(156,39,176,0.15)",
    border: "rgba(156,39,176,0.4)",
    color: "#9C27B0",
  },
  Delivered: {
    bg: "rgba(76,175,80,0.15)",
    border: "rgba(76,175,80,0.4)",
    color: "#4CAF50",
  },
  Cancelled: {
    bg: "rgba(244,67,54,0.15)",
    border: "rgba(244,67,54,0.4)",
    color: "#F44336",
  },
};
const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function renderImage(img, className) {
  if (!img) return "🎇";
  if (typeof img !== 'string') return img;
  if (img.startsWith("/") || img.startsWith("http")) {
    const src = img.startsWith("/") ? `${API_BASE}${img}` : img;
    return <img src={src} alt="product" className={className} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />;
  }
  return img;
}

// ============================================================
// ADMIN LOGIN
// ============================================================
function AdminLogin({ onLogin }) {
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: creds.username,
          password: creds.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // store token and notify parent
        try {
          localStorage.setItem("token", data.token);
        } catch (e) { }
        onLogin();
      } else {
        // If login failed and the user entered a short username (no @),
        // try appending a default domain (dev convenience) and retry once.
        if (!creds.username.includes("@")) {
          try {
            const alt = creds.username + "@example.com";
            const retry = await fetch(`${API_BASE}/api/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: alt,
                password: creds.password,
              }),
            });
            const retryData = await retry.json();
            if (retry.ok && retryData.token) {
              try {
                localStorage.setItem("token", retryData.token);
              } catch (e) { }
              onLogin();
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore and fallthrough to error
          }
        }
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Network error");
    }
    setLoading(false);
  };
  return (
    <div className="adm-style-1">

      {/* BG */}
      <div className="adm-style-2" />

      <div className="adm-style-3">
        <div className="adm-style-4">
          <div className="adm-style-5"><Lock size={48} color="#FFD700" /></div>
          <h1 className="adm-style-6">Admin Portal</h1>
          <p className="adm-style-7">Sri Ram Balaji Agency Management</p>
        </div>

        <div className="adm-style-8">
          <label className="adm-style-9">Username</label>
          <input
            value={creds.username}
            onChange={(e) =>
              setCreds((c) => ({
                ...c,
                username: e.target.value,
              }))
            }
            placeholder="Enter username"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="adm-style-10"
          />
        </div>
        <div className="adm-style-11">
          <label className="adm-style-12">Password</label>
          <input
            type="password"
            value={creds.password}
            onChange={(e) =>
              setCreds((c) => ({
                ...c,
                password: e.target.value,
              }))
            }
            placeholder="Enter password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="adm-style-13"
          />
        </div>

        {error && <div className="adm-style-14">{error}</div>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="adm-style-15"
        >
          {loading ? "Authenticating..." : "Sign In to Dashboard"}
        </button>

        <p className="adm-style-16">
          Protected by JWT Authentication &nbsp;|&nbsp; Sri Ram Ballaji Agency
        </p>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ active, onNav, collapsed, onToggle }) {
  const items = [
    ["dashboard", <LayoutDashboard size={18} />, "Dashboard"],
    ["orders", <Package size={18} />, "Orders"],
    ["products", <ShoppingBag size={18} />, "Products"],
    ["coupons", <Tag size={18} />, "Coupons"],
    ["banners", <ImageIcon size={18} />, "Banners"],
    ["users", <Users size={18} />, "Users"],
  ];
  return (
    <aside
      style={{
        width: collapsed ? 60 : 220,
        background: "rgba(8,3,0,0.97)",
        borderRight: "1px solid rgba(255,215,0,0.1)",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 50,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 12px",
          borderBottom: "1px solid rgba(255,215,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/RamBalajiShop-AppIcon.png" alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span className="adm-style-17">Admin</span>
          </div>
        )}
        <button onClick={onToggle} className="adm-style-18">
          <Menu size={20} />
        </button>
      </div>
      <nav className="adm-style-19">
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "11px 12px",
              borderRadius: 10,
              border: "none",
              marginBottom: 4,
              cursor: "pointer",
              background:
                active === id
                  ? "linear-gradient(135deg,rgba(255,107,53,0.3),rgba(255,215,0,0.15))"
                  : "transparent",
              color: active === id ? "#FFD700" : "#888",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              fontWeight: active === id ? 700 : 400,
              transition: "all 0.2s",
              textAlign: "left",
              borderLeft:
                active === id ? "3px solid #FFD700" : "3px solid transparent",
            }}
          >
            <span className="adm-style-20">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ products, orders, refreshData, lastUpdated, onNav }) {
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
    const city = (typeof o.customer === 'object' ? o.customer.city : o.city) || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  const repeatCustomers = orders.reduce((acc, o) => {
    const mob = (typeof o.customer === 'object' ? o.customer.mobile : o.mobile);
    if (!mob) return acc;
    acc[mob] = (acc[mob] || 0) + 1;
    return acc;
  }, {});
  const loyaltyCount = Object.values(repeatCustomers).filter(v => v > 1).length;

  const ltvData = Object.entries(orders.reduce((acc, o) => {
    const mob = typeof o.customer === 'object' ? o.customer.mobile : o.mobile;
    const name = typeof o.customer === 'object' ? o.customer.name : (o.customer || "Guest");
    if (!mob) return acc;
    if (!acc[mob]) acc[mob] = { name, total: 0, count: 0, mobile: mob };
    acc[mob].total += o.total;
    acc[mob].count += 1;
    return acc;
  }, {})).sort((a, b) => b[1].total - a[1].total).slice(0, 5).map(x => x[1]);

  return (
    <div className="adm-style-129-inner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div>
          <h1 style={{ ...pageTitle, margin: 0 }}>Business Command Center</h1>
          <div style={{ color: '#4caf50', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
            <span className="live-pulse"></span>
            Sync Frequency: 5m | Last Update: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'}
          </div>
        </div>
        <button onClick={refreshData} style={{ ...actionBtn, padding: '8px 15px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Force Refresh
        </button>
      </div>

      <div className="adm-style-21">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ border: `1px solid ${s.alert ? s.color + "66" : "rgba(255,215,0,0.12)"}`, position: 'relative', overflow: 'hidden', padding: '10px 15px', borderRadius: 10 }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '10px' }}>Real-time sync enabled</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px', marginTop: '24px' }}>
        {/* RECENT ACTIVITY */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="adm-style-25" style={{ margin: 0 }}>Recent Flux Orders</h3>
            <span style={{ fontSize: '0.7rem', color: '#ffd700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => onNav("orders")}>
              View All <ArrowRight size={12} />
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.06)', borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                    {typeof o.customer === 'object' ? o.customer.name : (o.customer || "Guest Customer")}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#666' }}>{o.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#ffd700', fontWeight: 700 }}>₹{o.total}</div>
                  <StatusBadge status={o.status} small />
                </div>
              </div>
            ))}
            {orders.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: 20 }}>No flux activity.</div>}
          </div>
        </div>

        {/* INTERESTING INSIGHTS */}
        <div style={cardStyle}>
          <h3 className="adm-style-25" style={{ marginBottom: '20px' }}>Interesting Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {[
               { label: "Avg. Order Value", value: `₹${aov.toLocaleString("en-IN")}`, sub: "Higher is better", icon: <TrendingUp size={16} />, color: "#4CAF50" },
               { label: "Top Active City", value: topCity, sub: "Highest demand area", icon: <MapPin size={16} />, color: "#2196F3" },
               { label: "Repeat Buyers", value: loyaltyCount, sub: "Loyal customer base", icon: <Users size={16} />, color: "#FFD700" },
               { label: "Growth Potential", value: "84%", sub: "Market reach metric", icon: <Zap size={16} />, color: "#FF9800" }
             ].map((item, i) => (
                <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,215,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ color: '#888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                    <div style={{ color: item.color }}>{item.icon}</div>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, margin: '5px 0' }}>{item.value}</div>
                  <div style={{ fontSize: '0.65rem', color: '#555' }}>{item.sub}</div>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '24px' }}>
        {/* VIP LEADERBOARD */}
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(15,6,0,0.9), rgba(255,215,0,0.03))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="adm-style-25" style={{ margin: 0, color: '#FFD700', fontSize: '1.1rem' }}>
              <Star size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> VIP Customer Club (Top LTV)
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#888' }}>Sorted by Total Lifetime Spend</span>
          </div>
          <div className="adm-style-104" style={{ border: '1px solid rgba(255,215,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <table className="adm-style-105">
              <thead>
                <tr style={{ background: 'rgba(255,215,0,0.05)' }}>
                  <th style={{ padding: '12px 20px', color: '#666', fontSize: '0.65rem' }}>RANK</th>
                  <th style={{ padding: '12px 20px', color: '#666', fontSize: '0.65rem' }}>CUSTOMER</th>
                  <th style={{ padding: '12px 20px', color: '#666', fontSize: '0.65rem' }}>ORDERS</th>
                  <th style={{ padding: '12px 20px', color: '#666', fontSize: '0.65rem' }}>LIFETIME VALUE</th>
                  <th style={{ padding: '12px 20px', color: '#666', fontSize: '0.65rem' }}>QUICK ACTION</th>
                </tr>
              </thead>
              <tbody>
                {ltvData.map((vip, idx) => (
                  <tr key={vip.mobile} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 900, color: idx === 0 ? '#ffd700' : '#444' }}># {idx + 1}</td>
                    <td style={{ padding: '15px 20px' }}>
                       <div style={{ fontWeight: 700, color: '#fff' }}>{vip.name}</div>
                       <div style={{ fontSize: '0.7rem', color: '#666' }}>{vip.mobile}</div>
                    </td>
                    <td style={{ padding: '15px 20px', color: '#aaa' }}>{vip.count} Orders</td>
                    <td style={{ padding: '15px 20px', color: '#ffd700', fontWeight: 800 }}>₹{vip.total.toLocaleString("en-IN")}</td>
                    <td style={{ padding: '15px 20px' }}>
                       <button 
                         onClick={() => window.open(`https://wa.me/91${vip.mobile}?text=Hi ${vip.name.split(" ")[0]}, as a VIP customer of Sri Ram Balaji, we have a special discount for you! Check out our new 2025 Price List.`, "_blank")}
                         style={{ 
                           background: 'rgba(76,175,80,0.1)', 
                           border: '1px solid rgba(76,175,80,0.3)', 
                           color: '#4caf50', 
                           padding: '6px 12px', 
                           borderRadius: 8, 
                           fontSize: '0.7rem', 
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: 5
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

// ============================================================
// ORDERS MANAGEMENT
// ============================================================
function OrdersPage({ orders, setOrders }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  let filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (
      search &&
      !o.customer.toLowerCase().includes(search.toLowerCase()) &&
      !o.id.includes(search)
    )
      return false;
    return true;
  });
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                ...o,
                status,
              }
              : o,
          ),
        );
      }
    } catch (e) {
      console.error("Status update failed", e);
    }
  };
  const exportToCSV = () => {
    const rows = [
      [
        "Order ID",
        "Customer",
        "Mobile",
        "City",
        "Total",
        "Items",
        "Payment",
        "Status",
        "Date",
      ],
    ];
    orders.forEach((o) =>
      rows.push([
        o.id,
        o.customer,
        o.mobile,
        o.city,
        "₹" + o.total,
        o.items,
        o.payment,
        o.status,
        o.date,
      ]),
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "orders.csv";
    a.click();
  };
  return (
    <div>
      <div className="adm-style-39">
        <h1 style={pageTitle}>Order Management</h1>
        <button onClick={exportToCSV} style={{ ...actionBtn, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={18} /> Export to Excel
        </button>
      </div>

      <div className="adm-style-40">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            style={{
              ...inputStyle,
              width: '100%',
              paddingLeft: 40
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Status</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="adm-style-41">
        {["All", ...STATUSES].map((s) => {
          const c =
            s === "All"
              ? orders.length
              : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: statusFilter === s ? 700 : 400,
                background:
                  statusFilter === s ? "rgba(255,215,0,0.15)" : "transparent",
                borderColor:
                  statusFilter === s ? "#FFD700" : "rgba(255,255,255,0.15)",
                color: statusFilter === s ? "#FFD700" : "#888",
              }}
            >
              {s} ({c})
            </button>
          );
        })}
      </div>

      <div className="adm-style-42">
        {filtered.map((o) => (
          <div key={o.id} style={cardStyle}>
            <div className="adm-style-43">
              <div className="adm-style-44">
                <div className="adm-style-45">{o.id}</div>
                <div className="adm-style-46">{typeof o.customer === 'object' ? o.customer.name : o.customer}</div>
                <div className="adm-style-47" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <Phone size={14} /> {o.customer?.mobile || o.mobile} &nbsp;|&nbsp; <MapPin size={14} /> {o.customer?.city || o.city}
                </div>
                <div className="adm-style-48" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <Calendar size={14} /> {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : (o.date || "-")} &nbsp;|&nbsp; <Package size={14} /> {Array.isArray(o.items) ? o.items.length : (o.items || 0)} items
                </div>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.isArray(o.items) && o.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'rgba(0,0,0,0.2)' }}>
                          {renderImage(item.image || (item.images && item.images[0]), "adm-item-img")}
                       </div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#666' }}>₹{item.price} × {item.qty}</div>
                       </div>
                       <div style={{ fontSize: '0.8rem', color: '#ffd700', fontWeight: 700 }}>₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="adm-style-49">
                <div className="adm-style-50">₹{o.total}</div>
                <div className="adm-style-51">
                  {typeof o.payment === 'object' ? (o.payment.status?.toUpperCase() || "PENDING") : (o.payment || "COD")}
                </div>
                {o.txn !== "-" && <div className="adm-style-52">{o.txn}</div>}
              </div>
              <div className="adm-style-53">
                <StatusBadge status={o.status} />
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  style={{
                    ...selectStyle,
                    fontSize: "0.78rem",
                    padding: "5px 10px",
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState icon={<Package size={48} />} msg="No orders found" />}
    </div>
  );
}

// ============================================================
// PRODUCTS MANAGEMENT
// ============================================================
function ProductsPage({ products, setProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Sparklers",
    price: "",
    mrp: "",
    stock: "",
    discount: "",
    emoji: "🎇",
    status: "active",
  });
  const openAdd = () => {
    setForm({
      name: "",
      category: "Sparklers",
      price: "",
      mrp: "",
      stock: "",
      discount: "",
      emoji: "🎇",
      status: "active",
    });
    setEditItem(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({
      ...p,
    });
    setEditItem(p.id || p._id);
    setShowForm(true);
  };
  const [imageFile, setImageFile] = useState(null);
  const save = async () => {
    if (!form.name || !form.price) return;
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch (e) {
        return null;
      }
    })();
    try {
      const url = editItem
        ? `${API_BASE}/api/admin/products/${editItem}`
        : `${API_BASE}/api/admin/products`;
      // If an image file is selected, use FormData so backend multer can handle it
      let res;
      if (imageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description || "");
        fd.append("category", form.category);
        fd.append("price", form.price);
        fd.append("mrp", form.mrp);
        fd.append("discount", form.discount);
        fd.append("stock", form.stock);
        fd.append("images", imageFile);
        res = await fetch(url, {
          method: editItem ? "PUT" : "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: fd,
        });
      } else {
        const body = {
          name: form.name,
          description: form.description || "",
          category: form.category,
          price: Number(form.price),
          mrp: Number(form.mrp),
          discount: Number(form.discount),
          stock: Number(form.stock),
        };
        res = await fetch(url, {
          method: editItem ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        const saved = await res.json();
        // Update local state from server response
        if (editItem)
          setProducts((prev) =>
            prev.map((p) =>
              p._id === saved._id || p.id === saved._id || p.id === saved.id
                ? {
                  ...saved,
                  id: saved._id || saved.id,
                }
                : p,
            ),
          );
        else
          setProducts((prev) => [
            {
              ...saved,
              id: saved._id || saved.id,
            },
            ...prev,
          ]);
        setShowForm(false);
        setImageFile(null);
      } else {
        const err = await res.json().catch(() => ({
          error: "Save failed",
        }));
        alert(err.error || "Save failed");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch (e) {
        return null;
      }
    })();
    try {
      // id may be _id or id
      const realId = id._id ? id._id : id;
      const res = await fetch(`${API_BASE}/api/admin/products/${realId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok)
        setProducts((prev) =>
          prev.filter((p) => (p._id || p.id) !== realId && p.id !== realId),
        );
      else {
        const err = await res.json().catch(() => ({
          error: "Delete failed",
        }));
        alert(err.error || "Delete failed");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };
  const CATEGORIES = [
    "Sparklers",
    "Rockets",
    "Flower Pots",
    "Ground Chakkars",
    "Gift Boxes",
    "Kids Crackers",
  ];
  const EMOJIS = [
    "🎇",
    "🚀",
    "🌸",
    "🌀",
    "🎁",
    "🧨",
    "✨",
    "🎆",
    "🌺",
    "🎊",
    "🎉",
    "🐍",
  ];
  return (
    <div>
      <div className="adm-style-54">
        <h1 style={pageTitle}>Product Management</h1>
        <button onClick={openAdd} style={actionBtn}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 24,
            border: "1px solid rgba(255,215,0,0.3)",
          }}
        >
          <h3 className="adm-style-55">
            {editItem ? "Edit Product" : "Add New Product"}
          </h3>
          <div className="adm-style-56">
            {[
              ["name", "Product Name"],
              ["price", "Sale Price (₹)"],
              ["mrp", "MRP (₹)"],
              ["stock", "Stock Quantity"],
              ["discount", "Discount %"],
            ].map(([f, l]) => (
              <div key={f}>
                <label style={labelStyle}>{l}</label>
                <input
                  value={form[f]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      [f]: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value,
                  }))
                }
                style={selectStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value,
                  }))
                }
                style={selectStyle}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Product Emoji</label>
              <div className="adm-style-57">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        emoji: e,
                      }))
                    }
                    style={{
                      fontSize: "1.4rem",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: `2px solid ${form.emoji === e ? "#FFD700" : "rgba(255,255,255,0.1)"}`,
                      background:
                        form.emoji === e
                          ? "rgba(255,215,0,0.15)"
                          : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(
                    e.target.files && e.target.files[0]
                      ? e.target.files[0]
                      : null,
                  )
                }
                className="adm-style-58"
              />
            </div>
          </div>
          <div className="adm-style-59">
            <button onClick={save} style={actionBtn}>
              {editItem ? "Update Product" : "Add Product"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                ...actionBtn,
                background: "rgba(255,255,255,0.08)",
                color: "#aaa",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="adm-style-60">
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              ...cardStyle,
              position: "relative",
              opacity: p.status === "inactive" ? 0.7 : 1,
            }}
          >
            {p.stock === 0 && <div className="adm-style-61">OUT OF STOCK</div>}
            {p.stock > 0 && p.stock < 5 && (
              <div className="adm-style-62">LOW STOCK</div>
            )}
            <div className="adm-style-63">
              {renderImage(p.images && p.images.length ? p.images[0] : (p.image || p.emoji), "adm-style-64")}
            </div>
            <div className="adm-style-65">{p.category}</div>
            <h3 className="adm-style-66">{p.name}</h3>
            <div className="adm-style-67">
              <span className="adm-style-68">₹{p.price}</span>
              <span className="adm-style-69">₹{p.mrp}</span>
              <span className="adm-style-70">{p.discount}% OFF</span>
            </div>
            <div className="adm-style-71">
              <span>
                Stock:{" "}
                <span
                  style={{
                    color:
                      p.stock === 0
                        ? "#F44336"
                        : p.stock < 5
                          ? "#FF9800"
                          : "#4CAF50",
                  }}
                >
                  {p.stock}
                </span>
              </span>
              <span>Sold: {p.sales}</span>
              <span
                style={{
                  color: p.status === "active" ? "#4CAF50" : "#888",
                }}
              >
                {p.status === "active" ? "● Active" : "○ Inactive"}
              </span>
            </div>
            <div className="adm-style-72">
              <button
                onClick={() => openEdit(p)}
                style={{
                  flex: 1,
                  ...actionBtn,
                  padding: "7px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => remove(p)} className="adm-style-73" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COUPONS
// ============================================================
function CouponsPage({ coupons, setCoupons }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    minOrder: "",
    maxUses: "",
  });
  const add = async () => {
    if (!form.code || !form.value) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          value: +form.value,
          minOrder: +form.minOrder,
          maxUses: +form.maxUses,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setCoupons((prev) => [saved, ...prev]);
        setShowForm(false);
        setForm({
          code: "",
          type: "percent",
          value: "",
          minOrder: "",
          maxUses: "",
        });
      }
    } catch (e) {
      console.error("Add coupon failed", e);
    }
  };
  const toggle = async (id, currentActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCoupons((prev) =>
          prev.map((c) => (c._id === id || c.id === id ? updated : c)),
        );
      }
    } catch (e) {
      console.error("Toggle coupon failed", e);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => (c._id || c.id) !== id));
      }
    } catch (e) {
      console.error("Remove coupon failed", e);
    }
  };
  return (
    <div>
      <div className="adm-style-74">
        <h1 style={pageTitle}>Coupon Management</h1>
        <button onClick={() => setShowForm((s) => !s)} style={{ ...actionBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={18} /> {showForm ? "Close Form" : "Create Coupon"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 24,
            border: "1px solid rgba(255,215,0,0.3)",
          }}
        >
          <h3 className="adm-style-75">New Coupon</h3>
          <div className="adm-style-76">
            <div>
              <label style={labelStyle}>Code</label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="SAVE20"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value,
                  }))
                }
                style={selectStyle}
              >
                <option value="percent">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                Value ({form.type === "percent" ? "%" : "₹"})
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    value: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Min Order (₹)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    minOrder: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Max Uses</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maxUses: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>
          </div>
          <div className="adm-style-77">
            <button onClick={add} style={{ ...actionBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Create Coupon
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                ...actionBtn,
                background: "rgba(255,255,255,0.08)",
                color: "#aaa",
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="adm-style-78">
        {coupons.map((c) => (
          <div
            key={c.code}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div className="adm-style-79">{c.code}</div>
            <div className="adm-style-80">
              <div className="adm-style-81">
                {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
              </div>
              <div className="adm-style-82">
                Min order: ₹{c.minOrder} &nbsp;|&nbsp; {c.uses}/{c.maxUses} used
              </div>
            </div>
            <div className="adm-style-83">
              <div
                style={{
                  background: c.isActive
                    ? "rgba(76,175,80,0.15)"
                    : "rgba(158,158,158,0.15)",
                  border: `1px solid ${c.isActive ? "rgba(76,175,80,0.4)" : "rgba(158,158,158,0.3)"}`,
                  color: c.isActive ? "#4CAF50" : "#9E9E9E",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                }}
              >
                {c.isActive ? "Active" : "Inactive"}
              </div>
              <button
                onClick={() => toggle(c._id || c.id, c.isActive)}
                className="adm-style-84"
              >
                {c.isActive ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => remove(c._id || c.id)}
                className="adm-style-85"
                style={{ padding: '6px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BANNERS
// ============================================================
function BannersPage({ banners, setBanners }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    emoji: "🔥",
  });

  const save = async () => {
    if (!form.title || !form.image) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const saved = await res.json();
        setBanners((prev) => [saved, ...prev]);
        setShowForm(false);
        setForm({ title: "", subtitle: "", image: "", emoji: "🔥" });
      }
    } catch (e) {
      console.error("Save banner failed", e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this banner?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => (b._id || b.id) !== id));
      }
    } catch (e) {
      console.error("Delete banner failed", e);
    }
  };

  return (
    <div>
      <div className="adm-style-74">
        <h1 style={pageTitle}>Banner Management</h1>
        <button onClick={() => setShowForm((s) => !s)} style={{ ...actionBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={18} /> {showForm ? "Close Form" : "Create Banner"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, marginBottom: 24, border: "1px solid rgba(255,215,0,0.3)" }}>
          <h3 className="adm-style-75">New Mobile Banner</h3>
          <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: 15 }}>
            These appear in the top scrolling section of the shop mobile view.
          </p>
          <div className="adm-style-76">
            <div>
              <label style={labelStyle}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Diwali Dhamaka"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Subtitle</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Get 50% Off"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Emoji</label>
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="🔥"
                style={{ ...inputStyle, textAlign: "center", fontSize: "1.2rem" }}
              />
            </div>
          </div>
          <div className="adm-style-77" style={{ marginTop: 20 }}>
            <button onClick={save} style={{ ...actionBtn, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={16} /> Save Banner</button>
            <button
              onClick={() => setShowForm(false)}
              style={{ ...actionBtn, background: "rgba(255,255,255,0.08)", color: "#aaa", marginLeft: 10, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="adm-style-78">
        {banners.map((b) => (
          <div
            key={b._id}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 80, height: 50, borderRadius: 8, overflow: "hidden", background: "#333" }}>
              <img
                src={b.image.startsWith("/") ? `${API_BASE}${b.image}` : b.image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#FFD700" }}>{b.emoji} {b.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>{b.subtitle}</div>
            </div>
             <button onClick={() => remove(b._id || b.id)} className="adm-style-85" style={{ padding: '6px' }}>
                <Trash2 size={16} />
             </button>
          </div>
        ))}
        {banners.length === 0 && <EmptyState icon={<ImageIcon size={48}/>} msg="No banners active" />}
      </div>
    </div>
  );
}

// ============================================================
// USERS
// ============================================================
function UsersPage({ users }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.mobile.includes(search)
  );

  return (
    <div>
      <h1 style={pageTitle}>User Management</h1>
      <div className="adm-style-40" style={{ marginTop: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or mobile..."
            style={{ ...inputStyle, paddingLeft: 40 }}
          />
        </div>
      </div>

      <div className="adm-style-42">
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead style={{ background: "rgba(255,215,0,0.1)", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>NAME</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>MOBILE</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>SAVED ADDRESS</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,215,0,0.05)" }}>
                  <td style={{ padding: "12px 15px", fontSize: "0.85rem", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "12px 15px", fontSize: "0.85rem", color: "#FFD700" }}>{u.mobile}</td>
                  <td style={{ padding: "12px 15px", fontSize: "0.8rem", color: "#aaa" }}>
                    {u.address ? (
                      <div>
                        {u.address}, {u.city}<br />
                        {u.state} - {u.pincode}
                      </div>
                    ) : (
                      <span style={{ fontStyle: "italic", opacity: 0.5 }}>No address saved</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 15px", fontSize: "0.8rem", color: "#888" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length === 0 && <EmptyState icon={<Users size={48}/>} msg="No users found" />}
    </div>
  );
}


// ============================================================
// HELPERS
// ============================================================
function StatusBadge({ status, small }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        padding: small ? "2px 8px" : "4px 12px",
        borderRadius: 20,
        fontSize: small ? "0.68rem" : "0.75rem",
        fontWeight: 600,
      }}
    >
      {typeof status === 'object' ? (status.status || JSON.stringify(status)) : status}
    </span>
  );
}
function EmptyState({ icon, msg }) {
  return (
    <div className="adm-style-117">
      <div className="adm-style-118">{icon}</div>
      <div className="adm-style-119">{msg}</div>
    </div>
  );
}
const cardStyle = {
  background: "rgba(15,6,0,0.85)",
  border: "1px solid rgba(255,215,0,0.1)",
  borderRadius: 14,
  padding: "18px",
};
const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,215,0,0.2)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "0.85rem",
  outline: "none",
};
const selectStyle = {
  width: "100%",
  background: "rgba(15,5,0,0.9)",
  border: "1px solid rgba(255,215,0,0.2)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "0.85rem",
  cursor: "pointer",
};
const labelStyle = {
  color: "#888",
  fontSize: "0.77rem",
  display: "block",
  marginBottom: 6,
};
const pageTitle = {
  fontFamily: "'Outfit', sans-serif",
  color: "#FFD700",
  fontSize: "1.6rem",
  marginBottom: 0,
};
const actionBtn = {
  background: "linear-gradient(135deg,#FF6B35,#FFD700)",
  color: "#000",
  border: "none",
  borderRadius: 10,
  padding: "9px 18px",
  cursor: "pointer",
  fontWeight: 700,
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.82rem",
};

// ============================================================
// MAIN APP
// ============================================================
export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
      return;
    }

    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      // 2. Full Orders
      const allOrdersRes = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      // 3. Products
      const prodRes = await fetch(`${API_BASE}/api/products?limit=500`);

      // 4. Misc Admin Data
      const [userRes, cupRes, banRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/admin/coupons`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/banners`)
      ]);

      if (dashRes.ok && allOrdersRes.ok && prodRes.ok) {
        const dashData = await dashRes.json();
        const allOrders = await allOrdersRes.json();
        const pData = await prodRes.json();

        const rawProds = pData.products || pData || [];
        setProducts(rawProds.map(p => ({ ...p, id: p._id || p.id })));
        setOrders(allOrders.map(o => ({ ...o, id: o.orderId || o._id || o.id })));

        if (userRes.ok) setUsers(await userRes.json());
        if (cupRes.ok) setCoupons(await cupRes.json());
        if (banRes.ok) setBanners(await banRes.json());

        setLastUpdated(new Date());
        setAuth(true);
      } else if (dashRes.status === 401) {
        setAuth(false);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Critical Sync Error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetchData();
    // Real-time synchronization interval (30 seconds)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [auth]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050010', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="live-pulse" style={{ width: 40, height: 40 }}></div>
    </div>
  );

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;

  const MARGIN = sidebarCollapsed ? 60 : 220;

  return (
    <div className="adm-style-120" style={{ display: 'flex', minHeight: '100vh', background: '#050010' }}>

      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div style={{ flex: 1, marginLeft: MARGIN, transition: "margin 0.3s ease" }}>
        <header className="adm-style-121">
          <div className="adm-style-122">
            <span className="adm-style-123">Admin</span> / <span className="adm-style-124">{page}</span>
          </div>
          <div className="adm-style-125">
            <div className="adm-style-126">Live Feed Active</div>
            <span className="adm-style-127">Sri Ram Balaji Shop</span>
            <button className="adm-style-128" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => { localStorage.removeItem("token"); setAuth(false); }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main className="adm-style-129" >
          {page === "dashboard" && <Dashboard products={products} orders={orders} refreshData={fetchData} lastUpdated={lastUpdated} onNav={setPage} />}
          {page === "orders" && <OrdersPage orders={orders} setOrders={setOrders} />}
          {page === "products" && <ProductsPage products={products} setProducts={setProducts} />}
          {page === "coupons" && <CouponsPage coupons={coupons} setCoupons={setCoupons} />}
          {page === "banners" && <BannersPage banners={banners} setBanners={setBanners} />}
          {page === "users" && <UsersPage users={users} />}
        </main>
      </div>
    </div>
  );
}

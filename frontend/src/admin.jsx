import "./admin.css";
import { useState, useEffect } from "react";

// API base — when running frontend in CRA (port 3000) and backend on 5003
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5004";

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Playfair+Display:wght@400;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* BG */}
      <div className="adm-style-2" />

      <div className="adm-style-3">
        <div className="adm-style-4">
          <div className="adm-style-5">🔐</div>
          <h1 className="adm-style-6">Admin Portal</h1>
          <p className="adm-style-7">Sri Ram Ballaji Agency Management</p>
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
    ["dashboard", "📊", "Dashboard"],
    ["orders", "📦", "Orders"],
    ["products", "🛍️", "Products"],
    ["coupons", "🏷️", "Coupons"],
    ["banners", "🖼️", "Banners"],
    ["users", "👥", "Users"],
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
        {!collapsed && <span className="adm-style-17">🪔 Admin</span>}
        <button onClick={onToggle} className="adm-style-18">
          ☰
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
              fontFamily: "'Cinzel', serif",
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
function Dashboard({ products, orders }) {
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock < 5).length;
  const totalOrders = orders.length;
  const recentOrders = orders.slice(-5).reverse();
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: "🛍️",
      color: "#9C27B0",
      sub: "Active & Inactive",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: "📦",
      color: "#2196F3",
      sub: "All time",
    },
    {
      label: "Total Revenue",
      value: "₹" + totalRevenue.toLocaleString("en-IN"),
      icon: "💰",
      color: "#4CAF50",
      sub: "Excl. cancelled",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "⏳",
      color: "#FF9800",
      sub: "Needs attention",
      alert: pendingOrders > 0,
    },
    {
      label: "Low Stock Items",
      value: lowStock,
      icon: "⚠️",
      color: "#F44336",
      sub: "< 5 units",
      alert: lowStock > 0,
    },
  ];
  return (
    <div>
      <h1 style={pageTitle}>Dashboard Overview</h1>

      {/* Stats */}
      <div className="adm-style-21">
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(20,8,0,0.8)",
              border: `1px solid ${s.alert ? s.color + "66" : "rgba(255,215,0,0.12)"}`,
              borderRadius: 14,
              padding: "20px 18px",
              position: "relative",
              overflow: "hidden",
              boxShadow: s.alert ? `0 0 20px ${s.color}22` : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                fontSize: "3.5rem",
                opacity: 0.08,
              }}
            >
              {s.icon}
            </div>
            <div className="adm-style-22">{s.label}</div>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: s.color,
                fontFamily: "'Cinzel', serif",
              }}
            >
              {s.value}
            </div>
            <div className="adm-style-23">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="adm-style-24">
        {/* Recent Orders */}
        <div style={cardStyle}>
          <h3 className="adm-style-25">Recent Orders</h3>
          {recentOrders.map((o) => (
            <div key={o.id} className="adm-style-26">
              <div>
                <div className="adm-style-27">{typeof o.customer === 'object' ? o.customer.name : o.customer}</div>
                <div className="adm-style-28">{o.id}</div>
              </div>
              <div className="adm-style-29">
                <div className="adm-style-30">₹{o.total}</div>
                <StatusBadge status={o.status} small />
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div style={cardStyle}>
          <h3 className="adm-style-31">Top Products</h3>
          {topProducts.map((p, i) => (
            <div key={p.id} className="adm-style-32">
              <span className="adm-style-33">#{i + 1}</span>
              <span className="adm-style-34">{p.emoji}</span>
              <div className="adm-style-35">
                <div className="adm-style-36">{p.name}</div>
                <div className="adm-style-37">
                  {p.sales} sold • ₹{p.price}
                </div>
              </div>
              <div className="adm-style-38">
                {p.stock > 0 ? `${p.stock} left` : "Out"}
              </div>
            </div>
          ))}
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
        <button onClick={exportToCSV} style={actionBtn}>
          📥 Export to Excel
        </button>
      </div>

      <div className="adm-style-40">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search orders..."
          style={{
            ...inputStyle,
            flex: 1,
            minWidth: 200,
          }}
        />
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
                <div className="adm-style-47">
                  📞 {o.mobile} &nbsp;|&nbsp; 📍 {o.city}
                </div>
                <div className="adm-style-48">
                  📅 {o.date} &nbsp;|&nbsp; {o.items} items
                </div>
              </div>
              <div className="adm-style-49">
                <div className="adm-style-50">₹{o.total}</div>
                <div className="adm-style-51">{o.payment}</div>
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

      {filtered.length === 0 && <EmptyState icon="📦" msg="No orders found" />}
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
              {p.images &&
                p.images.length &&
                typeof p.images[0] === "string" &&
                p.images[0].startsWith("/uploads/") ? (
                <img
                  src={API_BASE + p.images[0]}
                  alt={p.name}
                  className="adm-style-64"
                />
              ) : (
                p.emoji
              )}
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
                }}
              >
                ✏️ Edit
              </button>
              <button onClick={() => remove(p)} className="adm-style-73">
                🗑️ Delete
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
        <button onClick={() => setShowForm((s) => !s)} style={actionBtn}>
          + Create Coupon
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
            <button onClick={add} style={actionBtn}>
              Create Coupon
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
              >
                🗑️
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
        <button onClick={() => setShowForm((s) => !s)} style={actionBtn}>
          + Create Banner
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
            <button onClick={save} style={actionBtn}>Save Banner</button>
            <button
              onClick={() => setShowForm(false)}
              style={{ ...actionBtn, background: "rgba(255,255,255,0.08)", color: "#aaa", marginLeft: 10 }}
            >
              Cancel
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
              <img src={b.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#FFD700" }}>{b.emoji} {b.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>{b.subtitle}</div>
            </div>
            <button onClick={() => remove(b._id || b.id)} className="adm-style-85">🗑️</button>
          </div>
        ))}
        {banners.length === 0 && <EmptyState icon="🖼️" msg="No banners active" />}
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
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search users by name or mobile..."
          style={{ ...inputStyle, flex: 1 }}
        />
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
      {filtered.length === 0 && <EmptyState icon="👥" msg="No users found" />}
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
      {status}
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
  fontFamily: "'Cinzel', serif",
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
  fontFamily: "'Cinzel', serif",
  fontSize: "0.82rem",
};

// ============================================================
// MAIN APP
// ============================================================
export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);

  // On mount or when loggedIn toggles, check for token and load data
  useEffect(() => {
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch (e) {
        return null;
      }
    })();
    if (!token) return;
    let mounted = true;
    const load = async () => {
      try {
        // fetch dashboard
        const dashRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (dashRes.ok) {
          const dash = await dashRes.json();
          if (!mounted) return;
          // recentOrders -> orders; other totals can be used in UI if needed
          if (dash.recentOrders)
            setOrders(
              dash.recentOrders.map((o) => ({
                id: o.orderId || o.orderId,
                ...o,
              })),
            );
        } else {
          // token invalid or unauthorized -> logout
          setLoggedIn(false);
          try {
            localStorage.removeItem("token");
          } catch (e) { }
          return;
        }

        // fetch all orders (admin)
        const allOrdersRes = await fetch(`${API_BASE}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (allOrdersRes.ok) {
          const allOrders = await allOrdersRes.json();
          if (mounted)
            setOrders(
              allOrders.map((o) => ({
                id: o.orderId || o._id || o.id,
                customer: o.customer?.name || o.customer?.name || "",
                total: o.total || 0,
                status: o.status || "Pending",
                date: o.createdAt
                  ? new Date(o.createdAt).toISOString().split("T")[0]
                  : "",
              })),
            );
        }

        // fetch products (public) and normalize fields for admin UI
        const prodRes = await fetch(`${API_BASE}/api/products?limit=200`);
        if (prodRes.ok) {
          const pjson = await prodRes.json();
          const raw = pjson.products || pjson || [];
          const normalized = raw.map((p) => ({
            ...p,
            id: p._id || p.id,
            sales: p.sales || p.salesCount || 0,
            emoji: p.images && p.images.length ? p.images[0] : p.emoji || "🎇",
            stock: typeof p.stock === "number" ? p.stock : p.stock || 0,
          }));
          if (mounted) setProducts(normalized);
        }

        // fetch banners
        const banRes = await fetch(`${API_BASE}/api/banners`);
        if (banRes.ok) {
          const bjson = await banRes.json();
          if (mounted) setBanners(bjson || []);
        }

        // fetch coupons (admin)
        const cupRes = await fetch(`${API_BASE}/api/admin/coupons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cupRes.ok) {
          const cjson = await cupRes.json();
          if (mounted) setCoupons(cjson || []);
        }

        // fetch users (admin)
        const userRes = await fetch(`${API_BASE}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userRes.ok) {
          const ujson = await userRes.json();
          if (mounted) setUsers(ujson || []);
        }
        // if everything good, mark logged in
        setLoggedIn(true);
      } catch (err) {
        console.error("Admin data load failed", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [loggedIn]);
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  const MARGIN = sidebarCollapsed ? 60 : 220;
  return (
    <div className="adm-style-120">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Playfair+Display:wght@400;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:#06020a; } ::-webkit-scrollbar-thumb { background:rgba(255,215,0,0.2); border-radius:3px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div
        style={{
          flex: 1,
          marginLeft: MARGIN,
          transition: "margin 0.3s ease",
        }}
      >
        {/* Topbar */}
        <header className="adm-style-121">
          <div className="adm-style-122">
            <span className="adm-style-123">Admin</span> /{" "}
            <span className="adm-style-124">{page}</span>
          </div>
          <div className="adm-style-125">
            <div className="adm-style-126">🟢 Live</div>
            <div className="adm-style-127">👤 Admin</div>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem("token");
                } catch (e) { }
                setLoggedIn(false);
              }}
              className="adm-style-128"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="adm-style-129">
          {page === "dashboard" && (
            <Dashboard products={products} orders={orders} />
          )}
          {page === "orders" && (
            <OrdersPage orders={orders} setOrders={setOrders} />
          )}
          {page === "products" && (
            <ProductsPage products={products} setProducts={setProducts} />
          )}
          {page === "coupons" && (
            <CouponsPage coupons={coupons} setCoupons={setCoupons} />
          )}
          {page === "banners" && (
            <BannersPage banners={banners} setBanners={setBanners} />
          )}
          {page === "users" && (
            <UsersPage users={users} />
          )}
        </main>
      </div>
    </div>
  );
}

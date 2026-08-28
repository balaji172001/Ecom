import React, { useState } from "react";
import { Search, Download, Phone, MapPin, Calendar, Package } from "lucide-react";
import { STATUSES, API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, selectStyle, renderImage } from "../utils/adminConstants";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

export default function AdminOrdersPage({ orders, setOrders }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  let filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    const name = typeof o.customer === "object" ? o.customer.name : o.customer;
    if (
      search &&
      !name?.toLowerCase().includes(search.toLowerCase()) &&
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
              : o
          )
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
    orders.forEach((o) => {
      const name = typeof o.customer === "object" ? o.customer.name : o.customer;
      const mob = typeof o.customer === "object" ? o.customer.mobile : o.mobile;
      const city = typeof o.customer === "object" ? o.customer.city : o.city;
      rows.push([
        o.id,
        name,
        mob,
        city,
        "₹" + o.total,
        o.items?.length || 0,
        typeof o.payment === "object" ? o.payment.status || "COD" : o.payment || "COD",
        o.status,
        o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date,
      ]);
    });
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
        <button onClick={exportToCSV} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={18} /> Export to Excel
        </button>
      </div>

      <div className="adm-style-40">
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#666" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            style={{
              ...inputStyle,
              width: "100%",
              paddingLeft: 40,
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
                <div className="adm-style-46">{typeof o.customer === "object" ? o.customer.name : o.customer}</div>
                <div className="adm-style-47" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Phone size={14} /> {o.customer?.mobile || o.mobile} &nbsp;|&nbsp; <MapPin size={14} /> {o.customer?.city || o.city}
                </div>
                <div className="adm-style-48" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Calendar size={14} /> {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date || "-"} &nbsp;|&nbsp; <Package size={14} /> {Array.isArray(o.items) ? o.items.length : o.items || 0} items
                </div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {Array.isArray(o.items) &&
                    o.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "rgba(0,0,0,0.2)" }}>
                          {renderImage(item.image || (item.images && item.images[0]), "adm-item-img")}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "#666" }}>₹{item.price} × {item.qty}</div>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#ffd700", fontWeight: 700 }}>
                          ₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="adm-style-49">
                <div className="adm-style-50">₹{o.total}</div>
                <div className="adm-style-51">
                  {typeof o.payment === "object" ? o.payment.status?.toUpperCase() || "PENDING" : o.payment || "COD"}
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

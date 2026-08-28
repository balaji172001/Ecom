import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, selectStyle, labelStyle } from "../utils/adminConstants";

export default function AdminCouponsPage({ coupons, setCoupons }) {
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
          prev.map((c) => (c._id === id || c.id === id ? updated : c))
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
        <button onClick={() => setShowForm((s) => !s)} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
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
            <button onClick={add} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={16} /> Create Coupon
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                ...actionBtn,
                background: "rgba(255,255,255,0.08)",
                color: "#aaa",
                display: "flex",
                alignItems: "center",
                gap: 6,
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
            key={c._id || c.id}
            className="adm-style-79"
            style={{ opacity: c.isActive ? 1 : 0.6 }}
          >
            <div className="adm-style-80">
              <div className="adm-style-81">
                <span className="adm-style-82">{c.code}</span>
                <span className="adm-style-83">
                  {c.type === "percent" ? `${c.value}% Off` : `₹${c.value} Off`}
                </span>
              </div>
              <div className="adm-style-84">
                <span>Min Order: ₹{c.minOrder}</span>
                <span>Max Uses: {c.maxUses}</span>
                <span>Used: {c.usedCount || 0} times</span>
              </div>
            </div>
            <div className="adm-style-85">
              <button
                onClick={() => toggle(c._id || c.id, c.isActive)}
                style={{
                  ...actionBtn,
                  background: c.isActive ? "rgba(244,67,54,0.1)" : "rgba(76,175,80,0.1)",
                  border: c.isActive ? "1px solid rgba(244,67,54,0.3)" : "1px solid rgba(76,175,80,0.3)",
                  color: c.isActive ? "#f44336" : "#4caf50",
                }}
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => remove(c._id || c.id)}
                style={{
                  ...actionBtn,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#aaa",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <p style={{ color: "#666", textAlign: "center", padding: 20 }}>No coupons configured.</p>}
      </div>
    </div>
  );
}

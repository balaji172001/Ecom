import React, { useState } from "react";
import { Plus, X, CheckCircle, Trash2 } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, labelStyle } from "../utils/adminConstants";

export default function AdminBannersPage({ banners, setBanners }) {
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
        <button onClick={() => setShowForm((s) => !s)} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
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
            <button onClick={save} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={16} /> Save Banner
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

      <div className="adm-style-140">
        {banners.map((b) => (
          <div key={b._id || b.id} style={{ ...cardStyle, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ width: 80, height: 48, borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
              <img
                src={b.image.startsWith("/") ? `${API_BASE}${b.image}` : b.image}
                alt="Banner"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                {b.emoji} {b.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#888" }}>{b.subtitle}</div>
            </div>
            <button
              onClick={() => remove(b._id || b.id)}
              className="adm-style-73"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ))}
        {banners.length === 0 && <p style={{ color: "#666", textAlign: "center", padding: 20 }}>No banners uploaded.</p>}
      </div>
    </div>
  );
}

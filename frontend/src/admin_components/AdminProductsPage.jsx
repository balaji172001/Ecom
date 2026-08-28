import React, { useState } from "react";
import { Edit, Trash2, Plus, CheckCircle, X } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, selectStyle, labelStyle, renderImage } from "../utils/adminConstants";

export default function AdminProductsPage({ products, setProducts }) {
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
  const [imageFile, setImageFile] = useState(null);

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
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      ...p,
    });
    setEditItem(p.id || p._id);
    setImageFile(null);
    setShowForm(true);
  };

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
        res = await fetch(url, {
          method: editItem ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(form),
        });
      }

      if (res.ok) {
        const saved = await res.json();
        const savedNormalized = { ...saved, id: saved._id || saved.id };
        if (editItem) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editItem || p._id === editItem ? savedNormalized : p))
          );
        } else {
          setProducts((prev) => [savedNormalized, ...prev]);
        }
        setShowForm(false);
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
      const realId = id._id ? id._id : id;
      const res = await fetch(`${API_BASE}/api/admin/products/${realId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((p) => (p._id || p.id) !== realId && p.id !== realId)
        );
      } else {
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
                      : null
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => remove(p)}
                className="adm-style-73"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

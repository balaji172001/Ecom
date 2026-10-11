import React, { useState } from "react";
import { Edit, Trash2, Plus, CheckCircle, X, Search, Layers, FolderPlus } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, selectStyle, labelStyle, renderImage } from "../utils/adminConstants";

export default function AdminProductsPage({ products, setProducts, categories = [], setCategories }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedCatFilter, setSelectedCatFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInlineAddCat, setShowInlineAddCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [catSaving, setCatSaving] = useState(false);

  // Compute all unique available categories
  const catNamesFromProps = categories.map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean);
  const catNamesFromProducts = products.map((p) => p.category).filter(Boolean);
  const allCategoryNames = Array.from(new Set([...catNamesFromProps, ...catNamesFromProducts])).sort((a, b) => a.localeCompare(b));

  const [form, setForm] = useState({
    name: "",
    category: allCategoryNames[0] || "Flash Light Crackers",
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
      category: allCategoryNames[0] || "Flash Light Crackers",
      price: "",
      mrp: "",
      stock: "",
      discount: "",
      emoji: "🎇",
      status: "active",
    });
    setEditItem(null);
    setImageFile(null);
    setShowInlineAddCat(false);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      category: p.category || allCategoryNames[0] || "Flash Light Crackers",
    });
    setEditItem(p.id || p._id);
    setImageFile(null);
    setShowInlineAddCat(false);
    setShowForm(true);
  };

  // Inline Category Creation from Product Form
  const handleInlineAddCategory = async () => {
    if (!newCatInput.trim()) return;
    const trimmed = newCatInput.trim();
    setCatSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok && res.status !== 400) {
        throw new Error(data.error || "Failed to create category");
      }

      if (setCategories) {
        setCategories((prev) => {
          const exists = prev.some((c) => (c.name || c) === trimmed);
          if (exists) return prev;
          return [...prev, data.category || data || { name: trimmed, id: trimmed }];
        });
      }

      // Automatically select the new category
      setForm((p) => ({ ...p, category: trimmed }));
      setNewCatInput("");
      setShowInlineAddCat(false);
    } catch (err) {
      alert(err.message || "Failed to add category");
    } finally {
      setCatSaving(false);
    }
  };

  const save = async () => {
    if (!form.name || form.price === "") {
      alert("Product name and price are required");
      return;
    }
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
        fd.append("category", form.category || "");
        fd.append("price", form.price);
        fd.append("mrp", form.mrp);
        fd.append("discount", form.discount || 0);
        fd.append("stock", form.stock || 0);
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

  // Filtering products
  const filteredProducts = products.filter((p) => {
    if (selectedCatFilter !== "All" && p.category !== selectedCatFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="adm-style-54" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={pageTitle}>Product Management</h1>
          <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: 4 }}>
            Showing {filteredProducts.length} of {products.length} products across all categories
          </p>
        </div>
        <button onClick={openAdd} style={actionBtn}>
          + Add Product
        </button>
      </div>

      {/* SEARCH AND CATEGORY FILTER CHIPS */}
      <div style={{ ...cardStyle, marginBottom: 24, padding: "16px" }}>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#777" }} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }}
          />
        </div>

        {/* Category Pills (with Counts) */}
        <div>
          <div style={{ fontSize: "0.76rem", color: "#FFD700", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}>
            <Layers size={14} /> Filter by Category:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 150, overflowY: "auto", paddingBottom: 4 }}>
            <button
              onClick={() => setSelectedCatFilter("All")}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid",
                fontSize: "0.74rem",
                cursor: "pointer",
                transition: "all 0.2s",
                background: selectedCatFilter === "All" ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "rgba(255,255,255,0.05)",
                borderColor: selectedCatFilter === "All" ? "transparent" : "rgba(255,215,0,0.18)",
                color: selectedCatFilter === "All" ? "#000" : "#ccc",
                fontWeight: selectedCatFilter === "All" ? 700 : 500,
              }}
            >
              All ({products.length})
            </button>

            {allCategoryNames.map((c) => {
              const count = products.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCatFilter(c)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedCatFilter === c ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "rgba(255,255,255,0.05)",
                    borderColor: selectedCatFilter === c ? "transparent" : "rgba(255,215,0,0.18)",
                    color: selectedCatFilter === c ? "#000" : "#ccc",
                    fontWeight: selectedCatFilter === c ? 700 : 500,
                  }}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 24,
            border: "1px solid rgba(255,215,0,0.35)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <h3 className="adm-style-55" style={{ color: "#FFD700", marginBottom: 16 }}>
            {editItem ? "Edit Product" : "Add New Product"}
          </h3>
          <div className="adm-style-56">
            {[
              ["name", "Product Name *"],
              ["price", "Sale Price (₹) *"],
              ["mrp", "MRP (₹) *"],
              ["stock", "Stock Quantity"],
              ["discount", "Discount %"],
            ].map(([f, l]) => (
              <div key={f}>
                <label style={labelStyle}>{l}</label>
                <input
                  value={form[f] ?? ""}
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

            {/* CATEGORY SELECTION WITH ADD CATEGORY OPTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Category *</label>
                <button
                  type="button"
                  onClick={() => setShowInlineAddCat(!showInlineAddCat)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FFD700",
                    cursor: "pointer",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <FolderPlus size={13} /> {showInlineAddCat ? "Cancel" : "+ Add New Category"}
                </button>
              </div>

              {showInlineAddCat ? (
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleInlineAddCategory}
                    disabled={catSaving || !newCatInput.trim()}
                    style={{ ...actionBtn, padding: "8px 14px", fontSize: "0.78rem" }}
                  >
                    {catSaving ? "Saving..." : "Add"}
                  </button>
                </div>
              ) : null}

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
                {allCategoryNames.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
              <div className="adm-style-57" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
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

          <div className="adm-style-59" style={{ display: "flex", gap: 10, marginTop: 20 }}>
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

      {/* PRODUCTS GRID */}
      <div className="adm-style-60">
        {filteredProducts.map((p) => (
          <div
            key={p.id || p._id}
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
            <div className="adm-style-65" style={{ color: "#FFD700", fontWeight: 600 }}>
              {p.category}
            </div>
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
              <span>Sold: {p.sales || 0}</span>
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

      {filteredProducts.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "#aaa" }}>No products found in this category or search filter.</p>
          <button
            onClick={() => {
              setSelectedCatFilter("All");
              setSearchQuery("");
            }}
            style={{ ...actionBtn, marginTop: 12, padding: "7px 16px" }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

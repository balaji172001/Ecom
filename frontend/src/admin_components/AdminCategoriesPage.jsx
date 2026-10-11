import React, { useState } from "react";
import { Layers, Plus, Edit2, Trash2, Search, CheckCircle, AlertCircle, ShoppingBag } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, labelStyle } from "../utils/adminConstants";

export default function AdminCategoriesPage({ categories = [], setCategories, products = [], setProducts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = (() => {
    try {
      return localStorage.getItem("token");
    } catch (e) {
      return null;
    }
  })();

  const openAdd = () => {
    setForm({ name: "", description: "" });
    setErrorMsg("");
    setSuccessMsg("");
    setShowAddModal(true);
  };

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setErrorMsg("");
    setSuccessMsg("");
    setShowEditModal(true);
  };

  // Create Category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg("Please enter a category name");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      const newCat = {
        ...data,
        id: data._id || data.id,
        productCount: 0,
      };

      setCategories((prev) => [...prev, newCat]);
      setSuccessMsg(`Category "${newCat.name}" created successfully!`);
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit / Rename Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !selectedCat) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const catId = selectedCat._id || selectedCat.id;
      const oldName = selectedCat.name;
      const newName = form.name.trim();

      const res = await fetch(`${API_BASE}/api/admin/categories/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name: newName, description: form.description }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update category");
      }

      // Update categories list
      setCategories((prev) =>
        prev.map((c) =>
          (c._id === catId || c.id === catId)
            ? { ...c, name: newName, description: form.description }
            : c
        )
      );

      // If category name changed, update products in local state too!
      if (oldName !== newName && setProducts) {
        setProducts((prev) =>
          prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p))
        );
      }

      setSuccessMsg(`Category renamed to "${newName}" and linked products updated!`);
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDelete = async (cat) => {
    const catId = cat._id || cat.id;
    const count = cat.productCount || products.filter((p) => p.category === cat.name).length;
    const confirmPrompt = count > 0
      ? `Delete category "${cat.name}"? Note: ${count} product(s) are currently under this category.`
      : `Are you sure you want to delete category "${cat.name}"?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/categories/${catId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => (c._id || c.id) !== catId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  // Combine product counts if not pre-aggregated
  const enrichedCategories = categories.map((cat) => {
    const count = typeof cat.productCount === "number"
      ? cat.productCount
      : products.filter((p) => p.category === cat.name).length;
    return { ...cat, productCount: count };
  });

  const filtered = enrichedCategories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;

  return (
    <div>
      {/* HEADER & ACTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={pageTitle}>Category Management</h1>
          <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: 4 }}>
            Manage cracker product categories shown to customers & available during product creation
          </p>
        </div>
        <button onClick={openAdd} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,215,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD700" }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{categories.length}</div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>Total Categories</div>
          </div>
        </div>

        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(76,175,80,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4CAF50" }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{totalProducts}</div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>Catalog Products</div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ ...cardStyle, marginBottom: 24, padding: "12px 16px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#777" }} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map((cat) => {
          const catId = cat._id || cat.id;
          return (
            <div
              key={catId}
              style={{
                ...cardStyle,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                transition: "transform 0.2s, border-color 0.2s",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,107,53,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B35" }}>
                      <Layers size={16} />
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFD700", margin: 0 }}>
                      {cat.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      background: cat.productCount > 0 ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.06)",
                      color: cat.productCount > 0 ? "#FFD700" : "#888",
                      border: `1px solid ${cat.productCount > 0 ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.1)"}`,
                      padding: "3px 9px",
                      borderRadius: 12,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    {cat.productCount} {cat.productCount === 1 ? "Product" : "Products"}
                  </span>
                </div>

                {cat.description && (
                  <p style={{ color: "#999", fontSize: "0.8rem", margin: "6px 0 14px 0", lineHeight: 1.4 }}>
                    {cat.description}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => openEdit(cat)}
                  style={{
                    flex: 1,
                    ...actionBtn,
                    padding: "7px 12px",
                    fontSize: "0.78rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: "rgba(255,215,0,0.12)",
                    color: "#FFD700",
                    border: "1px solid rgba(255,215,0,0.3)",
                  }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(244,67,54,0.3)",
                    background: "rgba(244,67,54,0.1)",
                    color: "#F44336",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
          <Layers size={36} color="#666" style={{ marginBottom: 12 }} />
          <h3 style={{ color: "#fff", marginBottom: 6 }}>No categories found</h3>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: 16 }}>
            {searchTerm ? `No category matching "${searchTerm}"` : "Click below to add your first category"}
          </p>
          <button onClick={openAdd} style={actionBtn}>
            + Add Category
          </button>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "100%",
              maxWidth: 440,
              border: "1px solid rgba(255,215,0,0.35)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <h2 style={{ color: "#FFD700", fontSize: "1.3rem", marginBottom: 16 }}>
              Add New Category
            </h2>

            {errorMsg && (
              <div style={{ background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.4)", color: "#F44336", padding: "8px 12px", borderRadius: 8, fontSize: "0.82rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)", color: "#4CAF50", padding: "8px 12px", borderRadius: 8, fontSize: "0.82rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle size={15} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ground Chakkar Special"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Short note about this category..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#aaa",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={actionBtn}>
                  {loading ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {showEditModal && selectedCat && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "100%",
              maxWidth: 440,
              border: "1px solid rgba(255,215,0,0.35)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <h2 style={{ color: "#FFD700", fontSize: "1.3rem", marginBottom: 16 }}>
              Edit Category
            </h2>

            {errorMsg && (
              <div style={{ background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.4)", color: "#F44336", padding: "8px 12px", borderRadius: 8, fontSize: "0.82rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)", color: "#4CAF50", padding: "8px 12px", borderRadius: 8, fontSize: "0.82rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle size={15} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Category Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 8, padding: "10px 12px", fontSize: "0.78rem", color: "#FFD700", marginBottom: 20 }}>
                💡 Renaming this category will automatically update all {selectedCat.productCount || 0} product(s) linked to it in the database.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#aaa",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={actionBtn}>
                  {loading ? "Updating..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

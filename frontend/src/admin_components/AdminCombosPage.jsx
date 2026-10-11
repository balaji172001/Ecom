import React, { useState } from "react";
import { Gift, Plus, Edit2, Trash2, CheckCircle, AlertCircle, X, Sparkles, Tag, Package } from "lucide-react";
import { API_BASE, pageTitle, actionBtn, cardStyle, inputStyle, labelStyle, selectStyle } from "../utils/adminConstants";

export default function AdminCombosPage({ combos = [], setCombos, products = [] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    mrp: "",
    description: "",
    icon: "🎁",
    items: [],
  });
  const [newItemText, setNewItemText] = useState("");
  const [selectedProductToAdd, setSelectedProductToAdd] = useState("");
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

  const EMOJI_OPTIONS = ["🎁", "✨", "🎉", "💥", "🔥", "🎇", "🎆", "⭐"];

  const openAdd = () => {
    setForm({
      name: "",
      price: "",
      mrp: "",
      description: "",
      icon: "🎁",
      items: [],
    });
    setNewItemText("");
    setSelectedProductToAdd("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowAddModal(true);
  };

  const openEdit = (combo) => {
    setSelectedCombo(combo);
    setForm({
      name: combo.name || "",
      price: combo.price || "",
      mrp: combo.mrp || "",
      description: combo.description || "",
      icon: combo.icon || "🎁",
      items: Array.isArray(combo.items) ? [...combo.items] : [],
    });
    setNewItemText("");
    setSelectedProductToAdd("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowEditModal(true);
  };

  // Add Item to combo's item list
  const addItem = () => {
    const text = newItemText.trim();
    if (text) {
      setForm((p) => ({ ...p, items: [...p.items, text] }));
      setNewItemText("");
    }
  };

  // Quick-add from catalog product dropdown
  const addProductItem = () => {
    if (selectedProductToAdd) {
      setForm((p) => ({ ...p, items: [...p.items, selectedProductToAdd] }));
      setSelectedProductToAdd("");
    }
  };

  // Remove Item from combo's item list
  const removeItem = (idx) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  // Create Combo
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      setErrorMsg("Combo name and offer price amount are required");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          mrp: Number(form.mrp) || Number(form.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create combo");

      const normalized = { ...data, id: data._id || data.id };
      setCombos((prev) => [normalized, ...prev]);
      setSuccessMsg(`Combo "${normalized.name}" created!`);
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

  // Update Combo
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "" || !selectedCombo) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const comboId = selectedCombo._id || selectedCombo.id;
      const res = await fetch(`${API_BASE}/api/admin/combos/${comboId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          mrp: Number(form.mrp) || Number(form.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update combo");

      const normalized = { ...data, id: data._id || data.id };
      setCombos((prev) =>
        prev.map((c) => (c._id === comboId || c.id === comboId ? normalized : c))
      );
      setSuccessMsg(`Combo "${normalized.name}" updated!`);
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

  // Delete Combo
  const handleDelete = async (combo) => {
    const comboId = combo._id || combo.id;
    if (!window.confirm(`Delete combo offer "${combo.name}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/combos/${comboId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        setCombos((prev) => prev.filter((c) => (c._id || c.id) !== comboId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete combo");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  return (
    <div>
      {/* HEADER & ACTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={pageTitle}>Combo Offers Management</h1>
          <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: 4 }}>
            Create and edit combo bundles, set offer amounts, and specify products included
          </p>
        </div>
        <button onClick={openAdd} style={{ ...actionBtn, display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Combo Offer
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,215,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD700" }}>
            <Gift size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{combos.length}</div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>Active Combo Offers</div>
          </div>
        </div>

        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,107,53,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B35" }}>
            <Tag size={22} />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>
              {combos.length > 0 ? `₹${Math.min(...combos.map((c) => c.price))}` : "₹0"}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>Starting Combo Price</div>
          </div>
        </div>
      </div>

      {/* COMBOS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {combos.map((c) => {
          const discount = c.mrp > c.price ? Math.round((1 - c.price / c.mrp) * 100) : 0;
          const comboId = c._id || c.id;

          return (
            <div
              key={comboId}
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg,rgba(30,10,0,0.94),rgba(50,18,0,0.9))",
                border: "1px solid rgba(255,215,0,0.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.8rem" }}>{c.icon || "🎁"}</span>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFD700", margin: 0 }}>
                        {c.name}
                      </h3>
                      {c.description && (
                        <p style={{ color: "#aaa", fontSize: "0.78rem", margin: "3px 0 0 0" }}>
                          {c.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {discount > 0 && (
                    <span
                      style={{
                        background: "rgba(255,107,53,0.2)",
                        color: "#FF6B35",
                        border: "1px solid rgba(255,107,53,0.4)",
                        padding: "3px 8px",
                        borderRadius: 12,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* PRICE / AMOUNT ROW */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "14px 0" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFD700" }}>
                    ₹{c.price}
                  </span>
                  {c.mrp > c.price && (
                    <span style={{ fontSize: "0.95rem", color: "#777", textDecoration: "line-through" }}>
                      ₹{c.mrp}
                    </span>
                  )}
                  <span style={{ fontSize: "0.75rem", color: "#4CAF50", fontWeight: 600 }}>
                    Save ₹{c.mrp - c.price}
                  </span>
                </div>

                {/* ITEMS LIST */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Included Items ({c.items?.length || 0}):
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.items && c.items.length > 0 ? (
                      c.items.map((it, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,215,0,0.15)",
                            borderRadius: 8,
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            color: "#eee",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <CheckCircle size={12} color="#4CAF50" /> {it}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "#666", fontSize: "0.75rem", fontStyle: "italic" }}>
                        No items specified yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  onClick={() => openEdit(c)}
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
                  <Edit2 size={13} /> Edit Offer & Amount
                </button>
                <button
                  onClick={() => handleDelete(c)}
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

      {combos.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
          <Gift size={36} color="#666" style={{ marginBottom: 12 }} />
          <h3 style={{ color: "#fff", marginBottom: 6 }}>No combo offers created yet</h3>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: 16 }}>
            Set up value packs with special offer prices for your customers
          </p>
          <button onClick={openAdd} style={actionBtn}>
            + Add Combo Offer
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
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
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid rgba(255,215,0,0.35)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <h2 style={{ color: "#FFD700", fontSize: "1.3rem", marginBottom: 16 }}>
              {showEditModal ? "Edit Combo Offer & Amount" : "Create New Combo Offer"}
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

            <form onSubmit={showEditModal ? handleUpdate : handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Combo Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Family Celebration Pack"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Offer Amount / Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1299"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2599"
                    value={form.mrp}
                    onChange={(e) => setForm((p) => ({ ...p, mrp: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Emoji / Icon</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: em }))}
                      style={{
                        fontSize: "1.3rem",
                        padding: "5px 10px",
                        borderRadius: 8,
                        background: form.icon === em ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.05)",
                        border: `2px solid ${form.icon === em ? "#FFD700" : "rgba(255,255,255,0.1)"}`,
                        cursor: "pointer",
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best value bundles for your celebration"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* ITEMS IN THE COMBO */}
              <div style={{ marginBottom: 18, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 10, border: "1px solid rgba(255,215,0,0.12)" }}>
                <label style={{ ...labelStyle, color: "#FFD700", fontWeight: 600 }}>
                  Included Items in this Combo:
                </label>

                {/* Quick add from catalog */}
                {products && products.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <select
                      value={selectedProductToAdd}
                      onChange={(e) => setSelectedProductToAdd(e.target.value)}
                      style={{ ...selectStyle, flex: 1 }}
                    >
                      <option value="">-- Quick Pick From Catalog --</option>
                      {products.map((pr) => (
                        <option key={pr.id || pr._id} value={pr.name}>
                          {pr.name} (₹{pr.price})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addProductItem}
                      disabled={!selectedProductToAdd}
                      style={{
                        ...actionBtn,
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        opacity: selectedProductToAdd ? 1 : 0.5,
                      }}
                    >
                      + Add
                    </button>
                  </div>
                )}

                {/* Manual text input */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Or type custom item name (e.g. 1000 Wala Garland)"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem();
                      }
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    disabled={!newItemText.trim()}
                    style={{
                      ...actionBtn,
                      padding: "6px 12px",
                      fontSize: "0.75rem",
                      opacity: newItemText.trim() ? 1 : 0.5,
                    }}
                  >
                    + Add
                  </button>
                </div>

                {/* Current items chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.items.map((it, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "rgba(255,215,0,0.12)",
                        border: "1px solid rgba(255,215,0,0.25)",
                        borderRadius: 8,
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {it}
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#F44336",
                          cursor: "pointer",
                          padding: 0,
                          display: "inline-flex",
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {form.items.length === 0 && (
                    <span style={{ color: "#777", fontSize: "0.75rem", fontStyle: "italic" }}>
                      No items added yet. Add items using the inputs above.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
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
                  {loading ? "Saving..." : showEditModal ? "Update Combo Offer" : "Create Combo Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

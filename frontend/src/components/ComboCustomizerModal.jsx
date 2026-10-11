import React, { useState } from "react";
import { X, CheckCircle, Plus, Minus, Trash2, Search, Gift, Sparkles, AlertCircle } from "lucide-react";
import { cardStyle, inputStyle, btnStyle } from "../utils/constants";

export default function ComboCustomizerModal({ combo, products = [], onClose, onAddComboToCart }) {
  if (!combo) return null;

  // Initialize selected items from default combo items
  const initialItems = (combo.items || []).map((name) => {
    // Attempt to match catalog product for price reference
    const matched = products.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return {
      name,
      qty: 1,
      price: matched ? matched.price : Math.round(combo.price / (combo.items.length || 1)),
      productId: matched?.id || null,
    };
  });

  const [itemsList, setItemsList] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pack"); // 'pack' or 'catalog'

  // Calculate total estimated retail value
  const totalValue = itemsList.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const budgetAmount = combo.price;
  const isWithinBudget = totalValue <= budgetAmount * 1.35; // Generous ceiling or comparison

  // Quantity helpers
  const updateQty = (index, delta) => {
    setItemsList((prev) => {
      const next = [...prev];
      const newQty = (next[index].qty || 1) + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index] = { ...next[index], qty: newQty };
      return next;
    });
  };

  const removeItem = (index) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add product from catalog
  const addProductToPack = (prod) => {
    setItemsList((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === prod.name);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + 1 };
        return next;
      }
      return [...prev, { name: prod.name, qty: 1, price: prod.price, productId: prod.id }];
    });
  };

  // Confirm and add bundle to cart
  const handleAddToCart = () => {
    if (itemsList.length === 0) {
      alert("Please include at least one item in your combo pack!");
      return;
    }

    const itemDescriptions = itemsList.map(
      (it) => `${it.qty > 1 ? `${it.qty}x ` : ""}${it.name}`
    );

    const comboBundle = {
      id: `combo_${combo._id || combo.name.replace(/\s+/g, '_')}_${Date.now()}`,
      name: `${combo.name} (Customized Pack)`,
      price: combo.price,
      mrp: combo.mrp || combo.price * 2,
      isCombo: true,
      comboDetails: combo,
      customItems: itemDescriptions,
      qty: 1,
      image: combo.icon || "🎁",
      category: "Combo Offer",
    };

    onAddComboToCart(comboBundle);
    onClose();
  };

  // Search filtered catalog products
  const filteredCatalog = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
  }).slice(0, 15);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
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
          maxWidth: 620,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(255,215,0,0.4)",
          boxShadow: "0 20px 60px rgba(255,107,53,0.3)",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg,rgba(40,15,0,0.95),rgba(20,5,0,0.95))",
            borderBottom: "1px solid rgba(255,215,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "2rem" }}>{combo.icon || "🎁"}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFD700", margin: 0 }}>
                  Customize {combo.name}
                </h2>
                <span
                  style={{
                    background: "rgba(76,175,80,0.2)",
                    color: "#4CAF50",
                    border: "1px solid rgba(76,175,80,0.4)",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  Combo Offer: ₹{budgetAmount}
                </span>
              </div>
              <p style={{ color: "#aaa", fontSize: "0.8rem", margin: "4px 0 0 0" }}>
                Edit and choose the crackers you want within your ₹{budgetAmount} offer pack!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* BUDGET STATUS BANNER */}
        <div
          style={{
            padding: "12px 24px",
            background: "rgba(255,215,0,0.06)",
            borderBottom: "1px solid rgba(255,215,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={16} color="#4CAF50" />
            <span style={{ fontSize: "0.84rem", color: "#eee" }}>
              Selected: <strong style={{ color: "#FFD700" }}>{itemsList.length} cracker items</strong>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.8rem", color: "#aaa" }}>You pay fixed combo price:</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFD700" }}>
              ₹{combo.price}
            </span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
          <button
            onClick={() => setActiveTab("pack")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "pack" ? "rgba(255,215,0,0.12)" : "transparent",
              color: activeTab === "pack" ? "#FFD700" : "#888",
              border: "none",
              borderBottom: activeTab === "pack" ? "2px solid #FFD700" : "2px solid transparent",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer",
            }}
          >
            Included in Pack ({itemsList.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "catalog" ? "rgba(255,215,0,0.12)" : "transparent",
              color: activeTab === "catalog" ? "#FFD700" : "#888",
              border: "none",
              borderBottom: activeTab === "catalog" ? "2px solid #FFD700" : "2px solid transparent",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer",
            }}
          >
            + Add Products From Shop
          </button>
        </div>

        {/* TAB CONTENT (SCROLLABLE) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {activeTab === "pack" && (
            <div>
              <p style={{ color: "#888", fontSize: "0.78rem", marginBottom: 12 }}>
                Increase/decrease quantities or remove items you don't need:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {itemsList.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,215,0,0.12)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <CheckCircle size={15} color="#4CAF50" style={{ flexShrink: 0 }} />
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <div style={{ color: "#fff", fontSize: "0.86rem", fontWeight: 600 }}>
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "2px 6px" }}>
                        <button
                          onClick={() => updateQty(idx, -1)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#FFD700",
                            cursor: "pointer",
                            padding: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700, minWidth: 16, textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#FFD700",
                            cursor: "pointer",
                            padding: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#F44336",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                {itemsList.length === 0 && (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#888" }}>
                    Your pack is empty! Switch to "+ Add Products From Shop" tab to select crackers.
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <button
                  onClick={() => setActiveTab("catalog")}
                  style={{
                    background: "rgba(255,215,0,0.1)",
                    border: "1px dashed rgba(255,215,0,0.3)",
                    color: "#FFD700",
                    borderRadius: 10,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  + Add More Crackers from Shop Catalog
                </button>
              </div>
            </div>
          )}

          {activeTab === "catalog" && (
            <div>
              {/* Search */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#777" }} />
                <input
                  type="text"
                  placeholder="Search crackers to add to this combo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {filteredCatalog.map((prod) => {
                  const inPack = itemsList.find((it) => it.name === prod.name);
                  return (
                    <div
                      key={prod.id || prod._id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>
                          {prod.name}
                        </div>
                        <div style={{ color: "#aaa", fontSize: "0.75rem" }}>
                          {prod.category} • ₹{prod.price}
                        </div>
                      </div>

                      <button
                        onClick={() => addProductToPack(prod)}
                        style={{
                          background: inPack ? "rgba(76,175,80,0.2)" : "rgba(255,215,0,0.15)",
                          border: `1px solid ${inPack ? "#4CAF50" : "#FFD700"}`,
                          color: inPack ? "#4CAF50" : "#FFD700",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Plus size={13} /> {inPack ? `Added (${inPack.qty})` : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: "16px 24px",
            background: "rgba(10,4,0,0.95)",
            borderTop: "1px solid rgba(255,215,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: "0.74rem", color: "#888", textTransform: "uppercase" }}>Total Pack Price</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFD700" }}>
              ₹{combo.price} <span style={{ fontSize: "0.8rem", color: "#888", textDecoration: "line-through" }}>₹{combo.mrp}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#ccc",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              style={{
                ...btnStyle("primary"),
                padding: "10px 22px",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Gift size={16} /> Add Customized Combo to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

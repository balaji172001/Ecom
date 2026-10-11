import React, { useState } from "react";
import { API_BASE, cardStyle, qtyBtn, btnStyle, renderImage } from "../utils/constants";

export default function CartPage({ cart, onUpdate, onRemove, onNavigate }) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal - discAmt;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      setCouponMsg("⌛ Validating...");
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscount(data.value); // Backend returns the % or flat value
        setCouponMsg(`✅ Coupon applied: ${data.value}${data.type === "percent" ? "%" : " flat"} off!`);
      } else {
        setCouponMsg(`❌ ${data.error || "Invalid coupon"}`);
        setDiscount(0);
      }
    } catch (err) {
      setCouponMsg("❌ Connection error");
      setDiscount(0);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="idx-style-134">
        <div className="idx-style-135">🛒</div>
        <h2 className="idx-style-136">Your cart is empty</h2>
        <p className="idx-style-137">Browse 75 products and add your favourites!</p>
        <button onClick={() => onNavigate("products")} style={btnStyle("primary")}>
          Shop Now 🎆
        </button>
      </div>
    );
  }

  return (
    <div className="idx-style-138">
      <h1 className="idx-style-139">
        Shopping Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
      </h1>
      <div className="idx-style-140">
        {/* Items */}
        <div className="idx-style-141">
          {cart.map((item) => {
            const d = Math.round((1 - item.price / item.mrp) * 100);
            return (
              <div
                key={item.id}
                style={{
                  ...cardStyle,
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div className="idx-style-142">{renderImage(item.image, "idx-style-142-img")}</div>
                <div className="idx-style-143" style={{ flex: 1, minWidth: 200 }}>
                  <div className="idx-style-144">
                    {item.isCombo ? "🎁 Combo Pack" : `${item.category || "Crackers"}${item.unit ? ` • ${item.unit}` : ""}`}
                  </div>
                  <div className="idx-style-145">{item.name}</div>
                  <div className="idx-style-146">
                    <span className="idx-style-147">₹{item.price}</span>
                    {item.mrp > item.price && <span className="idx-style-148">₹{item.mrp}</span>}
                    {d > 0 && <span className="idx-style-149">{d}% OFF</span>}
                  </div>
                  {item.customItems && item.customItems.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ color: "#FFD700", fontWeight: 600, fontSize: "0.72rem", marginBottom: 3 }}>
                        Included Items ({item.customItems.length}):
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {item.customItems.map((ci, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "rgba(255,215,0,0.1)",
                              border: "1px solid rgba(255,215,0,0.25)",
                              color: "#eee",
                              borderRadius: 4,
                              padding: "1px 6px",
                              fontSize: "0.7rem",
                            }}
                          >
                            ✓ {ci}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="idx-style-150">
                  <button onClick={() => onUpdate(item.id, item.qty - 1)} style={qtyBtn}>
                    −
                  </button>
                  <span className="idx-style-151">{item.qty}</span>
                  <button onClick={() => onUpdate(item.id, item.qty + 1)} style={qtyBtn}>
                    +
                  </button>
                </div>
                <div className="idx-style-152">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </div>
                <button onClick={() => onRemove(item.id)} className="idx-style-153">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        {/* Summary */}
        <div
          style={{
            ...cardStyle,
            position: "sticky",
            top: 80,
          }}
        >
          <h3 className="idx-style-154">Order Summary</h3>
          <div className="idx-style-155">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
              className="idx-style-156"
            />
            <button
              onClick={applyCoupon}
              style={{
                ...btnStyle("outline"),
                padding: "8px 12px",
                fontSize: "0.76rem",
              }}
            >
              Apply
            </button>
          </div>
          {couponMsg && (
            <div
              style={{
                fontSize: "0.76rem",
                color: couponMsg.startsWith("✅") ? "#4CAF50" : "#FF5252",
                marginBottom: 6,
              }}
            >
              {couponMsg}
            </div>
          )}
          {[
            ["Subtotal", `₹${subtotal.toLocaleString("en-IN")}`],
            ["Delivery", "Based on KM (via WhatsApp)"],
            ...(discount ? [["Discount", `-₹${discAmt.toLocaleString("en-IN")}`]] : []),
          ].map(([k, v]) => (
            <div key={k} className="idx-style-158">
              <span>{k}</span>
              <span
                style={{
                  color: k === "Discount" ? "#4CAF50" : k === "Delivery" ? "#FFD700" : "#ccc",
                  fontSize: k === "Delivery" ? "0.78rem" : undefined,
                }}
              >
                {v}
              </span>
            </div>
          ))}
          <div className="idx-style-159">
            <span>Total (Items)</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="idx-style-160" style={{ fontSize: "0.76rem", color: "#FFD700" }}>
            🚚 Delivery fee based on distance (KM) — sent on WhatsApp receipt
          </div>
          <button
            onClick={() => onNavigate("checkout")}
            style={{
              ...btnStyle("primary"),
              width: "100%",
              padding: "12px",
              fontSize: "0.92rem",
            }}
          >
            Proceed to Checkout →
          </button>
          <button
            onClick={() => onNavigate("products")}
            style={{
              ...btnStyle("ghost"),
              width: "100%",
              marginTop: 9,
              fontSize: "0.8rem",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

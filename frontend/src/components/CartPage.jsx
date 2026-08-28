import React, { useState } from "react";
import { API_BASE, cardStyle, qtyBtn, btnStyle, renderImage } from "../utils/constants";

export default function CartPage({ cart, onUpdate, onRemove, onNavigate }) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const discAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal + delivery - discAmt;

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
                <div className="idx-style-143">
                  <div className="idx-style-144">
                    {item.category} • {item.unit}
                  </div>
                  <div className="idx-style-145">{item.name}</div>
                  <div className="idx-style-146">
                    <span className="idx-style-147">₹{item.price}</span>
                    <span className="idx-style-148">₹{item.mrp}</span>
                    <span className="idx-style-149">{d}% OFF</span>
                  </div>
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
            ["Delivery", delivery === 0 ? "FREE 🎉" : `₹${delivery}`],
            ...(discount ? [["Discount", `-₹${discAmt.toLocaleString("en-IN")}`]] : []),
          ].map(([k, v]) => (
            <div key={k} className="idx-style-158">
              <span>{k}</span>
              <span
                style={{
                  color: k === "Discount" ? "#4CAF50" : "#ccc",
                }}
              >
                {v}
              </span>
            </div>
          ))}
          <div className="idx-style-159">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          {delivery > 0 && (
            <div className="idx-style-160">Add ₹{999 - subtotal} more for free delivery!</div>
          )}
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

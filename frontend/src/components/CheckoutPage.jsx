import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { cardStyle, inputStyle, btnStyle, renderImage } from "../utils/constants";

export default function CheckoutPage({ cart, onPlaceOrder, onNavigate, user }) {
  const getSavedAddress = () => {
    const saved = localStorage.getItem("sivakasicracker_saved_address");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.address)) return parsed;
      } catch (e) { }
    }
    return {
      name: user?.name || "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "Tamil Nadu",
      pincode: user?.pincode || ""
    };
  };

  const [saveDetails, setSaveDetails] = useState(true);
  const [form, setForm] = useState(getSavedAddress);
  const [method, setMethod] = useState("gpay");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;

  useEffect(() => {
    if (user?.address && !form.address) {
      setForm((p) => ({
        ...p,
        name: user.name || p.name,
        mobile: user.mobile || p.mobile,
        email: user.email || p.email,
        address: user.address || p.address,
        city: user.city || p.city,
        state: user.state || p.state,
        pincode: user.pincode || p.pincode
      }));
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Valid 10-digit mobile required";
    if (!form.address.trim()) e.address = "Address required";
    if (!form.city.trim()) e.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePayment = () => {
    if (!validate()) return;
    const orderId = "SRBA" + Date.now().toString().slice(-8).toUpperCase();

    // Auto-save address for future visits
    if (saveDetails) {
      localStorage.setItem("sivakasicracker_saved_address", JSON.stringify(form));
    }

    // Place order directly on the web app
    onPlaceOrder({ ...form, method, total, orderId, items: cart });
    onNavigate("success", orderId);
  };

  return (
    <div className="idx-style-161">
      <h1 className="idx-style-162">Checkout</h1>
      <p className="idx-style-163">Sri Ram Balaji Agency • Srivilliputtur</p>

      {/* Steps */}
      <div className="idx-style-164">
        {["User Details", "Payment"].map((s, i) => (
          <div key={s} className="idx-style-165">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: i < step ? "pointer" : "default"
              }}
              onClick={() => i < step && setStep(i + 1)}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  background: step > i + 1 ? "#4CAF50" : step === i + 1 ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "rgba(255,255,255,0.07)",
                  color: step >= i + 1 ? "#000" : "#666"
                }}
              >
                {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span
                style={{
                  color: step >= i + 1 ? "#FFD700" : "#555",
                  fontSize: "0.83rem",
                  fontWeight: step === i + 1 ? 700 : 400
                }}
              >
                {s}
              </span>
            </div>
            {i < 1 && (
              <div
                style={{
                  width: 36,
                  height: 2,
                  background: step > 1 ? "#4CAF50" : "rgba(255,255,255,0.07)",
                  margin: "0 10px"
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="idx-style-166">
        <div>
          {step === 1 && (
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 className="idx-style-167" style={{ margin: 0 }}>User & Delivery Details</h3>
                {form.address && (
                  <span style={{ fontSize: "0.75rem", color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "4px 8px", borderRadius: 6 }}>
                    ✓ Address Remembered
                  </span>
                )}
              </div>

              <div className="idx-style-168">
                {[
                  ["name", "Full Name", "text"],
                  ["mobile", "Mobile Number", "tel"],
                  ["email", "Email Address (Optional)", "email"],
                  ["address", "Full Delivery Address", "text"],
                  ["city", "City", "text"],
                  ["pincode", "Pincode", "text"]
                ].map(([f, l, t]) => (
                  <div
                    key={f}
                    style={{
                      gridColumn: f === "address" ? "1/-1" : "auto"
                    }}
                  >
                    <label className="idx-style-169">{l}</label>
                    <input
                      type={t}
                      value={form[f]}
                      onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                      style={{
                        ...inputStyle,
                        borderColor: errors[f] ? "#FF5252" : "rgba(255,215,0,0.2)"
                      }}
                    />
                    {errors[f] && <div className="idx-style-170">{errors[f]}</div>}
                  </div>
                ))}

                <div className="idx-style-171">
                  <label className="idx-style-172">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                    className="idx-style-173"
                  >
                    {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Delhi", "West Bengal"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remember Address Checkbox */}
              <div
                style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }}
                onClick={() => setSaveDetails(!saveDetails)}
              >
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={() => { }}
                  style={{ accentColor: "#FFD700", width: 16, height: 16 }}
                />
                <span style={{ fontSize: "0.82rem", color: "#ddd" }}>Save delivery address for future orders</span>
              </div>

              <button
                onClick={() => validate() && setStep(2)}
                style={{
                  ...btnStyle("primary"),
                  width: "100%",
                  padding: "12px",
                  marginTop: 18
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={cardStyle}>
              <h3 className="idx-style-177">Payment Method</h3>

              {/* COD Not Available Notice */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,82,82,0.1)",
                  border: "1px solid rgba(255,82,82,0.3)",
                  borderRadius: 12,
                  marginBottom: 16,
                  color: "#FF8A80",
                  fontSize: "0.85rem",
                  lineHeight: "1.4"
                }}
              >
                🚫 <strong>Cash on Delivery (COD) is NOT Available</strong><br />
                 COD is not accepted. Please pay online via GPay.
              </div>

              {/* GPay / UPI Payment Choice Only */}
              {[
                ["gpay", "📱 GPay / UPI", "Pay online via Google Pay / PhonePe / Paytm / BHIM"]
              ].map(([val, label, sub]) => (
                <div
                  key={val}
                  onClick={() => setMethod(val)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: 15,
                    borderRadius: 12,
                    marginBottom: 11,
                    cursor: "pointer",
                    border: `2px solid #FFD700`,
                    background: "rgba(255,215,0,0.06)",
                    transition: "all 0.2s"
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid #FFD700`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <div className="idx-style-178" />
                  </div>
                  <div>
                    <div className="idx-style-179">{label}</div>
                    <div className="idx-style-180">{sub}</div>
                    <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(255,215,0,0.07)", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>
                      <div style={{ fontSize: "1rem", color: "#FFD700", fontWeight: 700, marginBottom: 4 }}>📲 GPay / PhonePe Number</div>
                      <div style={{ fontSize: "1.4rem", color: "#fff", fontWeight: 800, letterSpacing: 2 }}>+91 63745 49935</div>
                      <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 6 }}>Send total ₹{total.toLocaleString("en-IN")} to this GPay number to complete order payment</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Fee Notice (Seasonal & Distance based) */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255, 215, 0, 0.08)",
                  border: "1px solid rgba(255, 215, 0, 0.25)",
                  borderRadius: 12,
                  marginTop: 14,
                  marginBottom: 14
                }}
              >
                <div style={{ color: "#FFD700", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
                  🚚 Delivery Charge Notice
                </div>
                <div style={{ fontSize: "0.8rem", color: "#ddd", marginTop: 4, lineHeight: "1.4" }}>
                  Delivery charges vary based on <strong>seasonal demand, destination city, and distance (km)</strong>. Once confirmed on web, your itemized final receipt will be shared via <strong>WhatsApp</strong>.
                </div>
              </div>

              {/* Safe Delivery Responsibility Guarantee */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                  borderRadius: 12,
                  marginBottom: 16
                }}
              >
                <div style={{ color: "#81C784", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
                  🛡️ 100% Safe Delivery Guaranteed!
                </div>
                <div style={{ fontSize: "0.8rem", color: "#C8E6C9", marginTop: 4, lineHeight: "1.4" }}>
                  Delivering your product safely is <strong>our complete responsibility</strong>. Safe transport and intact package delivery are 100% guaranteed.
                </div>
              </div>

              <div className="idx-style-183">
                ⚠️ Sale of fireworks to minors is prohibited by law. By proceeding, you confirm you are 18+ years old.
              </div>

              <div className="idx-style-184">
                <button
                  onClick={() => setStep(1)}
                  style={{
                    ...btnStyle("ghost"),
                    flex: 1,
                    padding: "12px"
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handlePayment}
                  style={{
                    ...btnStyle("primary"),
                    flex: 2,
                    padding: "12px",
                    fontSize: "0.86rem"
                  }}
                >
                  🎉 Confirm & Place Order Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div
          style={{
            ...cardStyle,
            position: "sticky",
            top: 80
          }}
        >
          <h3 className="idx-style-185">Order ({cart.length})</h3>
          <div className="idx-style-186">
            {cart.map((i) => (
              <div key={i.id} className="idx-style-187" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {renderImage(i.image, "idx-style-187-img")}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="idx-style-188" style={{ fontSize: "0.85rem", color: "#fff" }}>
                    {i.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>
                    ₹{i.price.toLocaleString("en-IN")} × {i.qty}
                  </div>
                </div>
                <span className="idx-style-189" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  ₹{(i.price * i.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="idx-style-190">
            <div className="idx-style-191">
              <span>Delivery Charge</span>
              <span style={{ color: "#FFD700", fontSize: "0.78rem" }}>
                Varies by Season & KM (Receipt on WhatsApp)
              </span>
            </div>
            <div className="idx-style-192">
              <span>Item Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "rgba(76,175,80,0.08)",
              border: "1px dashed rgba(76,175,80,0.3)",
              borderRadius: 8,
              fontSize: "0.76rem",
              color: "#A5D6A7",
              lineHeight: "1.3",
              textAlign: "center"
            }}
          >
            🛡️ Delivering your product safely is <strong>our responsibility</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

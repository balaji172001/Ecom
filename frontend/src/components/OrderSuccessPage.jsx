import React, { useState, useEffect } from "react";
import { Flame, CheckCircle, Truck, ClipboardList } from "lucide-react";
import { btnStyle } from "../utils/constants";

export default function OrderSuccessPage({ orderId, onNavigate, lastOrder }) {
  const WHATSAPP_NUMBER = "916374549935";

  // Build detailed WhatsApp message
  const order = lastOrder && lastOrder.orderId === orderId ? lastOrder : null;

  let waText = `🎆 *Sri Ram Balaji Agency — Order Copy* 🎆\n\n`;
  if (order) {
    waText += `*Order ID:* ${order.orderId}\n`;
    waText += `*Date:* ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}\n\n`;

    waText += `👤 *Customer Details:*\n`;
    waText += `Name: ${order.name || ""}\n`;
    waText += `Mobile: ${order.mobile || ""}\n`;
    waText += `Address: ${order.address || ""}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}\n\n`;

    waText += `📦 *Order Items:*\n`;
    if (Array.isArray(order.items)) {
      order.items.forEach((item, index) => {
        waText += `${index + 1}. ${item.name} (${item.unit || "1 Pack"}) x ${item.qty} = ₹${(item.price * item.qty).toLocaleString("en-IN")}\n`;
      });
    }
    waText += `\n`;

    const subtotal = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + item.price * item.qty, 0) : (order.total || 0);
    const delivery = subtotal >= 999 ? 0 : 99;

    waText += `*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}\n`;
    waText += `*Delivery Charge:* ${delivery === 0 ? "FREE" : `₹${delivery}`}\n`;
    waText += `*Total Amount:* ₹${order.total?.toLocaleString("en-IN")}\n\n`;

    waText += `💳 *Payment Method:* ${order.method === "cod" ? "Cash on Delivery" : "GPay / Online Payment"}\n\n`;
    waText += `Hi! I have placed an order on your website. Please confirm delivery charge and receipt.`;
  } else {
    waText += `Order ID: ${orderId}\n`;
    waText += `Hi! I have placed an order on your website (Order ID: ${orderId}). Please confirm delivery charge and receipt.`;
  }

  const waMsg = encodeURIComponent(waText);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  // 5-second countdown then auto-open WhatsApp
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (countdown <= 0) {
      window.open(waUrl, "_blank");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, waUrl]);

  return (
    <div className="idx-style-193">
      <div className="idx-style-194"><Flame size={64} color="#FFD700" /></div>
      <h1 className="idx-style-195">Order Placed Successfully!</h1>
      <p className="idx-style-196">Thank you for shopping with Sri Ram Balaji Agency 🙏</p>

      <div className="idx-style-197">
        <div className="idx-style-198">Order ID</div>
        <div className="idx-style-199">{orderId}</div>
        <div className="idx-style-200" style={{ color: "#81C784", marginTop: 8 }}>
          ✅ Your order is confirmed on our website!
        </div>
      </div>

      {/* Safe Delivery Guarantee Banner */}
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto 24px auto",
          padding: "14px 18px",
          background: "rgba(76, 175, 80, 0.12)",
          border: "1px solid rgba(76, 175, 80, 0.4)",
          borderRadius: 14,
          textAlign: "center"
        }}
      >
        <div style={{ color: "#81C784", fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>
          🛡️ 100% Safe Delivery Guaranteed!
        </div>
        <div style={{ fontSize: "0.82rem", color: "#C8E6C9", lineHeight: "1.4" }}>
          Delivering your product safely is <strong>our complete responsibility</strong>. Exact delivery charge (calculated based on season and distance in km) will be updated on your receipt.
        </div>
      </div>

      <div className="idx-style-201">
        {[
          [<CheckCircle size={24} />, "Order Confirmed", "Saved directly on website"],
          [<Truck size={24} />, "Distance / KM Pricing", "Seasonal delivery fee calculated"],
          [<ClipboardList size={24} />, "100% Responsible", "Safe product delivery guaranteed"]
        ].map(([icon, t, d]) => (
          <div key={t} className="idx-style-202">
            <div className="idx-style-203" style={{ color: "#FFD700", display: "flex", justifyContent: "center" }}>
              {icon}
            </div>
            <div className="idx-style-204">{t}</div>
            <div className="idx-style-205">{d}</div>
          </div>
        ))}
      </div>

      {/* Auto-redirect countdown */}
      <div
        style={{
          maxWidth: 400,
          margin: "20px auto 0 auto",
          padding: "10px 16px",
          background: "rgba(37, 211, 102, 0.1)",
          border: "1px solid rgba(37, 211, 102, 0.3)",
          borderRadius: 12,
          textAlign: "center",
          fontSize: "0.82rem",
          color: "#81C784"
        }}
      >
        {countdown > 0
          ? `📱 Redirecting to WhatsApp in ${countdown} second${countdown !== 1 ? "s" : ""}...`
          : "📱 Opening WhatsApp..."}
      </div>

      <div
        className="idx-style-206"
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 400,
          margin: "12px auto 0 auto"
        }}
      >
        <button
          onClick={() => window.open(waUrl, "_blank")}
          style={{ ...btnStyle("primary"), width: "100%", padding: "12px", background: "#25D366", borderColor: "#25D366" }}
        >
          📱 Send Order Copy on WhatsApp
        </button>
        <button onClick={() => onNavigate("home")} style={{ ...btnStyle("outline"), width: "100%", padding: "12px" }}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

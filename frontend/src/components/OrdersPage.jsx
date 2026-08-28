import React, { useState, useEffect } from "react";
import { Package, MapPin } from "lucide-react";
import { API_BASE, cardStyle, renderImage } from "../utils/constants";

export default function OrdersPage({ orders, token }) {
  const [realOrders, setRealOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch(`${API_BASE}/api/orders/my`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setRealOrders(Array.isArray(data) ? data : []))
        .catch((err) => console.error("History fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const displayOrders = realOrders.length > 0 ? realOrders : orders;

  if (loading) {
    return (
      <div className="idx-style-226">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (!loading && displayOrders.length === 0) {
    return (
      <div className="idx-style-226">
        <div className="idx-style-227">
          <Package size={64} color="#888" />
        </div>
        <h2 className="idx-style-228">No orders yet</h2>
        <p className="idx-style-229">Your order history will appear here after you place an order.</p>
      </div>
    );
  }

  return (
    <div className="idx-style-230">
      <h1 className="idx-style-231">My Orders</h1>
      {displayOrders.map((o, i) => (
        <div key={o.orderId || i} style={{ ...cardStyle, marginBottom: 13 }}>
          <div className="idx-style-232">
            <div>
              <div className="idx-style-233">#{o.orderId}</div>
              <div className="idx-style-234">Placed on {new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN")}</div>
              <div className="idx-style-235" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} /> {o.customer?.address || o.address}, {o.customer?.city || o.city}
              </div>
              <div className="idx-style-236">📅 Status: {o.status || "Confirmed"} • {o.items?.length || 0} items</div>
              <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 5 }}>
                Subtotal: ₹{o.subtotal?.toLocaleString("en-IN")} &nbsp;|&nbsp;
                Delivery: ₹{o.deliveryCharge?.toLocaleString("en-IN")}
              </div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {Array.isArray(o.items) && o.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                      {renderImage(item.image, "idx-order-item-img")}
                    </div>
                    <div style={{ flex: 1, fontSize: "0.78rem", color: "#ccc" }}>
                      {item.name} <span style={{ color: "#666" }}>× {item.qty}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="idx-style-237">
              <div className="idx-style-238">₹{o.total?.toLocaleString("en-IN")}</div>
              <div className="idx-style-239">{o.paymentMethod || o.method === "cod" ? "Cash on Delivery" : "GPay"}</div>
              <span className="idx-style-240" style={{ color: "#4CAF50" }}>{o.status || "Confirmed ✓"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

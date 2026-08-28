import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function AiSupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Sri Ram Balaji Agency! How can I assist you with your cracker order today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const WHATSAPP_NUMBER = "916374549935";

  const faqs = [
    {
      q: "📦 How to Track Order?",
      a: "Orders are processed within 24 hours! Your order details & receipt are confirmed directly on our website. You can also chat on WhatsApp (+916374549935)."
    },
    {
      q: "🚚 Delivery Charge & Time?",
      a: "Delivery takes 3–5 business days. Delivery fees vary based on season & distance (km) and are sent via WhatsApp receipt."
    },
    {
      q: "💥 Discounts & Price List?",
      a: "We offer up to 50% discount on all original Sivakasi crackers with direct factory rates!"
    },
    {
      q: "🛡️ Safe Delivery Guarantee?",
      a: "100% Safe Transport Guaranteed! Delivering your crackers safely without breakage is OUR COMPLETE RESPONSIBILITY."
    },
    {
      q: "📱 GPay Payment Help",
      a: "Send GPay payment to +916374549935. Once paid, your order is confirmed directly on web!"
    }
  ];

  const handleSend = (userText) => {
    const txt = userText || input;
    if (!txt.trim()) return;

    const userMsg = {
      sender: "user",
      text: txt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out! For instant personal assistance, you can also chat with our support team directly on WhatsApp (+916374549935).";
      const lower = txt.toLowerCase();

      if (lower.includes("track") || lower.includes("status")) {
        botReply = "📦 Orders are processed quickly! You can view your placed orders under 'My Orders' or contact us on WhatsApp for live tracking updates.";
      } else if (lower.includes("delivery") || lower.includes("km") || lower.includes("charge") || lower.includes("fee")) {
        botReply = "🚚 Delivery charges vary based on seasonal demand & distance (km). Once confirmed on web, your itemized final receipt will be sent via WhatsApp!";
      } else if (lower.includes("pay") || lower.includes("gpay") || lower.includes("cod")) {
        botReply = "📱 We accept GPay / UPI payments to +916374549935. Note: Cash on Delivery (COD) is unavailable.";
      } else if (lower.includes("guarantee") || lower.includes("safe") || lower.includes("damage")) {
        botReply = "🛡️ 100% Safe Delivery Guaranteed! Delivering your product intact is completely OUR RESPONSIBILITY.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 600);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #FFD700)",
            border: "2px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 24px rgba(255, 107, 53, 0.45)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            transition: "transform 0.2s"
          }}
          title="AI Assistant & WhatsApp Support"
        >
          <Sparkles size={28} />
          <div style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#4CAF50",
            border: "2px solid #000"
          }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: 360,
          maxWidth: "calc(100vw - 32px)",
          height: 480,
          maxHeight: "calc(100vh - 100px)",
          background: "rgba(18, 10, 30, 0.96)",
          border: "1px solid rgba(255, 215, 0, 0.25)",
          borderRadius: 20,
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backdropFilter: "blur(12px)"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,215,0,0.15))",
            borderBottom: "1px solid rgba(255,215,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#FF6B35,#FFD700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000"
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FFD700" }}>Sparkle AI Assistant</div>
                <div style={{ fontSize: "0.72rem", color: "#81C784", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#81C784", display: "inline-block" }} /> Online & Ready
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "1.2rem" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: m.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  background: m.sender === "user" ? "linear-gradient(135deg, #FF6B35, #FF8E53)" : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: "0.82rem",
                  lineHeight: "1.4"
                }}
              >
                {m.text}
                <div style={{ fontSize: "0.65rem", color: m.sender === "user" ? "rgba(255,255,255,0.7)" : "#777", marginTop: 4, textAlign: "right" }}>
                  {m.time}
                </div>
              </div>
            ))}

            {/* Quick Action Chips */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: "0.72rem", color: "#888", marginBottom: 6 }}>Quick Questions:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {faqs.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(f.q)}
                    style={{
                      padding: "6px 10px",
                      background: "rgba(255,215,0,0.06)",
                      border: "1px solid rgba(255,215,0,0.2)",
                      borderRadius: 14,
                      color: "#FFD700",
                      fontSize: "0.74rem",
                      cursor: "pointer"
                    }}
                  >
                    {f.q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Button & Input */}
          <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}>
            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank")}
              style={{
                width: "100%",
                padding: "8px 12px",
                marginBottom: 8,
                background: "#25D366",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer"
              }}
            >
              💬 Open Instant WhatsApp Chat
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                value={input}
                placeholder="Ask a question..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: "0.82rem",
                  outline: "none"
                }}
              />
              <button
                onClick={() => handleSend()}
                style={{
                  padding: "8px 14px",
                  background: "#FF6B35",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

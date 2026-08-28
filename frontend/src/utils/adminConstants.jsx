import React from "react";

export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5005"
  : "https://ecom-rne9.onrender.com";

export const STATUS_COLORS = {
  Pending: {
    bg: "rgba(255,152,0,0.15)",
    border: "rgba(255,152,0,0.4)",
    color: "#FF9800",
  },
  Confirmed: {
    bg: "rgba(33,150,243,0.15)",
    border: "rgba(33,150,243,0.4)",
    color: "#2196F3",
  },
  Shipped: {
    bg: "rgba(156,39,176,0.15)",
    border: "rgba(156,39,176,0.4)",
    color: "#9C27B0",
  },
  Delivered: {
    bg: "rgba(76,175,80,0.15)",
    border: "rgba(76,175,80,0.4)",
    color: "#4CAF50",
  },
  Cancelled: {
    bg: "rgba(244,67,54,0.15)",
    border: "rgba(244,67,54,0.4)",
    color: "#F44336",
  },
};

export const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export const cardStyle = {
  background: "rgba(15,6,0,0.85)",
  border: "1px solid rgba(255,215,0,0.1)",
  borderRadius: 14,
  padding: "18px",
};

export const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,215,0,0.2)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "0.85rem",
  outline: "none",
};

export const selectStyle = {
  width: "100%",
  background: "rgba(15,5,0,0.9)",
  border: "1px solid rgba(255,215,0,0.2)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "0.85rem",
  cursor: "pointer",
};

export const labelStyle = {
  color: "#888",
  fontSize: "0.77rem",
  display: "block",
  marginBoon: 6,
  marginBottom: 6,
};

export const pageTitle = {
  fontFamily: "'Outfit', sans-serif",
  color: "#FFD700",
  fontSize: "1.6rem",
  marginBottom: 0,
};

export const actionBtn = {
  background: "linear-gradient(135deg,#FF6B35,#FFD700)",
  color: "#000",
  border: "none",
  borderRadius: 10,
  padding: "9px 18px",
  cursor: "pointer",
  fontWeight: 700,
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.82rem",
};

export function renderImage(img, className) {
  if (!img) return "🎇";
  if (typeof img !== 'string') return img;
  if (img.startsWith("/") || img.startsWith("http")) {
    const src = img.startsWith("/") ? `${API_BASE}${img}` : img;
    return <img src={src} alt="product" className={className} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />;
  }
  return img;
}

import React from "react";
import { Flame, Star, Sparkles, Gift, PartyPopper } from "lucide-react";

export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5005"
  : "https://ecom-rne9.onrender.com";

export const CATEGORIES = [
  "All",
  "Flash Light Crackers",
  "Deluxe Crackers",
  "Garalands",
  "Bijili Crackers",
  "Ground Chakkar",
  "Flower Pots",
  "Multi Colour Flower Pots",
  "Twinkling Star",
  "Bombs",
  "Candles",
  "Novelties",
  "Rockets",
  "Special Fountains",
  "Sparkless",
  "Fancy Items",
  "Fountain",
  "Aerial Fancy",
  "Repeating Multi Colour Function Shots"
];

export const REVIEWS = [
  {
    name: "Priya S.",
    city: "Chennai",
    text: "Excellent quality from Ram Balaji Shop! The 25 Shot function box was absolutely stunning. Will order every Diwali!",
    rating: 5
  },
  {
    name: "Karthik R.",
    city: "Madurai",
    text: "I bought crackers from RamBalajiShop for the first time this year. The 1000 Wala garland was pure joy for the kids. Excellent service!",
    rating: 5
  },
  {
    name: "Ananya M.",
    city: "Coimbatore",
    text: "Best cracker shop online! Ram Balaji Agency's Flower Pots Deluxe was worth every rupee. Super fast WhatsApp support.",
    rating: 4
  },
  {
    name: "Arun K.",
    city: "Trichy",
    text: "Very authentic! The 120 Shot function box was mind-blowing! Highly recommended buying from Ram Balaji Shop.",
    rating: 5
  }
];

export const COMBOS = [
  {
    name: "Starter Pack",
    price: 499,
    mrp: 999,
    items: ["10 Cm Red Sparklers", "Ground Chakkar Big", "Flower Pots Small", "Red Bijili"],
    icon: <Sparkles size={24} />
  },
  {
    name: "Family Celebration",
    price: 1299,
    mrp: 2599,
    items: ["30 Cm Red Sparklers", "Flower Pots Deluxe", "1000 Wala Garland", "King of King Bomb", "Peacock Fountain"],
    icon: <Gift size={24} />
  },
  {
    name: "Grand Festival Box",
    price: 2999,
    mrp: 5999,
    items: ["120 Shot Function Box", "5000 Wala Garland", "Flower Pots Ashoka", "Tri Colour", "Thor Fountain", '3½" Fancy Aerial'],
    icon: <PartyPopper size={24} />
  }
];

export const cardStyle = {
  background: "rgba(20,8,0,0.88)",
  border: "1px solid rgba(255,215,0,0.15)",
  borderRadius: 16,
  padding: 20,
  backdropFilter: "blur(10px)"
};

export const sectionStyle = {
  padding: "60px 20px",
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box"
};

export const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,215,0,0.2)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box"
};

export const qtyBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(255,215,0,0.1)",
  border: "1px solid rgba(255,215,0,0.3)",
  color: "#FFD700",
  fontSize: "1.1rem",
  cursor: "pointer"
};

export function btnStyle(type) {
  const base = {
    padding: "10px 24px",
    borderRadius: 12,
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
    fontWeight: 700,
    fontFamily: "inherit",
    transition: "all 0.2s",
    letterSpacing: "0.02em"
  };
  if (type === "primary") return {
    ...base,
    background: "linear-gradient(135deg,#FF6B35 0%,#FFD700 100%)",
    color: "#000",
    boxShadow: "0 4px 15px rgba(255,107,53,0.4)"
  };
  if (type === "outline") return {
    ...base,
    background: "transparent",
    border: "2px solid #FFD700",
    color: "#FFD700"
  };
  if (type === "ghost") return {
    ...base,
    background: "rgba(255,255,255,0.06)",
    color: "#aaa",
    border: "1px solid rgba(255,255,255,0.1)"
  };
  if (type === "disabled") return {
    ...base,
    background: "#333",
    color: "#666",
    cursor: "not-allowed"
  };
}

export const StarRating = ({ rating }) => (
  <span className="idx-style-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < Math.floor(rating) ? "#FFD700" : "transparent"}
        stroke={i < Math.floor(rating) ? "#FFD700" : "#444"}
        style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }}
      />
    ))}
    <span className="idx-style-3">({rating})</span>
  </span>
);

export function renderImage(img, className) {
  if (!img) return <Flame size={24} color="#FFD700" />;
  if (typeof img !== 'string') return img;
  if (img.startsWith("/") || img.startsWith("http")) {
    const src = img.startsWith("/") ? `${API_BASE}${img}` : img;
    return <img src={src} alt="product" className={className} style={{ width: "100%", height: "100%" }} />;
  }
  return img;
}

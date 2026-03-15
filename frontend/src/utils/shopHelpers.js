import { API_BASE } from './shopConstants';

export function renderImage(img, className) {
    if (!img) return "🎇";
    if (typeof img !== 'string') return img;
    if (img.startsWith("/") || img.startsWith("http")) {
        const src = img.startsWith("/") ? `${API_BASE}${img}` : img;
        return <img src={src} alt="product" className={className} style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
    }
    return img;
}

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
    margin: "0 auto"
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

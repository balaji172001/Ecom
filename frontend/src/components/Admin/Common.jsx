const STATUS_COLORS = {
    Pending: { bg: "rgba(255,152,0,0.15)", border: "rgba(255,152,0,0.4)", color: "#FF9800" },
    Confirmed: { bg: "rgba(33,150,243,0.15)", border: "rgba(33,150,243,0.4)", color: "#2196F3" },
    Shipped: { bg: "rgba(156,39,176,0.15)", border: "rgba(156,39,176,0.4)", color: "#9C27B0" },
    Delivered: { bg: "rgba(76,175,80,0.15)", border: "rgba(76,175,80,0.4)", color: "#4CAF50" },
    Cancelled: { bg: "rgba(244,67,54,0.15)", border: "rgba(244,67,54,0.4)", color: "#F44336" },
};

export const StatusBadge = ({ status, small }) => {
    const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
    return (
        <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, padding: small ? "2px 6px" : "4px 10px", borderRadius: 8, fontSize: small ? "0.65rem" : "0.75rem", fontWeight: 700 }}>
            {status}
        </span>
    );
};

export const EmptyState = ({ icon, msg }) => (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>{icon}</div>
        <p style={{ color: "#888" }}>{msg}</p>
    </div>
);

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Image as ImageIcon,
  Users,
  Menu,
} from "lucide-react";

export default function Sidebar({ active, onNav, collapsed, onToggle, isMobile }) {
  const items = [
    ["dashboard", <LayoutDashboard size={18} />, "Dashboard"],
    ["orders", <Package size={18} />, "Orders"],
    ["products", <ShoppingBag size={18} />, "Products"],
    ["coupons", <Tag size={18} />, "Coupons"],
    ["banners", <ImageIcon size={18} />, "Banners"],
    ["users", <Users size={18} />, "Users"],
  ];

  const sidebarWidth = isMobile ? 240 : collapsed ? 60 : 220;
  const leftPos = isMobile ? (collapsed ? -240 : 0) : 0;

  return (
    <aside
      style={{
        width: sidebarWidth,
        left: leftPos,
        background: "rgba(8,3,0,0.97)",
        borderRight: "1px solid rgba(255,215,0,0.1)",
        minHeight: "100vh",
        transition: "all 0.3s ease",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        height: "100vh",
        zIndex: 100,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 12px",
          borderBottom: "1px solid rgba(255,215,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile || !collapsed ? "space-between" : "center",
        }}
      >
        {(!collapsed || isMobile) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src="/RamBalajiShop-AppIcon.png"
              alt="Logo"
              style={{ width: 20, height: 20, objectFit: "contain" }}
            />
            <span className="adm-style-17">Admin</span>
          </div>
        )}
        <button onClick={onToggle} className="adm-style-18">
          <Menu size={20} />
        </button>
      </div>
      <nav className="adm-style-19">
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "11px 12px",
              borderRadius: 10,
              border: "none",
              marginBottom: 4,
              cursor: "pointer",
              background:
                active === id
                  ? "linear-gradient(135deg,rgba(255,107,53,0.3),rgba(255,215,0,0.15))"
                  : "transparent",
              color: active === id ? "#FFD700" : "#888",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              fontWeight: active === id ? 700 : 400,
              transition: "all 0.2s",
              textAlign: "left",
              borderLeft: active === id ? "3px solid #FFD700" : "3px solid transparent",
            }}
          >
            <span className="adm-style-20">{icon}</span>
            {(!collapsed || isMobile) && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

import React from "react";
import { Home, ShoppingBag, User, LogOut, LogIn, ShoppingCart } from "lucide-react";
import { btnStyle } from "../utils/constants";

export default function Navbar({ page, cart, onNavigate, user, onLogout }) {
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <nav className="idx-style-241">
      <div className="idx-style-242">
        <div onClick={() => onNavigate("home")} className="idx-style-243">
          <img
            src="/RamBalajiShop-AppIcon.png"
            alt="Ram Balaji Shop"
            className="idx-style-244"
            style={{ width: "32px", height: "32px", objectFit: "contain", filter: "drop-shadow(0 0 5px rgba(255,215,0,0.3))" }}
          />
          <div className="idx-style-245">
            <div className="idx-style-246 logo-text">Sri Ram Balaji Agency</div>
          </div>
        </div>
        <div className="navbar-links">
          {[
            ["home", "Home", <Home size={18} />],
            ["products", "Products", <ShoppingBag size={18} />],
          ].map(([p, l, icon]) => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              style={{
                background: "none",
                border: "none",
                color: page === p ? "#FFD700" : "#888",
                cursor: "pointer",
                padding: "6px 9px",
                fontFamily: "inherit",
                fontSize: "0.8rem",
                fontWeight: page === p ? 700 : 400,
                borderBottom: page === p ? "2px solid #FFD700" : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {icon} <span className="nav-btn-text">{l}</span>
            </button>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => onNavigate("orders")}
                style={{
                  background: "none",
                  padding: "4px 8px",
                  border: "none",
                  color: page === "orders" ? "#FFD700" : "#888",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  borderBottom: page === "orders" ? "2px solid #FFD700" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <User size={16} /> <span className="nav-btn-text">{user.name.split(" ")[0]}</span>
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF5252",
                  padding: "6px 9px",
                  borderRadius: 6,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  borderBottom: "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <LogOut size={16} /> <span className="nav-btn-text">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              style={{
                background: "none",
                border: "none",
                color: page === "login" ? "#FFD700" : "#888",
                cursor: "pointer",
                fontSize: "0.82rem",
                padding: "4px 8px",
                borderBottom: page === "login" ? "2px solid #FFD700" : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <LogIn size={16} /> <span className="nav-btn-text">Login</span>
            </button>
          )}
          <button
            onClick={() => onNavigate("cart")}
            style={{
              ...btnStyle("primary"),
              padding: "7px 13px",
              fontSize: "0.8rem",
              position: "relative",
              marginLeft: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={18} />{" "}
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#FF1744",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 17,
                  height: 17,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

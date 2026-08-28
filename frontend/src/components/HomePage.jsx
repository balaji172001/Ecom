import React, { useState, useEffect } from "react";
import {
  Phone, Sparkles, ArrowRight, Smartphone, Camera, Play,
  CheckCircle, AlertTriangle, User, Flame, Info, Tag, Home, X, MessageSquare, Star ,Gift
} from "lucide-react";
import { REVIEWS, COMBOS, cardStyle, sectionStyle, btnStyle } from "../utils/constants";
import BannerCarousel from "./BannerCarousel";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";

export default function HomePage({ products = [], banners = [], onNavigate, onAddToCart }) {
  const [rev, setRev] = useState(0);
  const featured = products.filter((p) => p.stock > 0).slice(0, 8);

  useEffect(() => {
    const t = setInterval(() => setRev((r) => (r + 1) % REVIEWS.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* DYNAMIC BANNERS */}
      <BannerCarousel banners={banners} />

      {/* HERO (Shown if no banners or as legacy header) */}
      {!banners.length && (
        <section className="idx-style-44">
          <div className="idx-style-46">Sri Gopalsamy Presents</div>
          <h1 className="idx-style-47">
            Sri Ram Balaji
            <br />
            Agency
          </h1>
          <p className="idx-style-48">Premium Quality Fireworks • Price List 2025</p>
          <p className="idx-style-49">
            329-H/1, Srivilliputtur to Alangulam Road, Sri Venkateswara Nagar
            <br />
            Pillaiyarkulam, P. Ramachatrapuram - 626 137, Srivilliputtur (T.K)
          </p>
          <p className="idx-style-50" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Phone size={16} /> 99407 67763 &nbsp;|&nbsp; 99409 19857
          </p>
          <div className="idx-style-51" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Sparkles size={16} /> Special Offer — Discount UPTO 50% OFF on all products!
          </div>
          <div className="idx-style-52">
            <button onClick={() => onNavigate("products")} style={btnStyle("primary")}>
              Shop Now <Flame size={18} style={{ marginLeft: 8, display: "inline-block", verticalAlign: "middle" }} />
            </button>
            <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
              View All {products.length} Products <ArrowRight size={16} style={{ marginLeft: 8, display: "inline-block", verticalAlign: "middle" }} />
            </button>
          </div>
          <div className="idx-style-53">
            {[
              [`${products.length}+`, "Products"],
              ["50%", "Max Discount"],
              ["2025", "Price List"],
              ["Licensed", "& Certified"],
            ].map(([n, l]) => (
              <div key={l} className="idx-style-54">
                <div className="idx-style-55">{n}</div>
                <div className="idx-style-56">{l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONNECT WITH US */}
      <section key="social-connect" className="social-connect-root" style={sectionStyle}>
        <SectionTitle icon={<Smartphone size={32} />} title="Connect With Us" sub="Stay updated with our latest collections & offers" />
        <div className="social-grid-wrapper">
          <a href="https://www.instagram.com/sri_rambalaji" target="_blank" rel="noreferrer" className="social-link-card" style={cardStyle}>
            <div className="social-link-icon-box"><Camera size={24} color="#E1306C" /></div>
            <h3 className="social-link-title-text">@sri_rambalaji</h3>
            <p className="social-link-subtitle-text">Instagram Official</p>
          </a>
          <a href="https://www.youtube.com/@srirambalajiagency2224" target="_blank" rel="noreferrer" className="social-link-card" style={cardStyle}>
            <div className="social-link-icon-box"><Play size={24} fill="#FF0000" color="#FF0000" /></div>
            <h3 className="social-link-title-text">Sri Ram Balaji Agency</h3>
            <p className="social-link-subtitle-text">YouTube Official Channel</p>
          </a>
        </div>
      </section>

      {/* COMBO OFFERS */}
      <section style={sectionStyle}>
        <SectionTitle icon={<Gift size={32} />} title="Combo Offers" sub="Best value bundles for your celebration" />
        <div className="idx-style-59">
          {COMBOS.map((c) => {
            const d = Math.round((1 - c.price / c.mrp) * 100);
            return (
              <div
                key={c.name}
                style={{
                  ...cardStyle,
                  background: "linear-gradient(135deg,rgba(30,10,0,0.94),rgba(60,20,0,0.9))",
                  border: "1px solid rgba(255,215,0,0.28)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    fontSize: "5rem",
                    opacity: 0.08,
                    color: "#FFD700",
                  }}
                >
                  {c.icon}
                </div>
                <div className="idx-style-60">{c.icon}</div>
                <h3 className="idx-style-61">{c.name}</h3>
                <div className="idx-style-62">
                  <span className="idx-style-63">₹{c.price}</span>
                  <span className="idx-style-64">₹{c.mrp}</span>
                  <span className="idx-style-65">{d}% OFF</span>
                </div>
                <ul className="idx-style-66">
                  {c.items.map((i) => (
                    <li key={i} className="idx-style-67" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={14} color="#4CAF50" /> {i}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate("products")}
                  style={{
                    ...btnStyle("primary"),
                    width: "100%",
                    padding: "9px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  Order Now <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={sectionStyle}>
        <SectionTitle icon={<Star size={32} color="#FFD700" />} title="Featured Products" sub="Best sellers from Price List 2025" />
        <div className="idx-style-68">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="idx-style-69">
          <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
            View All {products.length} Products <ArrowRight size={16} style={{ marginLeft: 8, display: "inline-block", verticalAlign: "middle" }} />
          </button>
        </div>
      </section>

      {/* SAFETY */}
      <section
        style={{
          ...sectionStyle,
          background: "rgba(255,50,0,0.05)",
          borderRadius: 20,
          margin: "0 auto",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <SectionTitle icon={<AlertTriangle size={32} color="#FF5252" />} title="Safety Instructions" sub="Always follow these guidelines before using crackers" />
        <div className="idx-style-70">
          {[
            [<User size={24} />, "Adult Supervision", "Always have adult supervision"],
            [<Flame size={24} />, "Keep Water Nearby", "Keep a bucket of water or sand nearby"],
            [<Info size={24} />, "Maintain Distance", "Stand 2–3 meters away after lighting"],
            [<Tag size={24} />, "Wear Cotton", "Avoid synthetic materials near fire"],
            [<Home size={24} />, "Open Areas Only", "Use only in open, clear areas"],
            [<X size={24} />, "No Relight", "Never relight a dud cracker"],
          ].map(([icon, t, d]) => (
            <div key={t} className="idx-style-71">
              <div className="idx-style-72" style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#FF6B35" }}>
                {icon}
              </div>
              <div className="idx-style-73">{t}</div>
              <div className="idx-style-74">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section style={sectionStyle}>
        <SectionTitle icon={<MessageSquare size={32} />} title="Customer Reviews" />
        <div className="idx-style-75">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              style={{
                display: i === rev ? "block" : "none",
                background: "rgba(255,215,0,0.05)",
                border: "1px solid rgba(255,215,0,0.18)",
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
                animation: "fadeIn 0.5s ease",
              }}
            >
              <div className="idx-style-76">{"⭐".repeat(r.rating)}</div>
              <p className="idx-style-77">"{r.text}"</p>
              <div className="idx-style-78">{r.name}</div>
              <div className="idx-style-79">{r.city}</div>
            </div>
          ))}
          <div className="idx-style-80">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setRev(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "none",
                  background: i === rev ? "#FFD700" : "#444",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

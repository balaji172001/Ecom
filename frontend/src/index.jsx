import "./index.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShoppingCart, User, LogOut, LogIn, Search, Star, MessageCircle,
  Smartphone, Gift, AlertTriangle, CheckCircle, Truck, Package,
  Lock, Flame, ArrowRight, Tag, ShieldCheck, Mail, Phone, ExternalLink,
  ChevronRight, Camera, Play, Send, Home, Info, Heart, Minus, Plus, Trash2,
  X, Menu, MessageSquare, ShoppingBag, Sparkles, ClipboardList, PartyPopper, Zap, MapPin
} from "lucide-react";

// ============================================================
// FIREWORKS CANVAS ANIMATION
// ============================================================
function FireworksCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rockets = useRef([]);
  const animFrame = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    const colors = ["#FFD700", "#FF6B35", "#FF1744", "#FF9800", "#E91E63", "#FFEB3B", "#FF5722", "#FFF176", "#FFCA28", "#FF8A65"];
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.012;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.08;
        this.trail = [];
      }
      update() {
        this.trail.push({
          x: this.x,
          y: this.y,
          alpha: this.alpha
        });
        if (this.trail.length > 5) this.trail.shift();
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        this.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, this.size * (i / this.trail.length) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.fill();
        });
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
    class Rocket {
      constructor() {
        this.x = Math.random() * W;
        this.y = H;
        this.targetY = Math.random() * (H * 0.5) + 50;
        this.speed = Math.random() * 4 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.trail = [];
      }
      update() {
        this.trail.push({
          x: this.x,
          y: this.y
        });
        if (this.trail.length > 8) this.trail.shift();
        this.y -= this.speed;
        if (this.y <= this.targetY) this.exploded = true;
      }
      draw(ctx) {
        this.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, i / this.trail.length * 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = i / this.trail.length * 0.5;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      explode() {
        const count = Math.floor(Math.random() * 80) + 60;
        for (let i = 0; i < count; i++) particles.current.push(new Particle(this.x, this.y, this.color));
      }
    }
    let frameCount = 0;
    const animate = () => {
      animFrame.current = requestAnimationFrame(animate);
      ctx.fillStyle = "rgba(5, 0, 15, 0.18)";
      ctx.fillRect(0, 0, W, H);
      frameCount++;
      if (frameCount % 45 === 0) rockets.current.push(new Rocket());
      rockets.current = rockets.current.filter(r => {
        r.update();
        r.draw(ctx);
        if (r.exploded) {
          r.explode();
          return false;
        }
        return true;
      });
      particles.current = particles.current.filter(p => {
        p.update();
        p.draw(ctx);
        return p.alpha > 0;
      });
    };
    animate();
    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="idx-style-1" />;
}

// ============================================================
// REAL PRODUCT DATA — SRI RAM BALAJI AGENCY PRICE LIST 2025
// (All 76 products, names & prices exactly from the PDF)
// ============================================================

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5005"
  : "https://ecom-rne9.onrender.com";

// Helper to render emoji or img tag (hoisted)
function renderImage(img, className) {
  if (!img) return <Flame size={24} color="#FFD700" />;
  if (typeof img !== 'string') return img;
  if (img.startsWith("/") || img.startsWith("http")) {
    const src = img.startsWith("/") ? `${API_BASE}${img}` : img;
    return <img src={src} alt="product" className={className} style={{ width: "100%", height: "100%" }} />;
  }
  return img;
}

const CATEGORIES = ["All", "Flash Light Crackers", "Deluxe Crackers", "Garalands", "Bijili Crackers", "Ground Chakkar", "Flower Pots", "Multi Colour Flower Pots", "Twinkling Star", "Bombs", "Candles", "Novelties", "Rockets", "Special Fountains", "Sparkless", "Fancy Items", "Fountain", "Aerial Fancy", "Repeating Multi Colour Function Shots"];
const REVIEWS = [{
  name: "Priya S.",
  city: "Chennai",
  text: "Excellent quality from Ram Balaji Shop! The 25 Shot function box was absolutely stunning. Will order every Diwali!",
  rating: 5
}, {
  name: "Karthik R.",
  city: "Madurai",
  text: "I bought crackers from RamBalajiShop for the first time this year. The 1000 Wala garland was pure joy for the kids. Excellent service!",
  rating: 5
}, {
  name: "Ananya M.",
  city: "Coimbatore",
  text: "Best cracker shop online! Ram Balaji Agency's Flower Pots Deluxe was worth every rupee. Super fast WhatsApp support.",
  rating: 4
}, {
  name: "Arun K.",
  city: "Trichy",
  text: "Very authentic! The 120 Shot function box was mind-blowing! Highly recommended buying from Ram Balaji Shop.",
  rating: 5
}];
const COMBOS = [{
  name: "Starter Pack",
  price: 499,
  mrp: 999,
  items: ["10 Cm Red Sparklers", "Ground Chakkar Big", "Flower Pots Small", "Red Bijili"],
  icon: <Sparkles size={24} />
}, {
  name: "Family Celebration",
  price: 1299,
  mrp: 2599,
  items: ["30 Cm Red Sparklers", "Flower Pots Deluxe", "1000 Wala Garland", "King of King Bomb", "Peacock Fountain"],
  icon: <Gift size={24} />
}, {
  name: "Grand Festival Box",
  price: 2999,
  mrp: 5999,
  items: ["120 Shot Function Box", "5000 Wala Garland", "Flower Pots Ashoka", "Tri Colour", "Thor Fountain", '3½" Fancy Aerial'],
  icon: <PartyPopper size={24} />
}];

// ============================================================
// STYLES & HELPERS
// ============================================================
const cardStyle = {
  background: "rgba(20,8,0,0.88)",
  border: "1px solid rgba(255,215,0,0.15)",
  borderRadius: 16,
  padding: 20,
  backdropFilter: "blur(10px)"
};
const sectionStyle = {
  padding: "60px 20px",
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box"
};
const inputStyle = {
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
const qtyBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(255,215,0,0.1)",
  border: "1px solid rgba(255,215,0,0.3)",
  color: "#FFD700",
  fontSize: "1.1rem",
  cursor: "pointer"
};
function btnStyle(type) {
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
const StarRating = ({
  rating
}) => <span className="idx-style-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < Math.floor(rating) ? "#FFD700" : "transparent"} stroke={i < Math.floor(rating) ? "#FFD700" : "#444"} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} />
    ))}
    <span className="idx-style-3">({rating})</span>
  </span>;

function SectionTitle({
  icon,
  title,
  sub
}) {
  return <div className="idx-style-4">
    <div className="idx-style-5">{icon}</div>
    <h2 className="idx-style-6">{title}</h2>
    {sub && <p className="idx-style-7">{sub}</p>}
  </div>;
}
// ============================================================
// BANNER CAROUSEL
// ============================================================
function BannerCarousel({ banners }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const t = setInterval(() => {
      setActive(prev => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="banner-slider">
      {banners.map((b, i) => (
        <div
          key={b._id || i}
          className={`banner-slide ${i === active ? 'active' : ''}`}
          style={{ backgroundImage: `url(${b.image && b.image.startsWith("/") ? API_BASE + b.image : b.image})` }}
        >
          <div className="banner-overlay" />
          <div className="banner-content">
            <span className="banner-emoji">{b.emoji}</span>
            <div className="banner-text">
              <h2 className="banner-title">{b.title}</h2>
              <p className="banner-subtitle">{b.subtitle}</p>
            </div>
            <button className="banner-btn" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Explore Now 🎆
            </button>
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`banner-dot ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

function Toast({
  msg,
  onClose
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, []);
  return <div className="idx-style-8">{msg}</div>;
}

// ============================================================
// AUTH MODALS — LOGIN & REGISTER
// (Shown as overlay whenever someone tries to add to cart / checkout)
// ============================================================

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({
  p,
  onAddToCart,
  onNavigate
}) {
  const discount = Math.round((1 - p.price / p.mrp) * 100);
  return <div onClick={() => onNavigate("product", p.id)} style={{
    ...cardStyle,
    cursor: "pointer",
    transition: "all 0.3s ease"
  }} onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.borderColor = "rgba(255,215,0,0.45)";
  }} onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.borderColor = "rgba(255,215,0,0.15)";
  }}>
    <div className="idx-style-34">{renderImage(p.image, "idx-style-34-img")}</div>
    {p.stock === 0 && <div className="idx-style-35">OUT OF STOCK</div>}
    {p.stock > 0 && p.stock < 10 && <div className="idx-style-36">Only {p.stock} left!</div>}
    <div className="idx-style-37">
      {p.category} • {p.unit}
    </div>
    <h3 className="idx-style-38">{p.name}</h3>
    <div className="idx-style-39">
      <StarRating rating={p.rating} />
    </div>
    <div className="idx-style-40">
      <span className="idx-style-41">₹{p.price}</span>
      <span className="idx-style-42">₹{p.mrp}</span>
      <span className="idx-style-43">{discount}% OFF</span>
    </div>
    <button onClick={e => {
      e.stopPropagation();
      onAddToCart(p);
    }} disabled={p.stock === 0} style={{
      ...btnStyle(p.stock === 0 ? "disabled" : "primary"),
      width: "100%",
      padding: "8px",
      fontSize: "0.8rem",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }}>
      {p.stock === 0 ? "Out of Stock" : <><ShoppingCart size={16} /> Add to Cart</>}
    </button>
  </div>;
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({
  products = [],
  banners = [],
  onNavigate,
  onAddToCart
}) {
  const [rev, setRev] = useState(0);
  const featured = products.filter(p => p.stock > 0).slice(0, 8);
  useEffect(() => {
    const t = setInterval(() => setRev(r => (r + 1) % REVIEWS.length), 3800);
    return () => clearInterval(t);
  }, []);
  return <div>
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
        <p className="idx-style-48">
          Premium Quality Fireworks • Price List 2025
        </p>
        <p className="idx-style-49">
          329-H/1, Srivilliputtur to Alangulam Road, Sri Venkateswara Nagar
          <br />
          Pillaiyarkulam, P. Ramachatrapuram - 626 137, Srivilliputtur (T.K)
        </p>
        <p className="idx-style-50" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Phone size={16} /> 99407 67763 &nbsp;|&nbsp; 99409 19857
        </p>
        <div className="idx-style-51" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Sparkles size={16} /> Special Offer — Discount UPTO 50% OFF on all products!
        </div>
        <div className="idx-style-52">
          <button onClick={() => onNavigate("products")} style={btnStyle("primary")}>
            Shop Now <Flame size={18} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }} />
          </button>
          <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
            View All {products.length} Products <ArrowRight size={16} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }} />
          </button>
        </div>
        <div className="idx-style-53">
          {[[`${products.length}+`, "Products"], ["50%", "Max Discount"], ["2025", "Price List"], ["Licensed", "& Certified"]].map(([n, l]) => <div key={l} className="idx-style-54">
            <div className="idx-style-55">{n}</div>
            <div className="idx-style-56">{l}</div>
          </div>)}
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
        {COMBOS.map(c => {
          const d = Math.round((1 - c.price / c.mrp) * 100);
          return <div key={c.name} style={{
            ...cardStyle,
            background: "linear-gradient(135deg,rgba(30,10,0,0.94),rgba(60,20,0,0.9))",
            border: "1px solid rgba(255,215,0,0.28)",
            overflow: "hidden",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: -10,
              right: -10,
              fontSize: "5rem",
              opacity: 0.08,
              color: '#FFD700'
            }}>
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
              {c.items.map(i => <li key={i} className="idx-style-67" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} color="#4CAF50" /> {i}
              </li>)}
            </ul>
            <button onClick={() => {
              onNavigate("products");
            }} style={{
              ...btnStyle("primary"),
              width: "100%",
              padding: "9px",
              fontSize: "0.8rem",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              Order Now <ArrowRight size={16} />
            </button>
          </div>;
        })}
      </div>
    </section>

    {/* FEATURED PRODUCTS */}
    <section style={sectionStyle}>
      <SectionTitle icon={<Star size={32} color="#FFD700" />} title="Featured Products" sub="Best sellers from Price List 2025" />
      <div className="idx-style-68">
        {featured.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
      </div>
      <div className="idx-style-69">
        <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
          View All {products.length} Products <ArrowRight size={16} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </div>
    </section>

    {/* SAFETY */}
    <section style={{
      ...sectionStyle,
      background: "rgba(255,50,0,0.05)",
      borderRadius: 20,
      margin: "0 auto",
      width: "100%",
      maxWidth: "100%"
    }}>
      <SectionTitle icon={<AlertTriangle size={32} color="#FF5252" />} title="Safety Instructions" sub="Always follow these guidelines before using crackers" />
      <div className="idx-style-70">
        {[[<User size={24} />, "Adult Supervision", "Always have adult supervision"], [<Flame size={24} />, "Keep Water Nearby", "Keep a bucket of water or sand nearby"], [<Info size={24} />, "Maintain Distance", "Stand 2–3 meters away after lighting"], [<Tag size={24} />, "Wear Cotton", "Avoid synthetic materials near fire"], [<Home size={24} />, "Open Areas Only", "Use only in open, clear areas"], [<X size={24} />, "No Relight", "Never relight a dud cracker"]].map(([icon, t, d]) => <div key={t} className="idx-style-71">
          <div className="idx-style-72" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#FF6B35' }}>{icon}</div>
          <div className="idx-style-73">{t}</div>
          <div className="idx-style-74">{d}</div>
        </div>)}
      </div>
    </section>

    {/* REVIEWS */}
    <section style={sectionStyle}>
      <SectionTitle icon={<MessageSquare size={32} />} title="Customer Reviews" />
      <div className="idx-style-75">
        {REVIEWS.map((r, i) => <div key={i} style={{
          display: i === rev ? "block" : "none",
          background: "rgba(255,215,0,0.05)",
          border: "1px solid rgba(255,215,0,0.18)",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          animation: "fadeIn 0.5s ease"
        }}>
          <div className="idx-style-76">{"⭐".repeat(r.rating)}</div>
          <p className="idx-style-77">"{r.text}"</p>
          <div className="idx-style-78">{r.name}</div>
          <div className="idx-style-79">{r.city}</div>
        </div>)}
        <div className="idx-style-80">
          {REVIEWS.map((_, i) => <button key={i} onClick={() => setRev(i)} style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: "none",
            background: i === rev ? "#FFD700" : "#444",
            cursor: "pointer",
            padding: 0
          }} />)}
        </div>
      </div>
    </section>
  </div>;
}

// ============================================================
// PRODUCTS PAGE
// ============================================================
function ProductsPage({
  onAddToCart,
  onNavigate
  , products }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 12;
  let filtered = products.filter(p => {
    if (cat !== "All" && p.category !== cat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page - 1) * PER, page * PER);
  return <div className="idx-style-81">
    <div className="idx-style-82">
      <div>
        <div className="idx-style-83">
          Sri Ram Balaji Agency • Srivilliputtur
        </div>
        <h1 className="idx-style-84">All Products</h1>
        <p className="idx-style-85">Price List 2025 — Upto 50% discount</p>
      </div>
    </div>

    <div className="idx-style-88">
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
        <input value={search} onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }} placeholder="Search crackers..." className="idx-style-89" style={{ ...inputStyle, paddingLeft: 40 }} />
      </div>
      <select value={sort} onChange={e => setSort(e.target.value)} className="idx-style-90">
        <option value="default">Default Sort</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>
    </div>

    {/* Category chips */}
    <div className="idx-style-91">
      {CATEGORIES.map(c => {
        const count = c === "All" ? products.length : products.filter(p => p.category === c).length;
        return <button key={c} onClick={() => {
          setCat(c);
          setPage(1);
        }} style={{
          padding: "5px 13px",
          borderRadius: 20,
          border: "1px solid",
          fontSize: "0.72rem",
          cursor: "pointer",
          transition: "all 0.2s",
          background: cat === c ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "rgba(255,255,255,0.04)",
          borderColor: cat === c ? "transparent" : "rgba(255,215,0,0.16)",
          color: cat === c ? "#000" : "#bbb",
          fontWeight: cat === c ? 700 : 400
        }}>
          {c} ({count})
        </button>;
      })}
    </div>

    <p className="idx-style-92">
      {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
    </p>

    <div className="idx-style-93">
      {paged.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
    </div>

    {filtered.length === 0 && <div className="idx-style-94">
      <div className="idx-style-95">🔍</div>
      <p className="idx-style-96">
        No products found. Try a different search or category.
      </p>
    </div>}

    {/* Pagination */}
    {totalPages > 1 && <div className="idx-style-97">
      <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{
        ...btnStyle("ghost"),
        padding: "7px 14px",
        fontSize: "0.8rem"
      }}>
        ← Prev
      </button>
      {Array.from({
        length: totalPages
      }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        border: "1px solid",
        cursor: "pointer",
        background: page === i + 1 ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "transparent",
        borderColor: page === i + 1 ? "transparent" : "rgba(255,215,0,0.22)",
        color: page === i + 1 ? "#000" : "#bbb",
        fontWeight: 700,
        fontSize: "0.82rem"
      }}>
        {i + 1}
      </button>)}
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{
        ...btnStyle("ghost"),
        padding: "7px 14px",
        fontSize: "0.8rem"
      }}>
        Next →
      </button>
    </div>}
  </div>;
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
function ProductDetailPage({
  productId,
  onAddToCart,
  onNavigate,
  products
}) {
  const p = products.find(x => x.id === productId);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  // Inject Product JSON-LD schema for SEO rich results
  useEffect(() => {
    if (!p) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.name,
      "description": p.desc || `${p.name} – Premium Sivakasi fireworks. Category: ${p.category}. Unit: ${p.unit}.`,
      "category": p.category,
      "brand": { "@type": "Brand", "name": "Sri Ram Balaji Agency" },
      "offers": {
        "@type": "Offer",
        "url": `https://www.rambalajishop.shop/product-${p.id}`,
        "priceCurrency": "INR",
        "price": p.price,
        "priceValidUntil": "2025-11-14",
        "availability": p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": { "@type": "Organization", "name": "Sri Ram Balaji Agency" }
      },
      "aggregateRating": p.rating ? {
        "@type": "AggregateRating",
        "ratingValue": p.rating,
        "reviewCount": p.reviews || 10,
        "bestRating": 5
      } : undefined
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "product-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    // Update page title for this product
    const prevTitle = document.title;
    document.title = `${p.name} – Sri Ram Balaji Agency | Sivakasi Crackers`;
    return () => {
      const el = document.getElementById("product-schema");
      if (el) el.remove();
      document.title = prevTitle;
    };
  }, [p?.id]);


  if (!p) return <div className="idx-style-98">Product not found</div>;
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const discount = Math.round((1 - p.price / p.mrp) * 100);
  const imgs = [p.image, "✨", "🎆"];
  return <div className="idx-style-99">
    <button onClick={() => onNavigate("products")} className="idx-style-100">
      ← Back to Products
    </button>
    <div className="idx-style-101">
      {/* Images */}
      <div>
        <div className="idx-style-102">{renderImage(imgs[imgIdx], "idx-style-102-img")}</div>
        <div className="idx-style-103">
          {imgs.map((img, i) => <button key={i} onClick={() => setImgIdx(i)} style={{
            background: imgIdx === i ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${imgIdx === i ? "#FFD700" : "rgba(255,215,0,0.15)"}`,
            borderRadius: 10,
            padding: "8px",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.4rem"
          }}>
            {renderImage(img, "idx-style-103-thumb")}
          </button>)}
        </div>
      </div>
      {/* Info */}
      <div>
        <div className="idx-style-104">
          {p.category} • {p.unit}
        </div>
        <h1 className="idx-style-105">{p.name}</h1>
        <div className="idx-style-106">
          <StarRating rating={p.rating} />
          <span className="idx-style-107">{p.reviews} reviews</span>
        </div>
        <div className="idx-style-108">
          <span className="idx-style-109">₹{p.price}</span>
          <span className="idx-style-110">₹{p.mrp}</span>
          <span className="idx-style-111">Save {discount}%</span>
        </div>
        <p className="idx-style-112">{p.desc}</p>
        {/* Stock */}
        <div className="idx-style-113">
          {p.stock === 0 ? <span className="idx-style-114">● Out of Stock</span> : p.stock < 10 ? <span className="idx-style-115">● Only {p.stock} left!</span> : <span className="idx-style-116">
            ● In Stock ({p.stock} available)
          </span>}
        </div>
        {/* Price Breakup */}
        <div className="idx-style-117">
          <div className="idx-style-118">Price breakup (qty: {qty})</div>
          <div className="idx-style-119">
            <span>Base</span>
            <span>₹{Math.round(p.price / 1.18) * qty}</span>
          </div>
          <div className="idx-style-120">
            <span>GST (18%)</span>
            <span>₹{Math.round((p.price - p.price / 1.18) * qty)}</span>
          </div>
          <div className="idx-style-121">
            <span>Total</span>
            <span>₹{(p.price * qty).toLocaleString("en-IN")}</span>
          </div>
        </div>
        {/* Qty */}
        <div className="idx-style-122">
          <span className="idx-style-123">Qty:</span>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn}>
            −
          </button>
          <span className="idx-style-124">{qty}</span>
          <button onClick={() => setQty(q => Math.min(p.stock, q + 1))} style={qtyBtn}>
            +
          </button>
        </div>
        {/* CTA */}
        <div className="idx-style-126">
          <button onClick={() => onAddToCart({
            ...p,
            qty
          })} disabled={p.stock === 0} style={{
            ...btnStyle(p.stock === 0 ? "disabled" : "outline"),
            flex: 1,
            padding: "12px"
          }}>
            🛒 Add to Cart
          </button>
          <button onClick={() => {
            onAddToCart({
              ...p,
              qty
            });
            onNavigate("cart");
          }} disabled={p.stock === 0} style={{
            ...btnStyle(p.stock === 0 ? "disabled" : "primary"),
            flex: 1,
            padding: "12px"
          }}>
            ⚡ Buy Now
          </button>
        </div>
        <div className="idx-style-127">
          <span>🚀 Free delivery above ₹999</span>
          <span>🔒 Secure payment</span>
          <span>✅ Licensed product</span>
        </div>
      </div>
    </div>
    {/* Related */}
    {related.length > 0 && <div>
      <h2 className="idx-style-128">More from {p.category}</h2>
      <div className="idx-style-129">
        {related.map(r => <ProductCard key={r.id} p={r} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
      </div>
    </div>}
  </div>;
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage({
  cart,
  onUpdate,
  onRemove,
  onNavigate
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const discAmt = Math.round(subtotal * discount / 100);
  const total = subtotal + delivery - discAmt;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      setCouponMsg("⌛ Validating...");
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscount(data.value); // Backend returns the % or flat value
        setCouponMsg(`✅ Coupon applied: ${data.value}${data.type === "percent" ? "%" : " flat"} off!`);
      } else {
        setCouponMsg(`❌ ${data.error || "Invalid coupon"}`);
        setDiscount(0);
      }
    } catch (err) {
      setCouponMsg("❌ Connection error");
      setDiscount(0);
    }
  };
  if (cart.length === 0) return <div className="idx-style-134">
    <div className="idx-style-135">🛒</div>
    <h2 className="idx-style-136">Your cart is empty</h2>
    <p className="idx-style-137">
      Browse 75 products and add your favourites!
    </p>
    <button onClick={() => onNavigate("products")} style={btnStyle("primary")}>
      Shop Now 🎆
    </button>
  </div>;
  return <div className="idx-style-138">
    <h1 className="idx-style-139">
      Shopping Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
    </h1>
    <div className="idx-style-140">
      {/* Items */}
      <div className="idx-style-141">
        {cart.map(item => {
          const d = Math.round((1 - item.price / item.mrp) * 100);
          return <div key={item.id} style={{
            ...cardStyle,
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <div className="idx-style-142">{renderImage(item.image, "idx-style-142-img")}</div>
            <div className="idx-style-143">
              <div className="idx-style-144">
                {item.category} • {item.unit}
              </div>
              <div className="idx-style-145">{item.name}</div>
              <div className="idx-style-146">
                <span className="idx-style-147">₹{item.price}</span>
                <span className="idx-style-148">₹{item.mrp}</span>
                <span className="idx-style-149">{d}% OFF</span>
              </div>
            </div>
            <div className="idx-style-150">
              <button onClick={() => onUpdate(item.id, item.qty - 1)} style={qtyBtn}>
                −
              </button>
              <span className="idx-style-151">{item.qty}</span>
              <button onClick={() => onUpdate(item.id, item.qty + 1)} style={qtyBtn}>
                +
              </button>
            </div>
            <div className="idx-style-152">
              ₹{(item.price * item.qty).toLocaleString("en-IN")}
            </div>
            <button onClick={() => onRemove(item.id)} className="idx-style-153">
              ✕
            </button>
          </div>;
        })}
      </div>
      {/* Summary */}
      <div style={{
        ...cardStyle,
        position: "sticky",
        top: 80
      }}>
        <h3 className="idx-style-154">Order Summary</h3>
        <div className="idx-style-155">
          <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="idx-style-156" />
          <button onClick={applyCoupon} style={{
            ...btnStyle("outline"),
            padding: "8px 12px",
            fontSize: "0.76rem"
          }}>
            Apply
          </button>
        </div>
        {couponMsg && <div style={{
          fontSize: "0.76rem",
          color: couponMsg.startsWith("✅") ? "#4CAF50" : "#FF5252",
          marginBottom: 6
        }}>
          {couponMsg}
        </div>}
        {[["Subtotal", `₹${subtotal.toLocaleString("en-IN")}`], ["Delivery", delivery === 0 ? "FREE 🎉" : `₹${delivery}`], ...(discount ? [["Discount", `-₹${discAmt.toLocaleString("en-IN")}`]] : [])].map(([k, v]) => <div key={k} className="idx-style-158">
          <span>{k}</span>
          <span style={{
            color: k === "Discount" ? "#4CAF50" : "#ccc"
          }}>
            {v}
          </span>
        </div>)}
        <div className="idx-style-159">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        {delivery > 0 && <div className="idx-style-160">
          Add ₹{999 - subtotal} more for free delivery!
        </div>}
        <button onClick={() => onNavigate("checkout")} style={{
          ...btnStyle("primary"),
          width: "100%",
          padding: "12px",
          fontSize: "0.92rem"
        }}>
          Proceed to Checkout →
        </button>
        <button onClick={() => onNavigate("products")} style={{
          ...btnStyle("ghost"),
          width: "100%",
          marginTop: 9,
          fontSize: "0.8rem"
        }}>
          Continue Shopping
        </button>
      </div>
    </div>
  </div>;
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart, onPlaceOrder, onNavigate, user }) {
  const getSavedAddress = () => {
    const saved = localStorage.getItem("sivakasicracker_saved_address");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.address)) return parsed;
      } catch (e) { }
    }
    return {
      name: user?.name || "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "Tamil Nadu",
      pincode: user?.pincode || ""
    };
  };

  const [useSaved, setUseSaved] = useState(true);
  const [saveDetails, setSaveDetails] = useState(true);
  const [form, setForm] = useState(getSavedAddress);
  const [method, setMethod] = useState("gpay");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;

  useEffect(() => {
    if (user?.address && !form.address) {
      setForm(p => ({
        ...p,
        name: user.name || p.name,
        mobile: user.mobile || p.mobile,
        email: user.email || p.email,
        address: user.address || p.address,
        city: user.city || p.city,
        state: user.state || p.state,
        pincode: user.pincode || p.pincode
      }));
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Valid 10-digit mobile required";
    if (!form.address.trim()) e.address = "Address required";
    if (!form.city.trim()) e.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const WHATSAPP_NUMBER = "916374549935";

  const handlePayment = () => {
    if (!validate()) return;
    const orderId = "SRBA" + Date.now().toString().slice(-8).toUpperCase();

    // Auto-save address for future visits
    if (saveDetails) {
      localStorage.setItem("sivakasicracker_saved_address", JSON.stringify(form));
    }

    // Place order directly on the web app
    onPlaceOrder({ ...form, method, total, orderId, items: cart });
    onNavigate("success", orderId);
  };

  return <div className="idx-style-161">
    <h1 className="idx-style-162">Checkout</h1>
    <p className="idx-style-163">Sri Ram Balaji Agency • Srivilliputtur</p>

    {/* Steps */}
    <div className="idx-style-164">
      {["User Details", "Payment"].map((s, i) => <div key={s} className="idx-style-165">
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: i < step ? "pointer" : "default"
        }} onClick={() => i < step && setStep(i + 1)}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.82rem",
            background: step > i + 1 ? "#4CAF50" : step === i + 1 ? "linear-gradient(135deg,#FF6B35,#FFD700)" : "rgba(255,255,255,0.07)",
            color: step >= i + 1 ? "#000" : "#666"
          }}>
            {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
          </div>
          <span style={{
            color: step >= i + 1 ? "#FFD700" : "#555",
            fontSize: "0.83rem",
            fontWeight: step === i + 1 ? 700 : 400
          }}>
            {s}
          </span>
        </div>
        {i < 1 && <div style={{
          width: 36,
          height: 2,
          background: step > 1 ? "#4CAF50" : "rgba(255,255,255,0.07)",
          margin: "0 10px"
        }} />}
      </div>)}
    </div>

    <div className="idx-style-166">
      <div>
        {step === 1 && <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 className="idx-style-167" style={{ margin: 0 }}>User & Delivery Details</h3>
            {form.address && (
              <span style={{ fontSize: "0.75rem", color: "#4CAF50", background: "rgba(76,175,80,0.12)", padding: "4px 8px", borderRadius: 6 }}>
                ✓ Address Remembered
              </span>
            )}
          </div>

          <div className="idx-style-168">
            {[["name", "Full Name", "text"], ["mobile", "Mobile Number", "tel"], ["email", "Email Address (Optional)", "email"], ["address", "Full Delivery Address", "text"], ["city", "City", "text"], ["pincode", "Pincode", "text"]].map(([f, l, t]) => <div key={f} style={{
              gridColumn: f === "address" ? "1/-1" : "auto"
            }}>
              <label className="idx-style-169">{l}</label>
              <input type={t} value={form[f]} onChange={e => setForm(p => ({
                ...p,
                [f]: e.target.value
              }))} style={{
                ...inputStyle,
                borderColor: errors[f] ? "#FF5252" : "rgba(255,215,0,0.2)"
              }} />
              {errors[f] && <div className="idx-style-170">{errors[f]}</div>}
            </div>)}

            <div className="idx-style-171">
              <label className="idx-style-172">State</label>
              <select value={form.state} onChange={e => setForm(p => ({
                ...p,
                state: e.target.value
              }))} className="idx-style-173">
                {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Delhi", "West Bengal"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Remember Address Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }} onClick={() => setSaveDetails(!saveDetails)}>
            <input type="checkbox" checked={saveDetails} onChange={() => { }} style={{ accentColor: "#FFD700", width: 16, height: 16 }} />
            <span style={{ fontSize: "0.82rem", color: "#ddd" }}>Save delivery address for future orders</span>
          </div>

          <button onClick={() => validate() && setStep(2)} style={{
            ...btnStyle("primary"),
            width: "100%",
            padding: "12px",
            marginTop: 18
          }}>
            Continue to Payment →
          </button>
        </div>}

        {step === 2 && <div style={cardStyle}>
          <h3 className="idx-style-177">Payment Method</h3>

          {/* COD Not Available Notice */}
          <div style={{
            padding: "12px 16px",
            background: "rgba(255,82,82,0.1)",
            border: "1px solid rgba(255,82,82,0.3)",
            borderRadius: 12,
            marginBottom: 16,
            color: "#FF8A80",
            fontSize: "0.85rem",
            lineHeight: "1.4"
          }}>
            🚫 <strong>Cash on Delivery (COD) is NOT Available</strong><br />
            Due to firecracker transport safety regulations, COD is not accepted. Please pay online via GPay.
          </div>

          {/* GPay / UPI Payment Choice Only */}
          {[
            ["gpay", "📱 GPay / UPI", "Pay online via Google Pay / PhonePe / Paytm / BHIM"]
          ].map(([val, label, sub]) => <div key={val} onClick={() => setMethod(val)} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: 15,
            borderRadius: 12,
            marginBottom: 11,
            cursor: "pointer",
            border: `2px solid #FFD700`,
            background: "rgba(255,215,0,0.06)",
            transition: "all 0.2s"
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: `2px solid #FFD700`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2
            }}>
              <div className="idx-style-178" />
            </div>
            <div>
              <div className="idx-style-179">{label}</div>
              <div className="idx-style-180">{sub}</div>
              <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(255,215,0,0.07)", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>
                <div style={{ fontSize: "1rem", color: "#FFD700", fontWeight: 700, marginBottom: 4 }}>📲 GPay / PhonePe Number</div>
                <div style={{ fontSize: "1.4rem", color: "#fff", fontWeight: 800, letterSpacing: 2 }}>+91 63745 49935</div>
                <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 6 }}>Send total ₹{total.toLocaleString("en-IN")} to this GPay number to complete order payment</div>
              </div>
            </div>
          </div>)}

          {/* Delivery Fee Notice (Seasonal & Distance based) */}
          <div style={{
            padding: "12px 16px",
            background: "rgba(255, 215, 0, 0.08)",
            border: "1px solid rgba(255, 215, 0, 0.25)",
            borderRadius: 12,
            marginTop: 14,
            marginBottom: 14
          }}>
            <div style={{ color: "#FFD700", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
              🚚 Delivery Charge Notice
            </div>
            <div style={{ fontSize: "0.8rem", color: "#ddd", marginTop: 4, lineHeight: "1.4" }}>
              Delivery charges vary based on <strong>seasonal demand, destination city, and distance (km)</strong>. Once confirmed on web, your itemized final receipt will be shared via <strong>WhatsApp</strong>.
            </div>
          </div>

          {/* Safe Delivery Responsibility Guarantee */}
          <div style={{
            padding: "12px 16px",
            background: "rgba(76, 175, 80, 0.1)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            borderRadius: 12,
            marginBottom: 16
          }}>
            <div style={{ color: "#81C784", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
              🛡️ 100% Safe Delivery Guaranteed!
            </div>
            <div style={{ fontSize: "0.8rem", color: "#C8E6C9", marginTop: 4, lineHeight: "1.4" }}>
              Delivering your product safely is <strong>our complete responsibility</strong>. Safe transport and intact package delivery are 100% guaranteed.
            </div>
          </div>

          <div className="idx-style-183">
            ⚠️ Sale of fireworks to minors is prohibited by law. By proceeding, you confirm you are 18+ years old.
          </div>

          <div className="idx-style-184">
            <button onClick={() => setStep(1)} style={{
              ...btnStyle("ghost"),
              flex: 1,
              padding: "12px"
            }}>
              ← Back
            </button>
            <button onClick={handlePayment} style={{
              ...btnStyle("primary"),
              flex: 2,
              padding: "12px",
              fontSize: "0.86rem"
            }}>
              🎉 Confirm & Place Order Now
            </button>
          </div>
        </div>}
      </div>

      {/* Order Summary */}
      <div style={{
        ...cardStyle,
        position: "sticky",
        top: 80
      }}>
        <h3 className="idx-style-185">Order ({cart.length})</h3>
        <div className="idx-style-186">
          {cart.map(i => <div key={i.id} className="idx-style-187" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {renderImage(i.image, "idx-style-187-img")}
            </div>
            <div style={{ flex: 1 }}>
              <div className="idx-style-188" style={{ fontSize: '0.85rem', color: '#fff' }}>
                {i.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                ₹{i.price.toLocaleString("en-IN")} × {i.qty}
              </div>
            </div>
            <span className="idx-style-189" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              ₹{(i.price * i.qty).toLocaleString("en-IN")}
            </span>
          </div>)}
        </div>

        <div className="idx-style-190">
          <div className="idx-style-191">
            <span>Delivery Charge</span>
            <span style={{ color: "#FFD700", fontSize: "0.78rem" }}>
              Varies by Season & KM (Receipt on WhatsApp)
            </span>
          </div>
          <div className="idx-style-192">
            <span>Item Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={{
          marginTop: 14,
          padding: "10px 12px",
          background: "rgba(76,175,80,0.08)",
          border: "1px dashed rgba(76,175,80,0.3)",
          borderRadius: 8,
          fontSize: "0.76rem",
          color: "#A5D6A7",
          lineHeight: "1.3",
          textAlign: "center"
        }}>
          🛡️ Delivering your product safely is <strong>our responsibility</strong>.
        </div>
      </div>
    </div>
  </div>;
}

// ============================================================
// ORDER SUCCESS PAGE
// ============================================================
function OrderSuccessPage({
  orderId,
  onNavigate
}) {
  const WHATSAPP_NUMBER = "916374549935";
  const waMsg = encodeURIComponent(
    `🎆 *Sri Ram Balaji Agency — Order Copy*\n` +
    `Order ID: ${orderId}\n` +
    `Hi! I have placed an order on your website (Order ID: ${orderId}). Please confirm delivery charge and receipt.`
  );

  return <div className="idx-style-193">
    <div className="idx-style-194"><Flame size={64} color="#FFD700" /></div>
    <h1 className="idx-style-195">Order Placed Successfully!</h1>
    <p className="idx-style-196">
      Thank you for shopping with Sri Ram Balaji Agency 🙏
    </p>

    <div className="idx-style-197">
      <div className="idx-style-198">Order ID</div>
      <div className="idx-style-199">{orderId}</div>
      <div className="idx-style-200" style={{ color: "#81C784", marginTop: 8 }}>
        ✅ Your order is confirmed on our website!
      </div>
    </div>

    {/* Safe Delivery Guarantee Banner */}
    <div style={{
      maxWidth: 500,
      margin: "0 auto 24px auto",
      padding: "14px 18px",
      background: "rgba(76, 175, 80, 0.12)",
      border: "1px solid rgba(76, 175, 80, 0.4)",
      borderRadius: 14,
      textAlign: "center"
    }}>
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
      ].map(([icon, t, d]) => <div key={t} className="idx-style-202">
        <div className="idx-style-203" style={{ color: '#FFD700', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        <div className="idx-style-204">{t}</div>
        <div className="idx-style-205">{d}</div>
      </div>)}
    </div>

    <div className="idx-style-206" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, maxWidth: 400, margin: "24px auto 0 auto" }}>
      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank")} style={{ ...btnStyle("primary"), width: "100%", padding: "12px", background: "#25D366", borderColor: "#25D366" }}>
        📱 Send Order Copy on WhatsApp (Optional)
      </button>
      <button onClick={() => onNavigate("home")} style={{ ...btnStyle("outline"), width: "100%", padding: "12px" }}>
        🏠 Back to Home
      </button>
    </div>
  </div>;
}

function LoginPage({ onLogin, showToast }) {
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isReg && !form.name.trim()) return showToast("Name is required");
    if (!form.mobile.trim()) return showToast("Mobile number is required");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return showToast("Enter a valid 10-digit mobile number");

    setLoading(true);
    try {
      const endpoint = isReg ? "/api/auth/register" : "/api/auth/login-shop";
      const payload = isReg ? { ...form } : { mobile: form.mobile };
      if (isReg && !payload.email) delete payload.email;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isReg ? "Registration failed" : "Login failed"));

      onLogin(data.user, data.token);
      showToast(isReg ? "Account created successfully!" : "Logged in successfully!");
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="idx-style-207">
    <div style={{ ...cardStyle, maxWidth: 400, width: "100%", border: "1px solid rgba(255,215,0,0.28)" }}>
      <div className="idx-style-208">
        <div className="idx-style-209">🪔</div>
        <h2 className="idx-style-210">{isReg ? "Create Account" : "Welcome Back"}</h2>
        <p className="idx-style-211">Sri Ram Balaji Agency</p>
      </div>
      {isReg && <div className="idx-style-212">
        <label className="idx-style-213">Full Name</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle} />
      </div>}
      <div className="idx-style-214">
        <label className="idx-style-215">Mobile Number</label>
        <input type="tel" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="Enter your 10-digit mobile" style={inputStyle} />
      </div>
      {isReg && <div className="idx-style-212">
        <label className="idx-style-213">Email (Optional)</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={inputStyle} />
      </div>}
      <button onClick={submit} disabled={loading} style={{ ...btnStyle("primary"), width: "100%", padding: "12px", fontSize: "0.92rem", marginTop: 20 }}>
        {loading ? "Please wait..." : isReg ? "Create Account →" : "Sign In →"}
      </button>
      <div className="idx-style-220" style={{ marginTop: 20 }}>
        {isReg ? "Have account? " : "New here? "}
        <span onClick={() => setIsReg(r => !r)} className="idx-style-221">{isReg ? "Sign In" : "Register Now"}</span>
      </div>
    </div>
  </div>;
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ orders, token }) {
  const [realOrders, setRealOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch(`${API_BASE}/api/orders/my`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setRealOrders(Array.isArray(data) ? data : []))
        .catch(err => console.error("History fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const displayOrders = realOrders.length > 0 ? realOrders : orders;

  if (loading) return <div className="idx-style-226"><p>Loading your orders...</p></div>;
  if (!loading && displayOrders.length === 0) return <div className="idx-style-226">
    <div className="idx-style-227"><Package size={64} color="#888" /></div>
    <h2 className="idx-style-228">No orders yet</h2>
    <p className="idx-style-229">Your order history will appear here after you place an order.</p>
  </div>;

  return <div className="idx-style-230">
    <h1 className="idx-style-231">My Orders</h1>
    {displayOrders.map((o, i) => <div key={o.orderId || i} style={{ ...cardStyle, marginBottom: 13 }}>
      <div className="idx-style-232">
        <div>
          <div className="idx-style-233">#{o.orderId}</div>
          <div className="idx-style-234">Placed on {new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN")}</div>
          <div className="idx-style-235" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} /> {o.customer?.address || o.address}, {o.customer?.city || o.city}
          </div>
          <div className="idx-style-236">📅 Status: {o.status || "Confirmed"} • {o.items?.length || 0} items</div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 5 }}>
            Subtotal: ₹{o.subtotal?.toLocaleString("en-IN")} &nbsp;|&nbsp;
            Delivery: ₹{o.deliveryCharge?.toLocaleString("en-IN")}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.isArray(o.items) && o.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                  {renderImage(item.image, "idx-order-item-img")}
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#ccc' }}>
                  {item.name} <span style={{ color: '#666' }}>× {item.qty}</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
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
    </div>)}
  </div>;
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, cart, onNavigate, user, onLogout }) {
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return <nav className="idx-style-241">
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
        {[["home", "Home", <Home size={18} />], ["products", "Products", <ShoppingBag size={18} />]].map(([p, l, icon]) => <button key={p} onClick={() => onNavigate(p)} style={{
          background: "none",
          border: "none",
          color: page === p ? "#FFD700" : "#888",
          cursor: "pointer",
          padding: "6px 9px",
          fontFamily: "inherit",
          fontSize: "0.8rem",
          fontWeight: page === p ? 700 : 400,
          borderBottom: page === p ? "2px solid #FFD700" : "2px solid transparent",
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>{icon} <span className="nav-btn-text">{l}</span></button>)}

        {user ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => onNavigate("orders")} style={{ background: "none", padding: "4px 8px", border: "none", color: page === "orders" ? "#FFD700" : "#888", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, borderBottom: page === "orders" ? "2px solid #FFD700" : "2px solid transparent", display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} /> <span className="nav-btn-text">{user.name.split(" ")[0]}</span>
          </button>
          <button onClick={onLogout} style={{
            background: "none", border: "none", color: "#FF5252", padding: "6px 9px", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer", borderBottom: "2px solid transparent", display: 'flex', alignItems: 'center', gap: 6
          }}><LogOut size={16} /> <span className="nav-btn-text">Logout</span></button>
        </div> : <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", color: page === "login" ? "#FFD700" : "#888", cursor: "pointer", fontSize: "0.82rem", padding: "4px 8px", borderBottom: page === "login" ? "2px solid #FFD700" : "2px solid transparent", display: 'flex', alignItems: 'center', gap: 6 }}>
          <LogIn size={16} /> <span className="nav-btn-text">Login</span>
        </button>}
        <button onClick={() => onNavigate("cart")} style={{ ...btnStyle("primary"), padding: "7px 13px", fontSize: "0.8rem", position: "relative", marginLeft: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={18} /> {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "#FF1744", color: "#fff", borderRadius: "50%", width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 900 }}>{cartCount}</span>}
        </button>
      </div>
    </div>
  </nav>;
}

// ============================================================
// APP WALKTHROUGH
// ============================================================
function Walkthrough() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Flame size={48} color="#FFD700" />,
      title: "Welcome to Sri Ram Balaji!",
      text: "Premium Quality Fireworks for your grand celebrations. Explore our Price List 2025!"
    },
    {
      icon: <ShoppingBag size={48} color="#FFD700" />,
      title: "Easy Browsing",
      text: "Filter by categories and search for your favorite crackers easily."
    },
    {
      icon: <ShoppingCart size={48} color="#FFD700" />,
      title: "Smart Shopping",
      text: "Add items to your cart and see the best discounts applied instantly."
    },
    {
      icon: <Send size={48} color="#FFD700" />,
      title: "Order on WhatsApp",
      text: "Finalize your order and send it directly via WhatsApp for quick confirmation!"
    }
  ];

  useEffect(() => {
    const shown = localStorage.getItem("walkthrough_shown");
    if (!shown) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const close = () => {
    setShow(false);
    localStorage.setItem("walkthrough_shown", "true");
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  if (!show) return null;

  return (
    <div className="walkthrough-overlay">
      <div className="walkthrough-card">
        <button className="walkthrough-skip" onClick={close}>Skip</button>
        <div className="walkthrough-content">
          <div className="walkthrough-emoji">{steps[step].icon}</div>
          <h2 className="walkthrough-title">{steps[step].title}</h2>
          <p className="walkthrough-text">{steps[step].text}</p>
        </div>

        <div className="walkthrough-footer">
          <div className="walkthrough-dots">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`walkthrough-dot ${i === step ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="walkthrough-next" onClick={next}>
            {step === steps.length - 1 ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AI SUPPORT AGENT & QUICK WHATSAPP CHAT WIDGET
// ============================================================
function AiSupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Sri Ram Balaji Agency! How can I assist you with your cracker order today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInput("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out! For instant personal assistance, you can also chat with our support team directly on WhatsApp (+916374549935).";
      const lower = txt.toLowerCase();

      if (lower.includes("track") || lower.includes("status")) {
        botReply = "📦 Orders are processed quickly! You can view your placed orders under 'My Orders' or contact us on WhatsApp for live tracking updates.";
      } else if (lower.includes("delivery") || lower.includes("km") || lower.includes("charge") || lower.includes("fee")) {
        botReply = "🚚 Delivery charges vary based on seasonal demand & distance (km). Once confirmed on web, your itemized final receipt will be sent via WhatsApp!";
      } else if (lower.includes("pay") || lower.includes("gpay") || lower.includes("cod")) {
        botReply = "📱 We accept GPay / UPI payments to +916374549935. Note: Cash on Delivery (COD) is unavailable due to firecracker transport rules.";
      } else if (lower.includes("guarantee") || lower.includes("safe") || lower.includes("damage")) {
        botReply = "🛡️ 100% Safe Delivery Guaranteed! Delivering your product intact is completely OUR RESPONSIBILITY.";
      }

      setMessages(prev => [...prev, {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
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
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
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

// ============================================================
// APP ROOT
// ============================================================
export default function ShopApp() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [toast, setToast] = useState(null);
  const showToast = msg => setToast(msg);

  useEffect(() => {
    // Fetch Banners
    fetch(`${API_BASE}/api/banners`)
      .then(res => res.json())
      .then(data => setBanners(data || []))
      .catch(err => console.error("Banner fetch error", err));

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products?limit=200`);
        if (res.ok) {
          const data = await res.json();
          const raw = data.products || data || [];
          const normalized = raw.map((p) => ({
            ...p,
            id: p._id || p.id,
            sales: p.sales || p.salesCount || 0,
            image: (p.images && p.images.length) ? p.images[0] : (p.image || p.emoji || "🎇"),
            stock: typeof p.stock === "number" ? p.stock : (p.stock || 0)
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);


  // Load session on mount & re-sync profile
  useEffect(() => {
    const sToken = localStorage.getItem("srt_token");
    if (sToken) {
      setToken(sToken);
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${sToken}` }
      })
        .then(res => res.json())
        .then(u => {
          if (u && !u.error) {
            setUser(u);
            localStorage.setItem("srt_user", JSON.stringify(u));
          }
        })
        .catch(() => {
          // If fetch fails, fallback to local storage
          const sUser = localStorage.getItem("srt_user");
          if (sUser) setUser(JSON.parse(sUser));
        });
    }
  }, []);

  const onLogin = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("srt_token", t);
    localStorage.setItem("srt_user", JSON.stringify(u));
    setPage("home");
  };

  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("srt_token");
    localStorage.removeItem("srt_user");
    setPage("home");
  };

  const onNavigate = (p, id) => {
    if (p === "checkout" && !user) {
      setPage("login");
      showToast("Please login to proceed to checkout");
      return;
    }
    setPage(p);
    if (p === "product") setProductId(id);
    if (p === "success") setOrderId(id);
    window.scrollTo(0, 0);
  };

  const onAddToCart = useCallback(product => {
    const qty = product.qty || 1;
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { ...product, qty }];
    });
    showToast(`${product.name} added to cart!`);
  }, []);

  const onUpdate = (id, qty) => {
    if (qty < 1) return onRemove(id);
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };
  const onRemove = id => setCart(c => c.filter(i => i.id !== id));

  const onPlaceOrder = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          customer: {
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode
          },
          subtotal: data.total - (data.total >= 999 ? 0 : 99),
          deliveryCharge: data.total >= 999 ? 0 : 99,
          total: data.total,
          items: data.items.map(it => ({ product: it.id, name: it.name, price: it.price, qty: it.qty, image: it.image }))
        })
      });
      if (res.ok) {
        setOrders(o => [...o, data]);
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to save order to DB:", err);
      // Fallback for offline/error
      setOrders(o => [...o, data]);
      setCart([]);
    }
  };

  const shared = { onAddToCart, onNavigate, banners };
  return <div className="idx-style-250">


    <FireworksCanvas />
    <Navbar page={page} cart={cart} onNavigate={onNavigate} user={user} onLogout={onLogout} />

    <main className="idx-style-251">
      {page === "home" && <HomePage products={products} banners={banners} {...shared} />}
      {page === "products" && <ProductsPage products={products} {...shared} />}
      {page === "product" && <ProductDetailPage productId={productId} products={products} {...shared} />}
      {page === "cart" && <CartPage cart={cart} onUpdate={onUpdate} onRemove={onRemove} onNavigate={onNavigate} />}
      {page === "checkout" && <CheckoutPage cart={cart} onPlaceOrder={onPlaceOrder} onNavigate={onNavigate} user={user} />}
      {page === "success" && <OrderSuccessPage orderId={orderId} onNavigate={onNavigate} />}
      {page === "login" && <LoginPage onLogin={onLogin} showToast={showToast} />}
      {page === "orders" && <OrdersPage orders={orders} token={token} />}
    </main>

    {/* FOOTER */}
    <footer className="idx-style-252">
      <div className="idx-style-253">
        <div className="idx-style-254">
          <div>
            <div className="idx-style-255" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flame size={20} color="#FFD700" /> Sri Ram Balaji Agency
            </div>
            <p className="idx-style-256">
              329-H/1, Srivilliputtur to Alangulam Road,
              <br />
              Sri Venkateswara Nagar, Pillaiyarkulam,
              <br />
              P. Ramachatrapuram - 626 137
              <br />
              Srivilliputtur (T.K)
            </p>
            <div className="idx-style-257">
              📞 99407 67763 &nbsp;|&nbsp; 99409 19857
            </div>
          </div>
          <div>
            <div className="idx-style-258">Product Categories</div>
            {["Flash Light Crackers", "Garalands", "Flower Pots", "Sparkless", "Aerial Fancy", "Rockets", "Fountain", "Bombs"].map(c => <div key={c} onClick={() => onNavigate("products")} className="idx-style-259">
              → {c}
            </div>)}
          </div>
          <div>
            <div className="idx-style-260">Quick Links</div>
            {[["home", "Home"], ["products", `All Products (${products.length}+)`], ["cart", "My Cart"], ["orders", "Order History"]].map(([p, l]) => <div key={p} onClick={() => onNavigate(p)} className="idx-style-261">
              → {l}
            </div>)}
          </div>
          <div>
            <div className="idx-style-262">Why Choose Us</div>
            {[
              { icon: <ShieldCheck size={16} />, label: "Licensed & Certified Products" },
              { icon: <Tag size={16} />, label: "Upto 50% Discount" },
              { icon: <Send size={16} />, label: "Pan-India Delivery" },
              { icon: <Lock size={16} />, label: "Secure Payments" },
              { icon: <Package size={16} />, label: "Safe Packaging" },
              { icon: <Phone size={16} />, label: "24×7 Support" },
              { icon: <ExternalLink size={16} />, label: "Third Party Verified" } // Perfect icon for thirdparty
            ].map(i => <div key={i.label} className="idx-style-263" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#FFD700' }}>{i.icon}</span> {i.label}
            </div>)}
          </div>
        </div>
        <div className="idx-style-264">
          <span>
            © 2026 Sri Ram Balaji Agency, Srivilliputtur.&nbsp;|&nbsp; All rights reserved.
            <br /> <span className="managed-by-highlight">Managed by Balaji G (6383783573).</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={14} /> SSL Secured &nbsp;|&nbsp; <ShieldCheck size={14} /> PESO Licensed Products
          </span>
        </div>
      </div>
    </footer>

    {/* WhatsApp floating button */}
    <a href="https://wa.me/916374549935?text=Hi! I want to order from Sri Ram Balaji Agency Price List 2025" target="_blank" rel="noreferrer" className="idx-style-265">
      <MessageCircle size={28} />
    </a>

    {/* AUTH MODALS — appear as overlay, don't navigate away */}

    <AiSupportAgent />
    <Walkthrough />
    {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
  </div>;
}
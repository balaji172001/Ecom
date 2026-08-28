import React, { useState, useEffect, useCallback } from "react";
import {
  Flame, ShieldCheck, Tag, Send, Lock, Package, Phone, ExternalLink, MessageCircle
} from "lucide-react";
import { API_BASE } from "./utils/constants";

import "./index.css";
// Import Modular Components
import FireworksCanvas from "./components/FireworksCanvas";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductsPage";
import ProductDetailPage from "./components/ProductDetailPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import LoginPage from "./components/LoginPage";
import OrdersPage from "./components/OrdersPage";
import AiSupportAgent from "./components/AiSupportAgent";
import Walkthrough from "./components/Walkthrough";
import Toast from "./components/Toast";

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
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("srt_last_order");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [toast, setToast] = useState(null);
  const showToast = (msg) => setToast(msg);

  useEffect(() => {
    // Fetch Banners
    fetch(`${API_BASE}/api/banners`)
      .then((res) => res.json())
      .then((data) => setBanners(data || []))
      .catch((err) => console.error("Banner fetch error", err));

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
            image: p.images && p.images.length ? p.images[0] : p.image || p.emoji || "🎇",
            stock: typeof p.stock === "number" ? p.stock : p.stock || 0,
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
        headers: { Authorization: `Bearer ${sToken}` },
      })
        .then((res) => res.json())
        .then((u) => {
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

  const onAddToCart = useCallback((product) => {
    const qty = product.qty || 1;
    setCart((c) => {
      const ex = c.find((i) => i.id === product.id);
      if (ex) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { ...product, qty }];
    });
    showToast(`${product.name} added to cart!`);
  }, []);

  const onUpdate = (id, qty) => {
    if (qty < 1) return onRemove(id);
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)));
  };
  const onRemove = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const onPlaceOrder = async (data) => {
    const orderData = { ...data, createdAt: new Date().toISOString() };
    setLastOrder(orderData);
    try {
      localStorage.setItem("srt_last_order", JSON.stringify(orderData));
    } catch (e) {}
    try {
      const res = await fetch(`${API_BASE}/api/orders/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
            pincode: data.pincode,
          },
          subtotal: data.total - (data.total >= 999 ? 0 : 99),
          deliveryCharge: data.total >= 999 ? 0 : 99,
          total: data.total,
          items: data.items.map((it) => ({ product: it.id, name: it.name, price: it.price, qty: it.qty, image: it.image })),
        }),
      });
      if (res.ok) {
        setOrders((o) => [...o, data]);
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to save order to DB:", err);
      // Fallback for offline/error
      setOrders((o) => [...o, data]);
      setCart([]);
    }
  };

  const shared = { onAddToCart, onNavigate, banners };
  return (
    <div className="idx-style-250">
      <FireworksCanvas />
      <Navbar page={page} cart={cart} onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main className="idx-style-251">
        {page === "home" && <HomePage products={products} banners={banners} {...shared} />}
        {page === "products" && <ProductsPage products={products} {...shared} />}
        {page === "product" && <ProductDetailPage productId={productId} products={products} {...shared} />}
        {page === "cart" && <CartPage cart={cart} onUpdate={onUpdate} onRemove={onRemove} onNavigate={onNavigate} />}
        {page === "checkout" && <CheckoutPage cart={cart} onPlaceOrder={onPlaceOrder} onNavigate={onNavigate} user={user} />}
        {page === "success" && <OrderSuccessPage orderId={orderId} onNavigate={onNavigate} lastOrder={lastOrder} />}
        {page === "login" && <LoginPage onLogin={onLogin} showToast={showToast} />}
        {page === "orders" && <OrdersPage orders={orders} token={token} />}
      </main>

      {/* FOOTER */}
      <footer className="idx-style-252">
        <div className="idx-style-253">
          <div className="idx-style-254">
            <div>
              <div className="idx-style-255" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <div className="idx-style-257">📞 99407 67763 &nbsp;|&nbsp; 99409 19857</div>
            </div>
            <div>
              <div className="idx-style-258">Product Categories</div>
              {["Flash Light Crackers", "Garalands", "Flower Pots", "Sparkless", "Aerial Fancy", "Rockets", "Fountain", "Bombs"].map((c) => (
                <div key={c} onClick={() => onNavigate("products")} className="idx-style-259">
                  → {c}
                </div>
              ))}
            </div>
            <div>
              <div className="idx-style-260">Quick Links</div>
              {[
                ["home", "Home"],
                ["products", `All Products (${products.length}+)`],
                ["cart", "My Cart"],
                ["orders", "Order History"],
              ].map(([p, l]) => (
                <div key={p} onClick={() => onNavigate(p)} className="idx-style-261">
                  → {l}
                </div>
              ))}
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
                { icon: <ExternalLink size={16} />, label: "Third Party Verified" },
              ].map((i) => (
                <div key={i.label} className="idx-style-263" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#FFD700" }}>{i.icon}</span> {i.label}
                </div>
              ))}
            </div>
          </div>
          <div className="idx-style-264">
            <span>
              © 2026 Sri Ram Balaji Agency, Srivilliputtur.&nbsp;|&nbsp; All rights reserved.
              <br /> <span className="managed-by-highlight">Managed by Balaji G (6383783573).</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={14} /> SSL Secured &nbsp;|&nbsp; <ShieldCheck size={14} /> PESO Licensed Products
            </span>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/916374549935?text=Hi! I want to order from Sri Ram Balaji Agency Price List 2025"
        target="_blank"
        rel="noreferrer"
        className="idx-style-265"
      >
        <MessageCircle size={28} />
      </a>

      <AiSupportAgent />
      <Walkthrough />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
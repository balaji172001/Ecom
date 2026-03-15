import "./index.css";
import { useState, useEffect, useCallback } from "react";

// Components
import FireworksCanvas from "./components/Shop/FireworksCanvas";
import Navbar from "./components/Shop/Navbar";
import BannerCarousel from "./components/Shop/BannerCarousel";
import Toast from "./components/Shop/Toast";
import APKPopup from "./components/Shop/APKPopup";
import Walkthrough from "./components/Shop/Walkthrough";

// Pages
import HomePage from "./components/Shop/Pages/HomePage";
import ProductsPage from "./components/Shop/Pages/ProductsPage";
import ProductDetailPage from "./components/Shop/Pages/ProductDetailPage";
import CartPage from "./components/Shop/Pages/CartPage";
import CheckoutPage from "./components/Shop/Pages/CheckoutPage";
import OrderSuccessPage from "./components/Shop/Pages/OrderSuccessPage";
import LoginPage from "./components/Shop/Pages/LoginPage";
import OrdersPage from "./components/Shop/Pages/OrdersPage";

// Utils
import { API_BASE } from "./utils/shopConstants";
import { showToast } from "./utils/shopHelpers"; // Assuming I added this or just use local toast logic

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
  const [apkTrigger, setApkTrigger] = useState(false);

  const triggerToast = msg => setToast(msg);

  useEffect(() => {
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
          setProducts(raw.map(p => ({
            ...p,
            id: p._id || p.id,
            image: (p.images && p.images.length) ? p.images[0] : (p.image || p.emoji || "🎇"),
            stock: typeof p.stock === "number" ? p.stock : 0
          })));
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const sToken = localStorage.getItem("srt_token");
    if (sToken) {
      setToken(sToken);
      fetch(`${API_BASE}/api/auth/me`, { headers: { "Authorization": `Bearer ${sToken}` } })
        .then(res => res.json())
        .then(u => {
          if (u && !u.error) {
            setUser(u);
            localStorage.setItem("srt_user", JSON.stringify(u));
          }
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
      triggerToast("Please login to proceed to checkout");
      return;
    }
    setPage(p);
    if (id) {
      if (p === "product") setProductId(id);
      if (p === "success") setOrderId(id);
    }
    window.scrollTo(0, 0);
  };

  const onAddToCart = useCallback(product => {
    const qty = product.qty || 1;
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { ...product, qty }];
    });
    triggerToast(`✓ ${product.name} added to cart!`);
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setOrders(o => [...o, data]);
        setCart([]);
      }
    } catch (err) {
      console.error("Order failed:", err);
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
        {page === "success" && <OrderSuccessPage orderId={orderId} onNavigate={onNavigate} />}
        {page === "login" && <LoginPage onLogin={onLogin} showToast={triggerToast} />}
        {page === "orders" && <OrdersPage orders={orders} token={token} />}
      </main>

      <footer className="idx-style-252">
        <div className="idx-style-253">
          <div className="idx-style-254">
            <div>
              <div className="idx-style-255">🪔 Sri Ram Balaji Agency</div>
              <p className="idx-style-256">
                329-H/1, Srivilliputtur to Alangulam Road, Sri Venkateswara Nagar,
                Pillaiyarkulam, P. Ramachatrapuram - 626 137, Srivilliputtur (T.K)
              </p>
              <div className="idx-style-257">6374 549 935 | 99409 19857</div>
            </div>
            <div>
              <div className="idx-style-258">Quick Links</div>
              <div className="idx-style-259" onClick={() => onNavigate("home")}>Home</div>
              <div className="idx-style-259" onClick={() => onNavigate("products")}>Price List 2025</div>
              <div className="idx-style-259" onClick={() => onNavigate("login")}>Account Login</div>
              <div className="idx-style-259" onClick={() => onNavigate("orders")}>Track Order</div>
            </div>
            <div>
              <div className="idx-style-260">Product Categories</div>
              <div className="idx-style-261" onClick={() => onNavigate("products")}>Function Shots</div>
              <div className="idx-style-261" onClick={() => onNavigate("products")}>Garlands</div>
              <div className="idx-style-261" onClick={() => onNavigate("products")}>Novelties</div>
              <div className="idx-style-261" onClick={() => onNavigate("products")}>Comvos & Gift Boxes</div>
            </div>
            <div>
              <div className="idx-style-262">Support & Info</div>
              <div className="idx-style-263">WhatsApp: +91 6374 549 935</div>
              <div className="idx-style-263">Email: bulk@rambalajishop.shop</div>
              <div className="idx-style-263">Hours: 9:00 AM - 10:00 PM</div>
              <div className="idx-style-263">Licensed Sivakasi Vendor</div>
            </div>
          </div>
          <div className="idx-style-264">
            <span>© 2025-2026 Sri Ram Balaji Agency. All rights reserved. | <span style={{ cursor: 'pointer' }}>Privacy Policy</span> | <span style={{ cursor: 'pointer' }}>Terms</span></span>
            <span>Managed by <span className="managed-by-highlight">Balaji G (6383783573)</span></span>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/916374549935" target="_blank" rel="noreferrer" className="idx-style-265">📱</a>

      <Walkthrough trigger={apkTrigger} />
      <APKPopup onDismiss={() => setApkTrigger(true)} />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
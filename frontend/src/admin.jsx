import "./admin.css";
import { useState, useEffect } from "react";

// Components
import AdminLogin from "./components/Admin/AdminLogin";
import Sidebar from "./components/Admin/Sidebar";
import Dashboard from "./components/Admin/Dashboard";
import OrdersPage from "./components/Admin/OrdersPage";
import ProductsPage from "./components/Admin/ProductsPage";
import UsersPage from "./components/Admin/UsersPage";
import CouponsPage from "./components/Admin/CouponsPage";

// Utils
import { API_BASE } from "./utils/shopConstants";

export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) return;
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [pRes, oRes] = await Promise.all([
          fetch(`${API_BASE}/api/products?limit=500`),
          fetch(`${API_BASE}/api/admin/orders`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);
        if (pRes.ok) {
          const pData = await pRes.json();
          setProducts((pData.products || pData || []).map(p => ({ ...p, id: p._id || p.id })));
        }
        if (oRes.ok) {
          const oData = await oRes.json();
          setOrders(oData.map(o => ({ ...o, id: o._id || o.id })));
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [auth]);

  if (loading) return null;
  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050010" }}>
      <Sidebar active={page} onNav={setPage} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: collapsed ? 60 : 220, transition: "margin 0.3s ease" }}>
        {/* Top Navbar */}
        <header className="adm-style-121">
          <div className="adm-style-122">
            Admin <span className="adm-style-123"> / </span> <span className="adm-style-124">{page}</span>
          </div>
          <div className="adm-style-125">
            <div className="adm-style-126">Live Mode</div>
            <span className="adm-style-127">Sri Ram Balaji Admin</span>
            <button className="adm-style-128" onClick={() => { localStorage.removeItem("token"); setAuth(false); }}>Logout</button>
          </div>
        </header>

        <main style={{ padding: "0px", flex: 1 }}>
          {page === "dashboard" && <Dashboard products={products} orders={orders} />}
          {page === "orders" && <OrdersPage orders={orders} setOrders={setOrders} />}
          {page === "products" && <ProductsPage products={products} setProducts={setProducts} />}
          {page === "users" && <UsersPage />}
          {page === "coupons" && <CouponsPage />}
        </main>
      </div>
    </div>
  );
}

import "./admin.css";
import React, { useState, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import { API_BASE } from "./utils/adminConstants";

// Import Modular Components
import AdminLogin from "./admin_components/AdminLogin";
import Sidebar from "./admin_components/Sidebar";
import Dashboard from "./admin_components/Dashboard";
import AdminOrdersPage from "./admin_components/AdminOrdersPage";
import AdminProductsPage from "./admin_components/AdminProductsPage";
import AdminCouponsPage from "./admin_components/AdminCouponsPage";
import AdminBannersPage from "./admin_components/AdminBannersPage";
import AdminUsersPage from "./admin_components/AdminUsersPage";

export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1023);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1023;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    handleResize(); // Set initial collapse status
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
      return;
    }

    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Full Orders
      const allOrdersRes = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Products
      const prodRes = await fetch(`${API_BASE}/api/products?limit=500`);

      // 4. Misc Admin Data
      const [userRes, cupRes, banRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/banners`),
      ]);

      if (dashRes.ok && allOrdersRes.ok && prodRes.ok) {
        const dashData = await dashRes.json();
        const allOrders = await allOrdersRes.json();
        const pData = await prodRes.json();

        const rawProds = pData.products || pData || [];
        setProducts(rawProds.map((p) => ({ ...p, id: p._id || p.id })));
        setOrders(allOrders.map((o) => ({ ...o, id: o.orderId || o._id || o.id })));

        if (userRes.ok) setUsers(await userRes.json());
        if (cupRes.ok) setCoupons(await cupRes.json());
        if (banRes.ok) setBanners(await banRes.json());

        setLastUpdated(new Date());
        setAuth(true);
      } else if (dashRes.status === 401) {
        setAuth(false);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Critical Sync Error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [auth]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050010", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="live-pulse" style={{ width: 40, height: 40 }}></div>
      </div>
    );
  }

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;

  const MARGIN = isMobile ? 0 : sidebarCollapsed ? 60 : 220;

  return (
    <div className="adm-style-120" style={{ display: "flex", minHeight: "100vh", background: "#050010" }}>
      {isMobile && !sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
          }}
        />
      )}

      <Sidebar
        active={page}
        onNav={(p) => {
          setPage(p);
          if (isMobile) setSidebarCollapsed(true);
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
      />

      <div style={{ flex: 1, marginLeft: MARGIN, transition: "margin 0.3s ease", minWidth: 0 }}>
        <header className="adm-style-121">
          <div className="adm-style-122" style={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffd700",
                  cursor: "pointer",
                  padding: "8px 12px 8px 0",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Menu size={22} />
              </button>
            )}
            <span className="adm-style-123">Admin</span> / <span className="adm-style-124">{page}</span>
          </div>
          <div className="adm-style-125">
            <div className="adm-style-126">Live Feed Active</div>
            <span className="adm-style-127">Sri Ram Balaji Shop</span>
            <button
              className="adm-style-128"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
              onClick={() => {
                localStorage.removeItem("token");
                setAuth(false);
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main className="adm-style-129">
          {page === "dashboard" && (
            <Dashboard
              products={products}
              orders={orders}
              refreshData={fetchData}
              lastUpdated={lastUpdated}
              onNav={setPage}
              isMobile={isMobile}
            />
          )}
          {page === "orders" && <AdminOrdersPage orders={orders} setOrders={setOrders} />}
          {page === "products" && <AdminProductsPage products={products} setProducts={setProducts} />}
          {page === "coupons" && <AdminCouponsPage coupons={coupons} setCoupons={setCoupons} />}
          {page === "banners" && <AdminBannersPage banners={banners} setBanners={setBanners} />}
          {page === "users" && <AdminUsersPage users={users} />}
        </main>
      </div>
    </div>
  );
}

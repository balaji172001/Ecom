import { useState } from "react";
import { API_BASE } from "../../utils/shopConstants";
import { StatusBadge, EmptyState } from "./Common";

export default function OrdersPage({ orders, setOrders }) {
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");

    const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    const filtered = orders.filter(o => {
        if (statusFilter !== "All" && o.status !== statusFilter) return false;
        const customerName = typeof o.customer === 'object' ? (o.customer.name || "Unknown") : (o.customer || "Unknown");
        if (search && !customerName.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
        return true;
    });

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="adm-style-129">
            <div className="adm-style-102">
                <h1 className="page-title">Order Management</h1>
                <div className="adm-style-103">Manage customer orders and status updates</div>
            </div>

            <div className="adm-style-39" style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Search orders, customers..."
                        className="adm-style-10"
                        style={{ maxWidth: '400px' }}
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="adm-style-13"
                        style={{ width: '200px' }}
                    >
                        <option value="All">All Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="adm-style-104">
                <table className="adm-style-105">
                    <thead>
                        <tr className="adm-style-106">
                            <th className="adm-style-107">Order ID</th>
                            <th className="adm-style-107">Customer</th>
                            <th className="adm-style-107">Total</th>
                            <th className="adm-style-107">Status</th>
                            <th className="adm-style-107">Date</th>
                            <th className="adm-style-107">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(o => (
                            <tr key={o.id} className="adm-style-108">
                                <td className="adm-style-109" style={{ color: '#ffd700' }}>{o.id}</td>
                                <td className="adm-style-110">
                                    <div style={{ color: '#fff' }}>{typeof o.customer === 'object' ? o.customer.name : o.customer}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#555' }}>{typeof o.customer === 'object' && o.customer.mobile}</div>
                                </td>
                                <td className="adm-style-111" style={{ color: '#ff6b35', fontWeight: 900 }}>₹{o.total}</td>
                                <td className="adm-style-112"><StatusBadge status={o.status} small /></td>
                                <td className="adm-style-114" style={{ fontSize: '0.75rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td className="adm-style-115">
                                    <select
                                        value={o.status}
                                        onChange={e => updateStatus(o.id, e.target.value)}
                                        className="adm-style-13"
                                        style={{ fontSize: '0.75rem', padding: '4px 8px', width: 'auto' }}
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <EmptyState icon="📦" msg="No orders found matching your criteria" />}
            </div>
        </div>
    );
}

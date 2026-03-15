import { useState, useEffect } from "react";
import { API_BASE } from "../../../utils/shopConstants";

export default function OrdersPage({ orders: localOrders, token }) {
    const [orders, setOrders] = useState(localOrders);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/api/orders/my`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data || []);
                setLoading(false);
            });
    }, [token]);

    if (loading) return (
        <div className="idx-style-130">
            <div className="idx-style-131">📦</div>
            <div className="idx-style-132">Fetching your orders...</div>
        </div>
    );

    return (
        <div className="idx-style-230">
            <h1 className="idx-style-231">My Orders</h1>
            {orders.length === 0 ? (
                <div className="idx-style-226">
                    <div className="idx-style-227">📋</div>
                    <div className="idx-style-228">No orders yet</div>
                    <div className="idx-style-229">Start shopping to see your orders here!</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {orders.map(o => (
                        <div key={o._id} className="idx-style-232" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,215,0,0.1)' }}>
                            <div style={{ flex: 1 }}>
                                <div className="idx-style-233">Order #{o.orderId || o._id.slice(-8)}</div>
                                <div className="idx-style-234">{new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                <div className="idx-style-240">{o.status}</div>
                            </div>
                            <div className="idx-style-237">
                                <div className="idx-style-238">₹{o.total}</div>
                                <div className="idx-style-239">{o.items?.length || 0} Items</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

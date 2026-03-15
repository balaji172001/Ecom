import { useState, useEffect } from "react";
import { API_BASE } from "../../utils/shopConstants";
import { EmptyState } from "./Common";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ code: "", type: "percent", value: "", minOrder: 0 });

    const fetchCoupons = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/coupons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setCoupons(await res.json());
    };

    useEffect(() => { fetchCoupons(); }, []);

    const save = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/coupons`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            fetchCoupons();
            setShowForm(false);
            setForm({ code: "", type: "percent", value: "", minOrder: 0 });
        }
    };

    const deleteCoupon = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE}/api/admin/coupons/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCoupons();
    };

    return (
        <div className="adm-style-129">
            <div className="adm-style-54">
                <h1 className="page-title">Coupon Management</h1>
                <button onClick={() => setShowForm(true)} className="add-btn">+ Create Coupon</button>
            </div>

            {showForm && (
                <div className="adm-style-3" style={{ maxWidth: '500px', margin: '0 0 40px' }}>
                    <h2 className="adm-style-25">New Coupon</h2>
                    <div className="adm-style-8">
                        <label className="adm-style-9">Coupon Code</label>
                        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="adm-style-10" placeholder="e.g. SAVE20" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="adm-style-13">
                                <option value="percent">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Value</label>
                            <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="adm-style-10" placeholder="0" />
                        </div>
                    </div>
                    <div className="adm-style-8">
                        <label className="adm-style-9">Min Order Amount (₹)</label>
                        <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className="adm-style-10" placeholder="0" />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={save} className="adm-style-15">Save Coupon</button>
                        <button onClick={() => setShowForm(false)} className="adm-style-128">Cancel</button>
                    </div>
                </div>
            )}

            <div className="adm-style-60">
                {coupons.map(c => (
                    <div key={c._id} className="stat-card" style={{ padding: '20px' }}>
                        <div className="adm-style-25" style={{ fontSize: '1.2rem', margin: 0 }}>{c.code}</div>
                        <div style={{ color: '#ff6b35', fontWeight: 700, margin: '5px 0' }}>
                            {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                        </div>
                        <div className="adm-style-23">Min Order: ₹{c.minOrder}</div>
                        <div className="adm-style-23">Used: {c.uses} times</div>
                        <button onClick={() => deleteCoupon(c._id)} className="adm-style-85" style={{ marginTop: '15px', width: '100%' }}>Delete Coupon</button>
                    </div>
                ))}
            </div>
            {coupons.length === 0 && <EmptyState icon="🏷️" msg="No promotional coupons found" />}
        </div>
    );
}

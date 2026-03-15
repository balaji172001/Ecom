import { useState } from "react";
import { API_BASE } from "../../utils/shopConstants";
import { EmptyState } from "./Common";

export default function ProductsPage({ products, setProducts }) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", category: "Sparklers", price: "", mrp: "", stock: "", description: "" });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const CATEGORIES = [
        "Sparklers", "Ground Chakkars", "Flower Pots", "Fountains", "Rockets",
        "Function Shots", "Garlands", "Novelties", "Kids Special",
        "Fancy Fountains", "Multicolour Shots", "Bijili Crackers", "Atom Bombs"
    ];

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const save = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const url = editItem ? `${API_BASE}/api/admin/products/${editItem}` : `${API_BASE}/api/admin/products`;

        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        selectedFiles.forEach(file => formData.append("images", file));

        try {
            const res = await fetch(url, {
                method: editItem ? "PUT" : "POST",
                headers: { Authorization: `Bearer ${token}` }, // Browser sets Content-Type for FormData
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                if (editItem) setProducts(prev => prev.map(p => p.id === editItem ? { ...data, id: data._id || data.id } : p));
                else setProducts(prev => [{ ...data, id: data._id || data.id }, ...prev]);
                setShowForm(false);
                setEditItem(null);
                setSelectedFiles([]);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="adm-style-129">
            <div className="adm-style-54">
                <h1 className="page-title">Product Management</h1>
                <button
                    onClick={() => { setEditItem(null); setForm({ name: "", category: "Sparklers", price: "", mrp: "", stock: "", description: "" }); setSelectedFiles([]); setShowForm(true); }}
                    className="add-btn"
                >
                    + Add New Product
                </button>
            </div>

            {showForm && (
                <div className="adm-style-3" style={{ maxWidth: '700px', margin: '0 0 40px', padding: '30px' }}>
                    <h2 className="adm-style-25">{editItem ? 'Edit Product' : 'Create New Product'}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Product Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="adm-style-10" placeholder="e.g. 10cm Sparklers" />
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="adm-style-13">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Our Price (₹)</label>
                            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="adm-style-10" placeholder="0" />
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">MRP (₹)</label>
                            <input type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} className="adm-style-10" placeholder="0" />
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Stock Quantity</label>
                            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="adm-style-10" placeholder="100" />
                        </div>
                        <div className="adm-style-8">
                            <label className="adm-style-9">Upload Image (Cloudinary)</label>
                            <input type="file" multiple onChange={handleFileChange} className="adm-style-10" accept="image/*" style={{ paddingTop: '8px' }} />
                            {selectedFiles.length > 0 && <div style={{ fontSize: '0.7rem', color: '#ff6b35', marginTop: 5 }}>{selectedFiles.length} file(s) selected</div>}
                        </div>
                    </div>
                    <div className="adm-style-8" style={{ marginTop: 15 }}>
                        <label className="adm-style-9">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="adm-style-10" style={{ minHeight: '80px', fontFamily: 'inherit' }} placeholder="Product details..." />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button onClick={save} disabled={loading} className="adm-style-15" style={{ flex: 1 }}>{loading ? 'Uploading & Saving...' : (editItem ? 'Update' : 'Publish') + ' Product'}</button>
                        <button onClick={() => setShowForm(false)} className="adm-style-128">Cancel</button>
                    </div>
                </div>
            )}

            <div className="adm-style-60">
                {products.map(p => (
                    <div key={p.id} className="stat-card" style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="adm-style-64">
                                {p.images?.length > 0 ? (
                                    <img src={p.images[0]} style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ fontSize: '2rem', textAlign: 'center', lineHeight: '80px' }}>✨</div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="adm-style-65">{p.category}</div>
                                <div className="adm-style-66">{p.name}</div>
                                <div className="adm-style-67">
                                    <span className="adm-style-68">₹{p.price}</span>
                                    {p.mrp > p.price && <span className="adm-style-69">₹{p.mrp}</span>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: p.stock < 10 ? '#ff5252' : '#888' }}>
                                    Stock: {p.stock} units
                                </div>
                            </div>
                        </div>
                        <div className="adm-style-72" style={{ marginTop: '15px' }}>
                            <button onClick={() => { setEditItem(p.id); setForm(p); setShowForm(true); window.scrollTo(0, 0); }} className="adm-style-84" style={{ flex: 1 }}>Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="adm-style-85">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && <EmptyState icon="🧨" msg="No products found in the database" />}
        </div>
    );
}

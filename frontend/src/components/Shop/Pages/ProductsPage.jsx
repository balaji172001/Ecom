import { useState } from "react";
import { CATEGORIES } from "../../../utils/shopConstants";
import { btnStyle } from "../../../utils/shopHelpers";
import ProductCard from "../ProductCard";

export default function ProductsPage({ onAddToCart, onNavigate, products }) {
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

    return (
        <div className="idx-style-81">
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
                <input value={search} onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                }} placeholder="🔍 Search crackers..." className="idx-style-89" />
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
                    return (
                        <button key={c} onClick={() => {
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
                        </button>
                    );
                })}
            </div>

            <p className="idx-style-92">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>

            <div className="idx-style-93">
                {paged.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
            </div>

            {filtered.length === 0 && (
                <div className="idx-style-94">
                    <div className="idx-style-95">🔍</div>
                    <p className="idx-style-96">No products found. Try a different search or category.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="idx-style-97">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ ...btnStyle("ghost"), padding: "7px 14px", fontSize: "0.8rem" }}>
                        ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)} style={{
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
                        </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ ...btnStyle("ghost"), padding: "7px 14px", fontSize: "0.8rem" }}>
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

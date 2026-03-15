import { useState, useEffect } from "react";
import { renderImage, btnStyle } from "../../../utils/shopHelpers";
import { StarRating } from "../Common";
import ProductCard from "../ProductCard";

export default function ProductDetailPage({ productId, onAddToCart, onNavigate, products }) {
    const p = products.find(x => x.id === productId);
    const [qty, setQty] = useState(1);
    const [imgIdx, setImgIdx] = useState(0);

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
        const prevTitle = document.title;
        document.title = `${p.name} – Sri Ram Balaji Agency | Sivakasi Crackers`;
        return () => {
            const el = document.getElementById("product-schema");
            if (el) el.remove();
            document.title = prevTitle;
        };
    }, [p]);

    if (!p) return <div className="idx-style-98">Product not found</div>;
    const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    const discount = Math.round((1 - p.price / p.mrp) * 100);
    const imgs = [p.image, "✨", "🎆"];

    return (
        <div className="idx-style-99">
            <button onClick={() => onNavigate("products")} className="idx-style-100">← Back to Products</button>
            <div className="idx-style-101">
                {/* Images */}
                <div>
                    <div className="idx-style-102">{renderImage(imgs[imgIdx], "idx-style-102-img")}</div>
                    <div className="idx-style-103">
                        {imgs.map((img, i) => (
                            <button key={i} onClick={() => setImgIdx(i)} style={{
                                background: imgIdx === i ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.04)",
                                border: `2px solid ${imgIdx === i ? "#FFD700" : "rgba(255,215,0,0.15)"}`,
                                borderRadius: 10,
                                padding: "8px 14px",
                                cursor: "pointer",
                                fontSize: "1.4rem"
                            }}>
                                {renderImage(img, "idx-style-103-thumb")}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Info */}
                <div>
                    <div className="idx-style-104">{p.category} • {p.unit}</div>
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
                    {/* Add to Cart Actions */}
                    <div className="idx-style-113">
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
                            <button onClick={() => onAddToCart({ ...p, qty })} style={{ ...btnStyle("primary"), flex: 1, padding: "14px" }}>Add to Cart 🛒</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Related Products */}
            <h2 style={{ color: "#FFD700", fontFamily: "Cinzel", marginBottom: "20px" }}>Related Products</h2>
            <div className="idx-style-93">
                {related.map(rp => <ProductCard key={rp.id} p={rp} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
            </div>
        </div>
    );
}

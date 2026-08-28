import React, { useState, useEffect } from "react";
import { qtyBtn, btnStyle, renderImage, StarRating } from "../utils/constants";
import ProductCard from "./ProductCard";

export default function ProductDetailPage({ productId, onAddToCart, onNavigate, products }) {
  const p = products.find((x) => x.id === productId);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  // Inject Product JSON-LD schema for SEO rich results
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

    // Update page title for this product
    const prevTitle = document.title;
    document.title = `${p.name} – Sri Ram Balaji Agency | Sivakasi Crackers`;
    return () => {
      const el = document.getElementById("product-schema");
      if (el) el.remove();
      document.title = prevTitle;
    };
  }, [p]);

  if (!p) return <div className="idx-style-98">Product not found</div>;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const discount = Math.round((1 - p.price / p.mrp) * 100);
  const imgs = [p.image, "✨", "🎆"];

  return (
    <div className="idx-style-99">
      <button onClick={() => onNavigate("products")} className="idx-style-100">
        ← Back to Products
      </button>
      <div className="idx-style-101">
        {/* Images */}
        <div>
          <div className="idx-style-102">{renderImage(imgs[imgIdx], "idx-style-102-img")}</div>
          <div className="idx-style-103">
            {imgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                style={{
                  background: imgIdx === i ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${imgIdx === i ? "#FFD700" : "rgba(255,215,0,0.15)"}`,
                  borderRadius: 10,
                  padding: "8px",
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1.4rem",
                }}
              >
                {renderImage(img, "idx-style-103-thumb")}
              </button>
            ))}
          </div>
        </div>
        {/* Info */}
        <div>
          <div className="idx-style-104">
            {p.category} • {p.unit}
          </div>
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
          {/* Stock */}
          <div className="idx-style-113">
            {p.stock === 0 ? (
              <span className="idx-style-114">● Out of Stock</span>
            ) : p.stock < 10 ? (
              <span className="idx-style-115">● Only {p.stock} left!</span>
            ) : (
              <span className="idx-style-116">● In Stock ({p.stock} available)</span>
            )}
          </div>
          {/* Price Breakup */}
          <div className="idx-style-117">
            <div className="idx-style-118">Price breakup (qty: {qty})</div>
            <div className="idx-style-119">
              <span>Base</span>
              <span>₹{Math.round(p.price / 1.18) * qty}</span>
            </div>
            <div className="idx-style-120">
              <span>GST (18%)</span>
              <span>₹{Math.round((p.price - p.price / 1.18) * qty)}</span>
            </div>
            <div className="idx-style-121">
              <span>Total</span>
              <span>₹{(p.price * qty).toLocaleString("en-IN")}</span>
            </div>
          </div>
          {/* Qty */}
          <div className="idx-style-122">
            <span className="idx-style-123">Qty:</span>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>
              −
            </button>
            <span className="idx-style-124">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} style={qtyBtn}>
              +
            </button>
          </div>
          {/* CTA */}
          <div className="idx-style-126">
            <button
              onClick={() => onAddToCart({ ...p, qty })}
              disabled={p.stock === 0}
              style={{
                ...btnStyle(p.stock === 0 ? "disabled" : "outline"),
                flex: 1,
                padding: "12px",
              }}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => {
                onAddToCart({ ...p, qty });
                onNavigate("cart");
              }}
              disabled={p.stock === 0}
              style={{
                ...btnStyle(p.stock === 0 ? "disabled" : "primary"),
                flex: 1,
                padding: "12px",
              }}
            >
              ⚡ Buy Now
            </button>
          </div>
          <div className="idx-style-127">
            <span>🚀 Free delivery above ₹999</span>
            <span>🔒 Secure payment</span>
            <span>✅ Licensed product</span>
          </div>
        </div>
      </div>
      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="idx-style-128">More from {p.category}</h2>
          <div className="idx-style-129">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} onAddToCart={onAddToCart} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

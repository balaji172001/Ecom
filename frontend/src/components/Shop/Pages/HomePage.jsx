import { useState, useEffect } from "react";
import { REVIEWS, COMBOS } from "../../../utils/shopConstants";
import { btnStyle, cardStyle, sectionStyle } from "../../../utils/shopHelpers";
import { SectionTitle } from "../Common";
import BannerCarousel from "../BannerCarousel";
import ProductCard from "../ProductCard";

export default function HomePage({ products = [], banners = [], onNavigate, onAddToCart }) {
    const [rev, setRev] = useState(0);
    const featured = products.filter(p => p.stock > 0).slice(0, 8);

    useEffect(() => {
        const t = setInterval(() => setRev(r => (r + 1) % REVIEWS.length), 3800);
        return () => clearInterval(t);
    }, []);

    return (
        <div>
            <BannerCarousel banners={banners} />

            {!banners.length && (
                <section className="idx-style-44">
                    <div className="idx-style-45">🪔</div>
                    <div className="idx-style-46">Sri Gopalsamy Presents</div>
                    <h1 className="idx-style-47">
                        Sri Ram Balaji
                        <br />
                        Agency
                    </h1>
                    <p className="idx-style-48">
                        Premium Quality Fireworks • Price List 2025
                    </p>
                    <p className="idx-style-49">
                        329-H/1, Srivilliputtur to Alangulam Road, Sri Venkateswara Nagar
                        <br />
                        Pillaiyarkulam, P. Ramachatrapuram - 626 137, Srivilliputtur (T.K)
                    </p>
                    <p className="idx-style-50">📞 6374 549 935 &nbsp;|&nbsp; 99409 19857</p>
                    <div className="idx-style-51">
                        🎉 Special Offer — Discount UPTO 50% OFF on all products!
                    </div>
                    <div className="idx-style-52">
                        <button onClick={() => onNavigate("products")} style={btnStyle("primary")}>
                            Shop Now 🎆
                        </button>
                        <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
                            View All {products.length} Products →
                        </button>
                    </div>
                    <div className="idx-style-53">
                        {[[`${products.length}+`, "Products"], ["50%", "Max Discount"], ["2025", "Price List"], ["Licensed", "& Certified"]].map(([n, l]) => (
                            <div key={l} className="idx-style-54">
                                <div className="idx-style-55">{n}</div>
                                <div className="idx-style-56">{l}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* COMBO OFFERS */}
            <section style={sectionStyle}>
                <SectionTitle icon="🎁" title="Combo Offers" sub="Best value bundles for your celebration" />
                <div className="idx-style-59">
                    {COMBOS.map(c => {
                        const d = Math.round((1 - c.price / c.mrp) * 100);
                        return (
                            <div key={c.name} style={{
                                ...cardStyle,
                                background: "linear-gradient(135deg,rgba(30,10,0,0.94),rgba(60,20,0,0.9))",
                                border: "1px solid rgba(255,215,0,0.28)",
                                overflow: "hidden",
                                position: "relative"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    fontSize: "5rem",
                                    opacity: 0.08
                                }}>
                                    {c.emoji}
                                </div>
                                <div className="idx-style-60">{c.emoji}</div>
                                <h3 className="idx-style-61">{c.name}</h3>
                                <div className="idx-style-62">
                                    <span className="idx-style-63">₹{c.price}</span>
                                    <span className="idx-style-64">₹{c.mrp}</span>
                                    <span className="idx-style-65">{d}% OFF</span>
                                </div>
                                <ul className="idx-style-66">
                                    {c.items.map(i => <li key={i} className="idx-style-67">✓ {i}</li>)}
                                </ul>
                                <button onClick={() => onNavigate("products")} style={{
                                    ...btnStyle("primary"),
                                    width: "100%",
                                    padding: "9px",
                                    fontSize: "0.8rem"
                                }}>
                                    "Order Now"
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section style={sectionStyle}>
                <SectionTitle icon="⭐" title="Featured Products" sub="Best sellers from Price List 2025" />
                <div className="idx-style-68">
                    {featured.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
                </div>
                <div className="idx-style-69">
                    <button onClick={() => onNavigate("products")} style={btnStyle("outline")}>
                        View All {products.length} Products →
                    </button>
                </div>
            </section>

            {/* SAFETY */}
            <section style={{
                ...sectionStyle,
                background: "rgba(255,50,0,0.05)",
                borderRadius: 20,
                margin: "0 0px 0px",
                width: "100%",
                maxWidth: "unset !important"
            }}>
                <SectionTitle icon="⚠️" title="Safety Instructions" sub="Always follow these guidelines before using crackers" />
                <div className="idx-style-70">
                    {[["🧑‍🦯", "Adult Supervision", "Always have adult supervision"], ["💧", "Keep Water Nearby", "Keep a bucket of water or sand nearby"], ["👃", "Maintain Distance", "Stand 2–3 meters away after lighting"], ["👗", "Wear Cotton", "Avoid synthetic materials near fire"], ["🏠", "Open Areas Only", "Use only in open, clear areas"], ["🚫", "No Relight", "Never relight a dud cracker"]].map(([e, t, d]) => (
                        <div key={t} className="idx-style-71">
                            <div className="idx-style-72">{e}</div>
                            <div className="idx-style-73">{t}</div>
                            <div className="idx-style-74">{d}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* REVIEWS */}
            <section style={sectionStyle}>
                <SectionTitle icon="💬" title="Customer Reviews" />
                <div className="idx-style-75">
                    {REVIEWS.map((r, i) => (
                        <div key={i} style={{
                            display: i === rev ? "block" : "none",
                            background: "rgba(255,215,0,0.05)",
                            border: "1px solid rgba(255,215,0,0.18)",
                            borderRadius: 16,
                            padding: 28,
                            textAlign: "center",
                            animation: "fadeIn 0.5s ease"
                        }}>
                            <div className="idx-style-76">{"⭐".repeat(r.rating)}</div>
                            <p className="idx-style-77">"{r.text}"</p>
                            <div className="idx-style-78">{r.name}</div>
                            <div className="idx-style-79">{r.city}</div>
                        </div>
                    ))}
                    <div className="idx-style-80">
                        {REVIEWS.map((_, i) => (
                            <button key={i} onClick={() => setRev(i)} style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                border: "none",
                                background: i === rev ? "#FFD700" : "#444",
                                cursor: "pointer",
                                padding: 0
                            }} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

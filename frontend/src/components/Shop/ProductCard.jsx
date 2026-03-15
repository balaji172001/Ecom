import { renderImage, cardStyle, btnStyle } from "../../utils/shopHelpers";
import { StarRating } from "./Common";

export default function ProductCard({ p, onAddToCart, onNavigate }) {
    const discount = Math.round((1 - p.price / p.mrp) * 100);
    return (
        <div
            onClick={() => onNavigate("product", p.id)}
            style={{
                ...cardStyle,
                cursor: "pointer",
                transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(255,215,0,0.45)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,215,0,0.15)";
            }}
        >
            <div className="idx-style-34">{renderImage(p.image, "idx-style-34-img")}</div>
            {p.stock === 0 && <div className="idx-style-35">OUT OF STOCK</div>}
            {p.stock > 0 && p.stock < 10 && <div className="idx-style-36">Only {p.stock} left!</div>}
            <div className="idx-style-37">
                {p.category} • {p.unit}
            </div>
            <h3 className="idx-style-38">{p.name}</h3>
            <div className="idx-style-39">
                <StarRating rating={p.rating} />
            </div>
            <div className="idx-style-40">
                <span className="idx-style-41">₹{p.price}</span>
                <span className="idx-style-42">₹{p.mrp}</span>
                <span className="idx-style-43">{discount}% OFF</span>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(p);
                }}
                disabled={p.stock === 0}
                style={{
                    ...btnStyle(p.stock === 0 ? "disabled" : "primary"),
                    width: "100%",
                    padding: "8px",
                    fontSize: "0.8rem",
                }}
            >
                {p.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
            </button>
        </div>
    );
}

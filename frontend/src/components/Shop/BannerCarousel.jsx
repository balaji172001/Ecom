import { useState, useEffect } from "react";
import { API_BASE } from "../../utils/shopConstants";

export default function BannerCarousel({ banners }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!banners.length) return;
        const t = setInterval(() => {
            setActive(prev => (prev + 1) % banners.length);
        }, 4500);
        return () => clearInterval(t);
    }, [banners.length]);

    if (!banners.length) return null;

    return (
        <div className="banner-slider">
            {banners.map((b, i) => (
                <div
                    key={b._id || i}
                    className={`banner-slide ${i === active ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${b.image && b.image.startsWith("/") ? API_BASE + b.image : b.image})` }}
                >
                    <div className="banner-overlay" />
                    <div className="banner-content">
                        <span className="banner-emoji">{b.emoji}</span>
                        <div className="banner-text">
                            <h2 className="banner-title">{b.title}</h2>
                            <p className="banner-subtitle">{b.subtitle}</p>
                        </div>
                        <button className="banner-btn" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                            Explore Now 🎆
                        </button>
                    </div>
                </div>
            ))}
            <div className="banner-dots">
                {banners.map((_, i) => (
                    <div
                        key={i}
                        className={`banner-dot ${i === active ? 'active' : ''}`}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>
        </div>
    );
}

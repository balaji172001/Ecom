import { useState, useEffect } from "react";

export default function Walkthrough({ trigger }) {
    const [step, setStep] = useState(0);
    const [show, setShow] = useState(false);

    const steps = [
        { title: "Welcome to Sri Ram Balaji", text: "Premium Quality Sivakasi Fireworks delivered to your doorstep. Experience the magic of Diwali 2025 with our authentic crackers!", icon: "🎆", btn: "Next →" },
        { title: "Explore Price List 2025", text: "Browse over 70+ varieties of crackers. From Sparklers to Multi-Shot Fancy items, we have everything you need for a grand celebration.", icon: "📜", btn: "Next →" },
        { title: "Massive Discounts", text: "Enjoy up to 50% discount on all products. Quality fireworks at the most affordable prices in the market!", icon: "🏷️", btn: "Next →" },
        { title: "Easy Ordering", text: "Simply add items to your cart, login securely, and place your order. We support Cash on Delivery (COD) for your convenience.", icon: "🛒", btn: "Next →" },
        { title: "WhatsApp Support", text: "Need help? Long-press the WhatsApp icon or chat with us directly for custom orders and bulk inquiries.", icon: "💬", btn: "Get Started! 🚀" }
    ];

    useEffect(() => {
        const shown = localStorage.getItem("walkthrough_shown");
        if (!shown && trigger) {
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [trigger]);

    const next = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            setShow(false);
            localStorage.setItem("walkthrough_shown", "true");
        }
    };

    const skip = () => {
        setShow(false);
        localStorage.setItem("walkthrough_shown", "true");
    };

    if (!show) return null;

    return (
        <div className="walkthrough-overlay">
            <div className="walkthrough-card">
                <button className="walkthrough-skip" onClick={skip}>Skip</button>
                <div className="walkthrough-icon">{steps[step].icon}</div>
                <div className="walkthrough-progress">
                    {steps.map((_, i) => (
                        <div key={i} className={`walkthrough-dot ${i === step ? 'active' : ''}`} />
                    ))}
                </div>
                <h2 className="walkthrough-title">{steps[step].title}</h2>
                <p className="walkthrough-text">{steps[step].text}</p>
                <button className="walkthrough-next" onClick={next}>
                    {steps[step].btn}
                </button>
            </div>
        </div>
    );
}

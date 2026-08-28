import React, { useState, useEffect } from "react";
import { Flame, ShoppingBag, ShoppingCart, Send } from "lucide-react";

export default function Walkthrough() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Flame size={48} color="#FFD700" />,
      title: "Welcome to Sri Ram Balaji!",
      text: "Premium Quality Fireworks for your grand celebrations. Explore our Price List 2025!"
    },
    {
      icon: <ShoppingBag size={48} color="#FFD700" />,
      title: "Easy Browsing",
      text: "Filter by categories and search for your favorite crackers easily."
    },
    {
      icon: <ShoppingCart size={48} color="#FFD700" />,
      title: "Smart Shopping",
      text: "Add items to your cart and see the best discounts applied instantly."
    },
    {
      icon: <Send size={48} color="#FFD700" />,
      title: "Order on WhatsApp",
      text: "Finalize your order and send it directly via WhatsApp for quick confirmation!"
    }
  ];

  useEffect(() => {
    const shown = localStorage.getItem("walkthrough_shown");
    if (!shown) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const close = () => {
    setShow(false);
    localStorage.setItem("walkthrough_shown", "true");
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  if (!show) return null;

  return (
    <div className="walkthrough-overlay">
      <div className="walkthrough-card">
        <button className="walkthrough-skip" onClick={close}>Skip</button>
        <div className="walkthrough-content">
          <div className="walkthrough-emoji">{steps[step].icon}</div>
          <h2 className="walkthrough-title">{steps[step].title}</h2>
          <p className="walkthrough-text">{steps[step].text}</p>
        </div>

        <div className="walkthrough-footer">
          <div className="walkthrough-dots">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`walkthrough-dot ${i === step ? "active" : ""}`}
              />
            ))}
          </div>
          <button className="walkthrough-next" onClick={next}>
            {step === steps.length - 1 ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

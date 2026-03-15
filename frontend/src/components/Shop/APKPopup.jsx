import { useState, useEffect } from "react";

export default function APKPopup({ onDismiss }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const shown = sessionStorage.getItem("apk_popup_shown");
        if (!shown) {
            const timer = setTimeout(() => setShow(true), 500);
            return () => clearTimeout(timer);
        } else {
            if (onDismiss) onDismiss();
        }
    }, [onDismiss]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);

    const close = () => {
        setShow(false);
        sessionStorage.setItem("apk_popup_shown", "true");
        if (onDismiss) onDismiss();
    };

    if (!show) return null;

    return (
        <div className="apk-popup-overlay">
            <div className="apk-popup-card">
                <button className="apk-popup-close" onClick={close}>✕</button>
                <div className="apk-icon">📱</div>
                <h2 className="apk-popup-title">Download App</h2>
                <p className="apk-popup-text">
                    Experience Sri Ram Balaji Agency on your phone. If APK needed, please download only for Android only.
                </p>
                <a href="/app-debug.apk" download className="apk-download-btn" onClick={close}>
                    Download APK
                </a>
                <div className="apk-note">⚠️ Supports Android Only</div>
            </div>
        </div>
    );
}

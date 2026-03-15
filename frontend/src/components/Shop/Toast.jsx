import { useEffect } from "react";

export default function Toast({ msg, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 2500);
        return () => clearTimeout(t);
    }, [onClose]);
    return <div className="idx-style-8">{msg}</div>;
}

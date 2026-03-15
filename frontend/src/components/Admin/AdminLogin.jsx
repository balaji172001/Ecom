import { useState } from "react";
import { API_BASE } from "../../utils/shopConstants";

export default function AdminLogin({ onLogin }) {
    const [creds, setCreds] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/auth/login-admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: creds.username, password: creds.password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                onLogin();
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError(err.message || "Network error");
        }
        setLoading(false);
    };

    return (
        <div className="adm-style-1">
            <div className="adm-style-2" />
            <div className="adm-style-3">
                <div className="adm-style-4">
                    <div className="adm-style-5">🔐</div>
                    <h1 className="adm-style-6">Admin Portal</h1>
                    <p className="adm-style-7">Sri Ram Ballaji Agency Management</p>
                </div>
                <div className="adm-style-8">
                    <label className="adm-style-9">Username</label>
                    <input value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })} placeholder="Enter username" onKeyDown={e => e.key === "Enter" && handleLogin()} className="adm-style-10" />
                </div>
                <div className="adm-style-11">
                    <label className="adm-style-12">Password</label>
                    <input type="password" value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} placeholder="Enter password" onKeyDown={e => e.key === "Enter" && handleLogin()} className="adm-style-13" />
                </div>
                {error && <div className="adm-style-14">{error}</div>}
                <button onClick={handleLogin} disabled={loading} className="adm-style-15">{loading ? "Authenticating..." : "Sign In to Dashboard"}</button>
            </div>
        </div>
    );
}

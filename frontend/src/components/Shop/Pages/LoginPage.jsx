import { useState } from "react";
import { API_BASE } from "../../../utils/shopConstants";
import { btnStyle, inputStyle } from "../../../utils/shopHelpers";

export default function LoginPage({ onLogin, showToast }) {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", mobile: "", address: "", city: "", pincode: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = mode === "login" ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
        const cleanedForm = {
            ...form,
            mobile: form.mobile.trim().replace(/\s+/g, ""),
            email: form.email?.trim().toLowerCase(),
            name: form.name?.trim()
        };
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedForm)
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data.user, data.token);
                showToast(`Welcome back, ${data.user.name || 'User'}!`);
            } else {
                showToast(data.error || "Authentication failed");
            }
        } catch (err) {
            showToast("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="idx-style-207">
            <div style={{ maxWidth: 420, width: "100%", background: "rgba(20,8,0,0.92)", padding: '40px 30px', borderRadius: 24, border: '1px solid rgba(255,215,0,0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                <div className="idx-style-208">
                    <div className="idx-style-209">{mode === 'login' ? '🔐' : '✍️'}</div>
                    <h2 className="idx-style-210">{mode === 'login' ? 'Member Login' : 'Create Account'}</h2>
                    <p className="idx-style-211">{mode === 'login' ? 'Enter your mobile number to sign in' : 'Quick registration for your orders'}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {mode === 'login' ? (
                        <div className="idx-style-212">
                            <label className="idx-style-213">Mobile Number</label>
                            <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit number" required style={inputStyle} />
                        </div>
                    ) : (
                        <>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Full Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required style={inputStyle} />
                            </div>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Mobile Number</label>
                                <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit number" required style={inputStyle} />
                            </div>
                            <div className="idx-style-212">
                                <label className="idx-style-213">Email Address (Optional)</label>
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={inputStyle} />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} style={{ ...btnStyle("primary"), padding: '12px', fontSize: '1rem', marginTop: '10px' }}>
                        {loading ? "Processing..." : mode === "login" ? "Sign In" : "Register Now"}
                    </button>
                </form>

                <div className="idx-style-220">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <span className="idx-style-221" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                        {mode === 'login' ? 'Create Account' : 'Back to Login'}
                    </span>
                </div>
            </div>
        </div>
    );
}

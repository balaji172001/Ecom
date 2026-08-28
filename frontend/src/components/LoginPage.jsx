import React, { useState } from "react";
import { API_BASE, cardStyle, inputStyle, btnStyle } from "../utils/constants";

export default function LoginPage({ onLogin, showToast }) {
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isReg && !form.name.trim()) return showToast("Name is required");
    if (!form.mobile.trim()) return showToast("Mobile number is required");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return showToast("Enter a valid 10-digit mobile number");

    setLoading(true);
    try {
      const endpoint = isReg ? "/api/auth/register" : "/api/auth/login-shop";
      const payload = isReg ? { ...form } : { mobile: form.mobile };
      if (isReg && !payload.email) delete payload.email;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isReg ? "Registration failed" : "Login failed"));

      onLogin(data.user, data.token);
      showToast(isReg ? "Account created successfully!" : "Logged in successfully!");
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="idx-style-207">
      <div style={{ ...cardStyle, maxWidth: 400, width: "100%", border: "1px solid rgba(255,215,0,0.28)" }}>
        <div className="idx-style-208">
          <div className="idx-style-209">🪔</div>
          <h2 className="idx-style-210">{isReg ? "Create Account" : "Welcome Back"}</h2>
          <p className="idx-style-211">Sri Ram Balaji Agency</p>
        </div>
        {isReg && (
          <div className="idx-style-212">
            <label className="idx-style-213">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
        )}
        <div className="idx-style-214">
          <label className="idx-style-215">Mobile Number</label>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
            placeholder="Enter your 10-digit mobile"
            style={inputStyle}
          />
        </div>
        {isReg && (
          <div className="idx-style-212">
            <label className="idx-style-213">Email (Optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
        )}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...btnStyle("primary"),
            width: "100%",
            padding: "12px",
            fontSize: "0.92rem",
            marginTop: 20,
          }}
        >
          {loading ? "Please wait..." : isReg ? "Create Account →" : "Sign In →"}
        </button>
        <div className="idx-style-220" style={{ marginTop: 20 }}>
          {isReg ? "Have account? " : " New here? "}
          <span onClick={() => setIsReg((r) => !r)} className="idx-style-221">
            {isReg ? " Sign In" : " Register Now"}
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import { pageTitle, cardStyle, inputStyle } from "../utils/adminConstants";
import EmptyState from "./EmptyState";

export default function AdminUsersPage({ users }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div>
      <h1 style={pageTitle}>User Management</h1>
      <div className="adm-style-40" style={{ marginTop: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#666" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or mobile..."
            style={{ ...inputStyle, paddingLeft: 40 }}
          />
        </div>
      </div>

      <div className="adm-style-42">
        <div style={{ ...cardStyle, padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", color: "#fff" }}>
            <thead style={{ background: "rgba(255,215,0,0.1)", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>NAME</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>MOBILE</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>SAVED ADDRESS</th>
                <th style={{ padding: "12px 15px", fontSize: "0.8rem" }}>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,215,0,0.05)" }}>
                  <td style={{ padding: "12px 15px", fontSize: "0.85rem", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "12px 15px", fontSize: "0.85rem", color: "#FFD700" }}>{u.mobile}</td>
                  <td style={{ padding: "12px 15px", fontSize: "0.8rem", color: "#aaa" }}>
                    {u.address ? (
                      <div>
                        {u.address}, {u.city}
                        <br />
                        {u.state} - {u.pincode}
                      </div>
                    ) : (
                      <span style={{ fontStyle: "italic", opacity: 0.5 }}>No address saved</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 15px", fontSize: "0.8rem", color: "#888" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length === 0 && <EmptyState icon={<Users size={48} />} msg="No users found" />}
    </div>
  );
}

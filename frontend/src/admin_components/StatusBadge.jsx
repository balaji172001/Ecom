import React from "react";
import { STATUS_COLORS } from "../utils/adminConstants";

export default function StatusBadge({ status, small }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        padding: small ? "2px 8px" : "4px 12px",
        borderRadius: 20,
        fontSize: small ? "0.68rem" : "0.75rem",
        fontWeight: 600,
      }}
    >
      {typeof status === "object" ? status.status || JSON.stringify(status) : status}
    </span>
  );
}

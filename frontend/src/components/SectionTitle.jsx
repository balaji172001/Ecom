import React from "react";

export default function SectionTitle({ icon, title, sub }) {
  return (
    <div className="idx-style-4">
      <div className="idx-style-5">{icon}</div>
      <h2 className="idx-style-6">{title}</h2>
      {sub && <p className="idx-style-7">{sub}</p>}
    </div>
  );
}

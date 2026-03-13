"use client";

function Badge({ color, children }) {
  return <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 100, background: color + "18", color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", border: `1px solid ${color}30` }}>{children}</span>;
}

export default Badge;

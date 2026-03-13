"use client";

import { ACCENT, F } from "../../lib/constants";

function Pill({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className="pill-hover" style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: active ? 700 : 500, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#374151", border: active ? `2px solid ${ACCENT}` : "1.5px solid #E0DDD5", whiteSpace: "nowrap", minHeight: 44 }}>{children}</button>;
}

export default Pill;

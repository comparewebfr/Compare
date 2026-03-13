"use client";

function Icon({ name, s = 18, color = "#111", style = {} }) {
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "block", ...style }, "aria-hidden": true, focusable: false };
  switch (name) {
    case "check": return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "tool": return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.7-2.7 2-2z" /></svg>;
    case "recycle": return <svg {...common}><path d="M7 19h10" /><path d="M7 19l-2-3" /><path d="M17 19l2-3" /><path d="M7 19l3-5" /><path d="M17 19l-3-5" /><path d="M9 9l3-5 3 5" /><path d="M12 4v5" /></svg>;
    case "swap": return <svg {...common}><path d="M7 7h14l-3-3" /><path d="M17 17H3l3 3" /></svg>;
    case "cart": return <svg {...common}><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6l-2-2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>;
    case "chart": return <svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></svg>;
    case "money": return <svg {...common}><path d="M3 7h18v10H3z" /><path d="M7 7v10" /><path d="M17 7v10" /><circle cx="12" cy="12" r="2" /></svg>;
    case "leaf": return <svg {...common}><path d="M21 3c-8 1-14 7-15 15" /><path d="M6 18c6 0 10-4 10-10" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>;
    case "warn": return <svg {...common}><path d="M12 3 2 21h20z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></svg>;
    case "help": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;
    case "shield": return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" /></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M3 11h18" /></svg>;
    case "pin": return <svg {...common}><path d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10z" /><circle cx="12" cy="11" r="2" /></svg>;
    case "chat": return <svg {...common}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>;
    case "book": return <svg {...common}><path d="M4 19a2 2 0 0 1 2-2h14" /><path d="M6 3h14v18H6a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2z" /></svg>;
    case "play": return <svg {...common}><path d="M8 5v14l11-7z" /></svg>;
    case "x": return <svg {...common}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>;
    case "smartphone": return <svg {...common}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></svg>;
    case "tablet": return <svg {...common}><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M11 17h2" /></svg>;
    case "laptop": return <svg {...common}><path d="M4 6h16v10H4z" /><path d="M2 18h20" /></svg>;
    case "washer": return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 7h.01" /><path d="M12 7h.01" /></svg>;
    case "tv": return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M8 20h8" /></svg>;
    case "gamepad": return <svg {...common}><path d="M8 14H6a3 3 0 0 1-3-3 4 4 0 0 1 4-4h10a4 4 0 0 1 4 4 3 3 0 0 1-3 3h-2" /><path d="M7 12h2" /><path d="M8 11v2" /><path d="M16 11h.01" /><path d="M18 13h.01" /></svg>;
    case "headphones": return <svg {...common}><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v5a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2" /><path d="M20 13v5a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2" /></svg>;
    case "camera": return <svg {...common}><path d="M4 7h4l2-2h4l2 2h4v12H4z" /><circle cx="12" cy="13" r="3" /></svg>;
    case "shower": return <svg {...common}><path d="M7 7a5 5 0 0 1 10 0" /><path d="M17 7H7" /><path d="M12 7v2" /><path d="M9 12h.01" /><path d="M12 13h.01" /><path d="M15 12h.01" /><path d="M10 16h.01" /><path d="M14 16h.01" /></svg>;
    case "flame": return <svg {...common}><path d="M12 3s-3 3-3 7a3 3 0 0 0 6 0c0-4-3-7-3-7z" /><path d="M8 14a4 4 0 0 0 8 0" /></svg>;
    case "kitchen": return <svg {...common}><path d="M6 3v8" /><path d="M10 3v8" /><path d="M6 7h4" /><path d="M14 3v6a3 3 0 0 0 6 0V3" /><path d="M4 21h16" /></svg>;
    case "home": return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 10v11h14V10" /></svg>;
    case "sofa": return <svg {...common}><path d="M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M4 12h16v5H4z" /><path d="M6 17v2" /><path d="M18 17v2" /></svg>;
    case "bike": return <svg {...common}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-7h4l4 7" /><path d="M10 10l-2-3h4" /></svg>;
    case "watch": return <svg {...common}><rect x="7" y="6" width="10" height="12" rx="2" /><path d="M9 6V4h6v2" /><path d="M9 18v2h6v-2" /><path d="M12 10v3l2 1" /></svg>;
    default: return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /></svg>;
  }
}

export default Icon;

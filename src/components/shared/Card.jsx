"use client";

function Card({ children, onClick, style = {}, as: Tag = "div", ...rest }) {
  const baseStyle = { background: "#fff", border: "1px solid #E5E3DE", borderRadius: 12, cursor: onClick ? "pointer" : "default", ...style };
  if (onClick && Tag === "div") {
    return <button type="button" onClick={onClick} className="card-hover" style={{ ...baseStyle, width: "100%", textAlign: "left", font: "inherit" }} {...rest}>{children}</button>;
  }
  return <Tag onClick={onClick} className={onClick ? "card-hover" : ""} style={baseStyle} {...rest}>{children}</Tag>;
}

export default Card;

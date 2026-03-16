"use client";

import Image from "next/image";

function Logo({ s = 32, priority = false }) {
  return <Image src="/logo.webp" alt="Compare." width={s} height={s} sizes={`${s}px`} priority={priority} style={{ width: s, height: s, objectFit: "contain", borderRadius: "50%" }} />;
}

export default Logo;

import * as React from "react";

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="ESG Lens Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  )
}


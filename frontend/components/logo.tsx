interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Magnifying glass handle */}
      <path
        d="M26.7071 25.2929C27.0976 25.6834 27.0976 26.3166 26.7071 26.7071C26.3166 27.0976 25.6834 27.0976 25.2929 26.7071L21.2929 22.7071C20.9024 22.3166 20.9024 21.6834 21.2929 21.2929C21.6834 20.9024 22.3166 20.9024 22.7071 21.2929L26.7071 25.2929Z"
        fill="#6366F1"
      />

      {/* Magnifying glass circle */}
      <circle cx="14" cy="14" r="9" stroke="#6366F1" strokeWidth="2.5" fill="white" />

      {/* Leaf */}
      <path
        d="M17 11C15.5 9.5 13.5 9.5 12 10C12 11.5 12 14.5 14 16.5C16 18.5 19 18.5 20.5 18.5C21 17 21 15 19.5 13.5L17 11Z"
        fill="#22C55E"
      />

      {/* Leaf stem */}
      <path d="M14 16.5L11 19.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}


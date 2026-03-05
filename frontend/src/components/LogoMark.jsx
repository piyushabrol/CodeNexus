function LogoMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-label="CodeNexus logo"
    >
      {/* outer ring */}
      <path
        d="M32 6C18.2 6 7 17.2 7 31s11.2 25 25 25 25-11.2 25-25S45.8 6 32 6Z"
        stroke="#22c55e"
        strokeWidth="4"
        opacity="0.9"
      />
      {/* nexus slash */}
      <path
        d="M20 42L44 18"
        stroke="#22c55e"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* inner dot */}
      <circle cx="32" cy="32" r="6" fill="#22c55e" />
    </svg>
  );
}

export default LogoMark;
import React from "react";

// GF monogram — refined serif inspired by brand sheet
export const GFMonogram = ({ className = "", size = 40, color = "currentColor" }) => (
  <svg
    viewBox="0 0 80 80"
    width={size}
    height={size}
    className={className}
    aria-label="Garment Foundry monogram"
    role="img"
  >
    {/* Stitched arc */}
    <path
      d="M14,16 Q40,4 66,16"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="2 2"
      fill="none"
      opacity="0.7"
    />
    {/* G */}
    <text
      x="6"
      y="58"
      fontFamily="Cinzel, serif"
      fontWeight="500"
      fontSize="48"
      fill={color}
    >
      G
    </text>
    {/* F */}
    <text
      x="40"
      y="62"
      fontFamily="Cinzel, serif"
      fontWeight="500"
      fontSize="48"
      fill={color}
    >
      F
    </text>
    {/* Diamond accent dot */}
    <rect x="64" y="60" width="4" height="4" transform="rotate(45 66 62)" fill={color} />
  </svg>
);

export default GFMonogram;

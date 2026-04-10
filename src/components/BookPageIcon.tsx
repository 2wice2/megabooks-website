"use client";

/**
 * Open book icon with fanned pages — the direction side is highlighted
 * with the accent color to indicate page turn direction.
 */
export default function BookPageIcon({
  direction,
  color = "#e60000",
}: {
  direction: "prev" | "next";
  color?: string;
}) {
  const isNext = direction === "next";
  const dimColor = "rgba(255,255,255,0.15)";

  return (
    <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left pages */}
      <g opacity={isNext ? 0.4 : 1}>
        {/* Outer page */}
        <path
          d="M20 32 C14 33 8 32 4 30 L2 14 C6 16 10 17 14 16.5 L16 27 C17 29 18 30 20 31Z"
          fill={isNext ? dimColor : color}
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        {/* Middle page */}
        <path
          d="M20 29 C15 29 11 27 8 25 L5 11 C8 13.5 12 15 15 14.5 L17 24 C18 26 19 27 20 28Z"
          fill={isNext ? dimColor : color}
          fillOpacity="0.7"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        {/* Inner page */}
        <path
          d="M20 26 C17 26 14 24 11 21 L9 9 C12 11.5 15 12.5 17 12 L18 21 C19 23 19.5 24 20 25Z"
          fill={isNext ? dimColor : color}
          fillOpacity="0.45"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
      </g>

      {/* Right pages (mirrored) */}
      <g opacity={isNext ? 1 : 0.4}>
        {/* Outer page */}
        <path
          d="M20 32 C26 33 32 32 36 30 L38 14 C34 16 30 17 26 16.5 L24 27 C23 29 22 30 20 31Z"
          fill={isNext ? color : dimColor}
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        {/* Middle page */}
        <path
          d="M20 29 C25 29 29 27 32 25 L35 11 C32 13.5 28 15 25 14.5 L23 24 C22 26 21 27 20 28Z"
          fill={isNext ? color : dimColor}
          fillOpacity="0.7"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
        {/* Inner page */}
        <path
          d="M20 26 C23 26 26 24 29 21 L31 9 C28 11.5 25 12.5 23 12 L22 21 C21 23 20.5 24 20 25Z"
          fill={isNext ? color : dimColor}
          fillOpacity="0.45"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.4"
        />
      </g>

      {/* Spine */}
      <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

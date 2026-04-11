"use client";

export default function FloorPlanPage() {
  /* ── shelf style shorthand ─────────────────────────────────────── */
  const w = { stroke: "rgba(255,255,255,0.5)", strokeWidth: 20, fill: "rgba(255,255,255,0.06)" };
  const div = { stroke: "rgba(255,255,255,0.5)", strokeWidth: 10, fill: "none" };

  /* ── center-aisle bay divider x positions ──────────────────────── */
  const aisleXs = [200, 1362.5, 2525, 3687.5, 4850, 6012.5, 7175, 8337.5, 9500];

  /* ── top-wall group 1 dividers (y 11400-11600) ─────────────────── */
  const topG1 = [14658, 15608, 16718, 17828, 18938, 20048];

  /* ── top-wall group 2 dividers (y 11260-11600) ─────────────────── */
  const topG2 = [21400, 22480, 23560, 24640, 25720];

  return (
    <section className="flex flex-col items-center px-4 py-12 min-h-screen" style={{ background: "var(--color-dark)" }}>
      <h1
        className="text-3xl md:text-4xl mb-8 tracking-wide"
        style={{ fontFamily: "var(--font-brand)", color: "var(--color-brand)" }}
      >
        MegaBooks Floor Plan
      </h1>

      <div className="w-full" style={{ maxWidth: 900, perspective: 1800 }}>
        <svg
          viewBox="0 0 27200 11600"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto floorplan-rotate"
          style={{ display: "block" }}
        >
          <g transform="scale(1,-1) translate(0,-11600)">

            {/* ══════ OUTER WALLS ══════ */}
            <rect x={0} y={0} width={27200} height={11600} stroke="white" strokeWidth={40} fill="none" />

            {/* ══════ BOTTOM-FRONT SHELVES (y≈0..200) ══════ */}
            <rect x={0} y={0} width={1300} height={200} {...w} />
            <rect x={1300} y={0} width={1500} height={100} {...w} />
            <rect x={2855} y={0} width={1100} height={200} {...w} />
            <rect x={3990} y={0} width={1100} height={200} {...w} />
            <rect x={9858.5} y={0} width={10800} height={200} {...w} />
            <rect x={21600} y={-2.5} width={600} height={200} {...w} />
            <rect x={22200} y={0} width={571.4} height={197.5} {...w} />
            <rect x={22771.4} y={0} width={600} height={197.5} {...w} />
            <rect x={23428.7} y={0} width={1110} height={200} {...w} />
            <rect x={24631.8} y={0} width={1110} height={200} {...w} />
            <rect x={25741.8} y={0} width={1110} height={200} {...w} />

            {/* ══════ LEFT-WALL SHELVES (x≈0..200) ══════ */}
            <rect x={0} y={200} width={200} height={820} {...w} />
            <rect x={0} y={1020} width={200} height={1200} {...w} />
            <rect x={0} y={2220} width={200} height={1200} {...w} />

            {/* ══════ LONG CENTER AISLE (y=3420..3620) ══════ */}
            <rect x={200} y={3420} width={9300} height={200} {...w} />
            {/* bay dividers */}
            {aisleXs.map((x) => (
              <line key={`ad-${x}`} x1={x} y1={3420} x2={x} y2={3620} {...div} />
            ))}

            {/* ══════ TALL RIGHT-AISLE UNIT (x=9300..9500) ══════ */}
            <rect x={9300} y={3620} width={200} height={1167} {...w} />
            <rect x={9300} y={4787} width={200} height={1167} {...w} />
            <rect x={9300} y={5954} width={200} height={1167} {...w} />
            <rect x={9300} y={7121} width={200} height={1500} {...w} />
            {/* horizontal dividers between segments */}
            <line x1={9300} y1={4787} x2={9500} y2={4787} {...div} />
            <line x1={9300} y1={5954} x2={9500} y2={5954} {...div} />
            <line x1={9300} y1={7121} x2={9500} y2={7121} {...div} />

            {/* ══════ TALL LEFT UNIT (x=5240..5740) ══════ */}
            <rect x={5240} y={0} width={500} height={1322} {...w} />

            {/* ══════ CENTER TABLE ══════ */}
            <rect x={5740} y={1350} width={3600} height={600} {...w} />

            {/* ══════ FRONT SHELF BAYS (x=2100..5700, y=1550..1950) ══════ */}
            {/* top row y=1750..1950 */}
            <rect x={2100} y={1750} width={1200} height={200} {...w} />
            <rect x={3300} y={1750} width={1200} height={200} {...w} />
            <rect x={4500} y={1750} width={1200} height={200} {...w} />
            {/* bottom row y=1550..1750 */}
            <rect x={2100} y={1550} width={1200} height={200} {...w} />
            <rect x={3300} y={1550} width={1200} height={200} {...w} />
            <rect x={4500} y={1550} width={1200} height={200} {...w} />
            {/* vertical dividers */}
            {[2100, 3300, 4500, 5700].map((x) => (
              <line key={`fb-${x}`} x1={x} y1={1550} x2={x} y2={1950} {...div} />
            ))}

            {/* ══════ 5 PARALLEL HORIZONTAL ROWS (x=11000..18600) ══════ */}
            <rect x={11000} y={1530} width={7600} height={470} {...w} />
            <rect x={11000} y={3000} width={7600} height={470} {...w} />
            <rect x={11000} y={4470} width={7600} height={470} {...w} />
            <rect x={11000} y={5940} width={7600} height={470} {...w} />
            <rect x={11000} y={7600} width={7600} height={470} {...w} />

            {/* ══════ TALL VERTICAL UNIT (x=21400..21600) ══════ */}
            <rect x={21400} y={0} width={200} height={1487.5} {...w} />
            <rect x={21400} y={1487.5} width={200} height={1000} {...w} />
            <line x1={21400} y1={1487.5} x2={21600} y2={1487.5} {...div} />

            {/* ══════ RIGHT-WALL SHELVES (x=27000..27200) ══════ */}
            <rect x={27000} y={818} width={200} height={1120} {...w} />
            <rect x={27000} y={1996} width={200} height={1100} {...w} />
            <rect x={27000} y={3150} width={200} height={2350} {...w} />
            <rect x={27000} y={5500} width={200} height={6100} {...w} />

            {/* ══════ WIDE RIGHT-WALL SHELF ══════ */}
            <rect x={26530} y={5780} width={470} height={5820} {...w} />

            {/* ══════ TOP-WALL SHELVES GROUP 1 (y=11400..11600) ══════ */}
            {topG1.map((x, i) => {
              const next = topG1[i + 1];
              if (next === undefined) return null;
              return <rect key={`tg1-${x}`} x={x} y={11400} width={next - x} height={200} {...w} />;
            })}
            {/* dividers */}
            {topG1.map((x) => (
              <line key={`tg1d-${x}`} x1={x} y1={11400} x2={x} y2={11600} {...div} />
            ))}

            {/* ══════ TOP-WALL SHELVES GROUP 2 (y=11260..11600) ══════ */}
            {topG2.map((x, i) => {
              const next = topG2[i + 1];
              if (next === undefined) return null;
              return <rect key={`tg2-${x}`} x={x} y={11260} width={next - x} height={340} {...w} />;
            })}
            {/* dividers */}
            {topG2.map((x) => (
              <line key={`tg2d-${x}`} x1={x} y1={11260} x2={x} y2={11600} {...div} />
            ))}

            {/* ══════ LEFT-TOP VERTICAL SHELF ══════ */}
            <rect x={11500} y={9100} width={200} height={2500} {...w} />

            {/* ══════ BOTTOM-RIGHT HORIZONTAL SHELVES ══════ */}
            <rect x={9500} y={8621} width={1100} height={200} {...w} />
            <rect x={10600} y={8621} width={1100} height={200} {...w} />
            <line x1={10600} y1={8621} x2={10600} y2={8821} {...div} />

          </g>
        </svg>
      </div>

      {/* ── keyframes injected once ── */}
      <style>{`
        .floorplan-rotate {
          animation: floorplan-wobble 20s ease-in-out infinite alternate;
          transform-style: preserve-3d;
        }
        .floorplan-rotate:hover {
          animation-play-state: paused;
        }
        @keyframes floorplan-wobble {
          0%   { transform: rotateX(15deg) rotateY(-5deg); }
          100% { transform: rotateX(15deg) rotateY(5deg); }
        }
      `}</style>
    </section>
  );
}

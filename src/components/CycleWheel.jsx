import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// WHEEL STYLE CONFIG
// ─────────────────────────────────────────────────────────────
const WHEEL = {
  labelFontFamily: "Flama, sans-serif",
  labelFontSize: 15,
  labelSubFontSize: 13,
  labelColor: "var(--color-museum-cream)",
  labelSubColor: "var(--color-museum-cream)",
  centerFontFamily: "Flama, sans-serif",
  centerFontSize: 22,
  centerFontColor: "var(--color-primary)",
  hoverBrightness: 1.12,
  labelRadiusFraction: 0.5,
  labelAngleNudge: -5,
};
// ─────────────────────────────────────────────────────────────

const CX = 430;
const CY = 440;
const R_OUTER = 310;
const R_INNER = 155;
const R_MID = (R_OUTER + R_INNER) / 2;
const TIP_OVERLAP_DEG = 15;

const toRad = (deg) => (deg * Math.PI) / 180;
const polarPt = (r, deg) => [
  CX + r * Math.cos(toRad(deg)),
  CY + r * Math.sin(toRad(deg)),
];
const f = (n) => n.toFixed(3);

function percentagesToRanges(percentages) {
  const total = percentages.reduce((s, p) => s + p, 0);
  let cursor = 270;
  return percentages.map((pct) => {
    const sweep = (pct / total) * 360;
    const start = cursor;
    cursor += sweep;
    return { start, end: cursor };
  });
}

function buildBody(startDeg, endDeg) {
  const spanDeg = endDeg - startDeg;
  const largeArc = spanDeg > 180 ? 1 : 0;
  const oStart = polarPt(R_OUTER, startDeg);
  const oEnd = polarPt(R_OUTER, endDeg);
  const iStart = polarPt(R_INNER, startDeg);
  const iEnd = polarPt(R_INNER, endDeg);
  return [
    `M ${f(oStart[0])} ${f(oStart[1])}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${f(oEnd[0])} ${f(oEnd[1])}`,
    `L ${f(iEnd[0])} ${f(iEnd[1])}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${f(iStart[0])} ${f(iStart[1])}`,
    `Z`,
  ].join(" ");
}

function buildTip(endDeg) {
  const outerWing = polarPt(R_OUTER, endDeg);
  const innerWing = polarPt(R_INNER, endDeg);
  const tip = polarPt(R_MID, endDeg + TIP_OVERLAP_DEG);
  return [
    `M ${f(outerWing[0])} ${f(outerWing[1])}`,
    `L ${f(tip[0])} ${f(tip[1])}`,
    `L ${f(innerWing[0])} ${f(innerWing[1])}`,
    `Z`,
  ].join(" ");
}

function labelTransform(startDeg, endDeg, radiusFraction, angleNudge) {
  const R_LABEL = R_INNER + (R_OUTER - R_INNER) * radiusFraction;
  const midDeg = (startDeg + endDeg) / 2 + angleNudge;
  const [x, y] = polarPt(R_LABEL, midDeg);
  const rotateDeg = 0;
  return { x, y, rotateDeg };
}

export default function CycleWheel({
  phases,
  percentages = [12, 18, 6, 30],
  centerLabel,
  onPhaseClick,
}) {
  const [hovered, setHovered] = useState(null);
  const [tapped, setTapped] = useState(null);
  const [centerTapped, setCenterTapped] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  function handlePhaseTap(phase, i) {
    if (tapped !== null) return;
    setTapped(i);
    setTimeout(() => onPhaseClick?.(phase), 400);
    setTimeout(() => setTapped(null), 600);
  }

  function handleCenterTap() {
    if (centerTapped) return;
    setCenterTapped(true);
    // Small delay before fade in so React has rendered the hint at opacity 0 first
    setTimeout(() => setHintVisible(true), 20);
    // Fade out after 3.5s, then reset after fade completes
    setTimeout(() => setHintVisible(false), 3500);
    setTimeout(() => setCenterTapped(false), 4000);
  }

  const {
    labelFontFamily,
    labelFontSize,
    labelSubFontSize,
    labelColor,
    labelSubColor,
    centerFontFamily,
    centerFontSize,
    centerFontColor,
    hoverBrightness,
    labelRadiusFraction,
    labelAngleNudge,
  } = WHEEL;

  const ranges = percentagesToRanges(percentages);

  return (
    <svg
      viewBox="-80 -60 1020 1001"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* ── Pulse ring — expands outward from the wheel edge ── */}
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="6"
        style={{ pointerEvents: "none" }}
      >
        <animate
          attributeName="r"
          from={R_OUTER}
          to={R_OUTER + 80}
          dur="3.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.6"
          to="0"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Pass 1: segment bodies */}
      {phases.map((phase, i) => {
        if (!ranges[i]) return null;
        const { start, end } = ranges[i];
        const isTapped = tapped === i;
        return (
          <path
            key={phase.id + "-body"}
            d={buildBody(start, end)}
            fill={phase.color}
            onClick={() => handlePhaseTap(phase, i)}
            style={{
              cursor: "pointer",
              transformOrigin: `${CX}px ${CY}px`,
              transform: isTapped ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        );
      })}

      {/* Pass 2: arrowhead tips — drawn after all bodies so they overlap correctly */}
      {phases.map((phase, i) => {
        if (!ranges[i]) return null;
        const { end } = ranges[i];
        const isTapped = tapped === i;
        return (
          <path
            key={phase.id + "-tip"}
            d={buildTip(end)}
            fill={phase.color}
            style={{
              pointerEvents: "none",
              transformOrigin: `${CX}px ${CY}px`,
              transform: isTapped ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        );
      })}

      {/* Pass 3: labels inside each arrow — on top of everything */}
      {phases.map((phase, i) => {
        if (!ranges[i]) return null;
        const { start, end } = ranges[i];
        const sweepDeg = end - start;

        if (sweepDeg < 25) return null;

        const {
          x: baseX,
          y: baseY,
          rotateDeg,
        } = labelTransform(start, end, labelRadiusFraction, labelAngleNudge);

        const x = baseX + (phase.labelX ?? 0);
        const y = baseY + (phase.labelY ?? 0);

        return (
          <g
            key={phase.id + "-lbl"}
            transform={`rotate(${f(rotateDeg)}, ${f(x)}, ${f(y)})`}
            style={{ pointerEvents: "none" }}
          >
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontFamily={labelFontFamily}
              fontWeight="700"
              fontSize={labelFontSize}
              fill={labelColor}
            >
              {phase.name}
            </text>
            <text
              x={x}
              y={y + 10}
              textAnchor="middle"
              fontFamily={labelFontFamily}
              fontWeight="400"
              fontSize={labelSubFontSize}
              fill={labelSubColor}
            >
              {phase.sub}
            </text>
          </g>
        );
      })}

      {/* Center disc — filled with primary color, gap between it and the arrows */}
      <circle
        cx={CX}
        cy={CY}
        r={R_INNER - 20}
        fill="var(--color-primary)"
        onClick={handleCenterTap}
        style={{ cursor: "pointer" }}
        opacity={0.2}
      />

      {/* Center label — fades between normal text and hint text */}

      {/* Normal label — fades out when tapped */}
      <g
        style={{
          opacity: centerTapped ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        {centerLabel?.map((line, i) => (
          <text
            key={i}
            x={CX}
            y={CY - ((centerLabel.length - 1) * 22) / 2 + i * 22}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={centerFontFamily}
            fontWeight="600"
            fontSize={centerFontSize}
            fill={centerFontColor}
          >
            {line}
          </text>
        ))}
      </g>

      {/* Hint label — fades in when tapped, fades out after 3.5s */}
      <g
        style={{
          opacity: hintVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={centerFontFamily}
          fontWeight="600"
          fontSize={centerFontSize}
          fill={centerFontColor}
        >
          Klik på
        </text>
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={centerFontFamily}
          fontWeight="600"
          fontSize={centerFontSize}
          fill={centerFontColor}
        >
          faserne for
        </text>
        <text
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={centerFontFamily}
          fontWeight="600"
          fontSize={centerFontSize}
          fill={centerFontColor}
        >
          at se mere
        </text>
      </g>
    </svg>
  );
}

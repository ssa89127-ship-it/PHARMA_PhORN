"use client";

import { memo, useId } from "react";

/**
 * Crisp, unique product artwork for every medicine, drawn as SVG from its data
 * (name, dosage, form, manufacturer, category). Vector = sharp at any size and
 * zero image files to host. Shape follows the form: box (tablets, capsules…),
 * bottle (syrup, drops, sprays…), tube (cream, gel, ointment), vial (injections).
 * If a real product photo is uploaded later, pass it as `photoUrl`.
 */

export interface MedicineBoxProps {
  name: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  category?: string;
  prescription?: boolean;
  photoUrl?: string | null;
  className?: string;
}

const PALETTE: [string, string][] = [
  ["#0F766E", "#14B8A6"], ["#1D4ED8", "#60A5FA"], ["#B91C1C", "#F87171"],
  ["#7C3AED", "#A78BFA"], ["#C2410C", "#FB923C"], ["#047857", "#34D399"],
  ["#BE185D", "#F472B6"], ["#0369A1", "#38BDF8"], ["#A16207", "#FACC15"],
  ["#4338CA", "#818CF8"], ["#15803D", "#86EFAC"], ["#9F1239", "#FB7185"],
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Shape = "box" | "bottle" | "tube" | "vial";
function shapeFor(form = ""): Shape {
  const f = form.toLowerCase();
  if (/in'?ektsiya|inyeksiya|ampula|ukol/.test(f)) return "vial";
  if (/krem|gel|maz|balzam|toothpaste|pasta/.test(f)) return "tube";
  if (/sirop|damla|tomchi|sprey|eritma|suspenziya|sharbat|shampun|tonik|moy|losion|serum|atir|nebul/.test(f)) return "bottle";
  return "box";
}

function splitName(name: string, max = 13): string[] {
  const words = name.replace(/\s+\d.*$/, "").split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) lines[1] = lines[1].slice(0, max - 1) + "…";
  return lines.slice(0, 2);
}

function MedicineBoxImpl({ name, dosage, form, manufacturer, category, prescription, photoUrl, className }: MedicineBoxProps) {
  const uid = useId().replace(/:/g, "");
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} className={className} style={{ objectFit: "contain" }} loading="lazy" />;
  }

  const h = hash(category || name);
  const [dark, light] = PALETTE[h % PALETTE.length];
  const shape = shapeFor(form);
  const lines = splitName(name);
  const dose = dosage || (name.match(/\d+(?:[.,]\d+)?\s*(?:mg|g|ml|mcg|mkg|%)/i)?.[0] ?? "");
  const maker = (manufacturer || "").toUpperCase().slice(0, 18);
  const g = `g${uid}`, sh = `s${uid}`, gl = `l${uid}`;

  const label = (x: number, y: number, w: number, size = 1) => (
    <g>
      <text x={x + w / 2} y={y} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={17 * size} fill="#0f172a">
        {lines[0]}
      </text>
      {lines[1] && (
        <text x={x + w / 2} y={y + 19 * size} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={17 * size} fill="#0f172a">
          {lines[1]}
        </text>
      )}
      {dose && (
        <text x={x + w / 2} y={y + (lines[1] ? 40 : 22) * size} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize={13 * size} fill={dark}>
          {dose}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={`${name}${dose ? " " + dose : ""}`}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={gl} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={sh} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="120" cy="214" rx="78" ry="9" fill="#0f172a" opacity="0.10" />

      {shape === "box" && (
        <g filter={`url(#${sh})`}>
          {/* top */}
          <path d="M44 62 L72 40 L204 40 L176 62 Z" fill={light} />
          {/* side */}
          <path d="M176 62 L204 40 L204 182 L176 206 Z" fill={dark} />
          {/* front */}
          <rect x="44" y="62" width="132" height="144" rx="3" fill="#ffffff" />
          <rect x="44" y="62" width="132" height="34" fill={`url(#${g})`} />
          <rect x="44" y="176" width="132" height="30" fill={`url(#${g})`} />
          <text x="110" y="84" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize="10" letterSpacing="1.5" fill="#fff">{maker}</text>
          {label(44, 122, 132)}
          <text x="110" y="196" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={600} fontSize="10" fill="#fff">{(form || "").toUpperCase()}</text>
          <rect x="44" y="62" width="132" height="144" rx="3" fill={`url(#${gl})`} opacity="0.5" />
        </g>
      )}

      {shape === "bottle" && (
        <g filter={`url(#${sh})`}>
          <rect x="96" y="22" width="48" height="26" rx="5" fill={dark} />
          <path d="M100 48 h40 v14 c22 6 32 20 32 40 v96 a10 10 0 0 1 -10 10 h-84 a10 10 0 0 1 -10 -10 v-96 c0 -20 10 -34 32 -40 z" fill={`url(#${g})`} />
          <rect x="74" y="104" width="92" height="84" rx="6" fill="#ffffff" />
          <text x="120" y="118" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize="8" letterSpacing="1.2" fill={dark}>{maker}</text>
          {label(74, 138, 92, 0.85)}
          <rect x="80" y="70" width="10" height="120" rx="5" fill="#fff" opacity="0.25" />
        </g>
      )}

      {shape === "tube" && (
        <g filter={`url(#${sh})`} transform="rotate(-8 120 120)">
          <rect x="104" y="24" width="32" height="22" rx="4" fill={dark} />
          <path d="M70 46 h100 l-10 150 h-80 z" fill="#ffffff" />
          <path d="M70 46 h100 l-2 30 h-96 z" fill={`url(#${g})`} />
          <rect x="78" y="192" width="84" height="12" rx="2" fill={dark} />
          <text x="120" y="66" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize="9" letterSpacing="1.2" fill="#fff">{maker}</text>
          {label(76, 110, 88, 0.9)}
          <rect x="80" y="80" width="8" height="104" rx="4" fill={light} opacity="0.35" />
        </g>
      )}

      {shape === "vial" && (
        <g filter={`url(#${sh})`}>
          <rect x="62" y="70" width="34" height="18" rx="3" fill={dark} />
          <path d="M66 88 h26 v12 c6 4 8 8 8 14 v86 a6 6 0 0 1 -6 6 h-30 a6 6 0 0 1 -6 -6 v-86 c0 -6 2 -10 8 -14 z" fill={light} opacity="0.85" />
          <rect x="112" y="40" width="96" height="166" rx="8" fill="#ffffff" />
          <rect x="112" y="40" width="96" height="36" rx="8" fill={`url(#${g})`} />
          <rect x="112" y="64" width="96" height="12" fill={`url(#${g})`} />
          <text x="160" y="62" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize="8" letterSpacing="1.2" fill="#fff">{maker}</text>
          {label(112, 112, 96, 0.82)}
          <text x="160" y="194" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={600} fontSize="9" fill={dark}>{(form || "").toUpperCase()}</text>
        </g>
      )}

      {prescription && (
        <g>
          <rect x="176" y="14" width="50" height="24" rx="12" fill="#dc2626" />
          <text x="201" y="30" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize="12" fill="#fff">Rx</text>
        </g>
      )}
    </svg>
  );
}

export const MedicineBox = memo(MedicineBoxImpl);
export default MedicineBox;

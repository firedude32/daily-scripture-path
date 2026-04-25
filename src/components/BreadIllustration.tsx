/**
 * Hand-drawn line illustration of a rustic country loaf on linen,
 * with scattered wheat grains. Pure linework in burnished gold.
 * Styled like a 19th-century engraving plate.
 */
export function BreadIllustration({
  width = 280,
  height = 200,
}: {
  width?: number;
  height?: number;
}) {
  const gold = "#B8860B";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g
        stroke={gold}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* ---------- Linen cloth (under the loaf) ---------- */}
        <g opacity="0.85">
          {/* Cloth outer silhouette — irregular folded rectangle */}
          <path d="M36 158 C 50 150, 78 146, 110 146 C 150 146, 200 148, 232 154 C 246 156, 252 160, 248 166 C 244 172, 230 176, 210 178 C 170 182, 120 182, 80 180 C 56 179, 38 174, 34 168 C 32 164, 32 160, 36 158 Z" />
          {/* Fold lines */}
          <path d="M60 156 C 80 162, 110 164, 140 164" opacity="0.7" />
          <path d="M150 162 C 180 164, 210 162, 232 158" opacity="0.7" />
          <path d="M70 170 C 100 174, 150 176, 200 174" opacity="0.6" />
          {/* Cloth corner flick — left */}
          <path d="M34 168 C 28 170, 24 174, 26 178 C 30 180, 36 178, 40 176" opacity="0.8" />
          {/* Cloth corner flick — right */}
          <path d="M248 166 C 254 168, 258 172, 254 176 C 250 178, 244 176, 240 174" opacity="0.8" />
          {/* Weave hatching — left */}
          <g opacity="0.45" strokeWidth="0.6">
            <path d="M50 162 L 56 168" />
            <path d="M58 160 L 64 166" />
            <path d="M66 162 L 72 168" />
            <path d="M48 168 L 54 174" />
            <path d="M56 170 L 62 176" />
            <path d="M64 170 L 70 176" />
          </g>
          {/* Weave hatching — right */}
          <g opacity="0.45" strokeWidth="0.6">
            <path d="M210 162 L 216 168" />
            <path d="M218 160 L 224 166" />
            <path d="M226 162 L 232 168" />
            <path d="M212 170 L 218 176" />
            <path d="M220 170 L 226 176" />
            <path d="M204 168 L 210 174" />
          </g>
          {/* Weave hatching — center subtle */}
          <g opacity="0.3" strokeWidth="0.5">
            <path d="M120 168 L 126 174" />
            <path d="M134 168 L 140 174" />
            <path d="M148 168 L 154 174" />
            <path d="M162 168 L 168 174" />
          </g>
        </g>

        {/* ---------- Loaf ---------- */}
        {/* Main loaf outline — slightly squat oval, hand-drawn */}
        <path
          d="M82 148 C 76 120, 86 88, 116 76 C 138 67, 168 68, 188 80 C 210 93, 218 120, 212 144 C 209 156, 196 160, 178 160 C 150 162, 116 162, 96 158 C 88 156, 84 153, 82 148 Z"
          opacity="1"
        />
        {/* Secondary outline — gives inked weight */}
        <path
          d="M84 146 C 80 122, 90 92, 118 80 C 140 71, 166 72, 184 82"
          opacity="0.7"
          strokeWidth="0.9"
        />
        <path
          d="M210 138 C 213 150, 200 158, 184 159"
          opacity="0.7"
          strokeWidth="0.9"
        />

        {/* Score marks — cross on top */}
        <path d="M118 96 L 178 132" opacity="0.95" strokeWidth="1.4" />
        <path d="M178 96 L 118 132" opacity="0.95" strokeWidth="1.4" />
        {/* Score mark inner ticks (split crust suggestion) */}
        <g opacity="0.6" strokeWidth="0.7">
          <path d="M124 100 L 128 102" />
          <path d="M132 106 L 136 108" />
          <path d="M140 112 L 144 114" />
          <path d="M150 118 L 154 120" />
          <path d="M158 124 L 162 126" />
          <path d="M168 128 L 172 130" />
          <path d="M172 100 L 168 102" />
          <path d="M164 106 L 160 108" />
          <path d="M156 112 L 152 114" />
          <path d="M144 118 L 140 120" />
          <path d="M132 124 L 128 126" />
          <path d="M120 128 L 116 130" />
        </g>

        {/* Crumb stippling — small ellipses across crust */}
        <g opacity="0.55" strokeWidth="0.6">
          <ellipse cx="100" cy="110" rx="0.8" ry="0.6" />
          <ellipse cx="106" cy="120" rx="0.8" ry="0.6" />
          <ellipse cx="98" cy="130" rx="0.8" ry="0.6" />
          <ellipse cx="108" cy="138" rx="0.8" ry="0.6" />
          <ellipse cx="118" cy="146" rx="0.8" ry="0.6" />
          <ellipse cx="130" cy="150" rx="0.8" ry="0.6" />
          <ellipse cx="146" cy="152" rx="0.8" ry="0.6" />
          <ellipse cx="162" cy="150" rx="0.8" ry="0.6" />
          <ellipse cx="176" cy="146" rx="0.8" ry="0.6" />
          <ellipse cx="188" cy="140" rx="0.8" ry="0.6" />
          <ellipse cx="196" cy="130" rx="0.8" ry="0.6" />
          <ellipse cx="200" cy="118" rx="0.8" ry="0.6" />
          <ellipse cx="194" cy="106" rx="0.8" ry="0.6" />
          <ellipse cx="124" cy="86" rx="0.8" ry="0.6" />
          <ellipse cx="138" cy="80" rx="0.8" ry="0.6" />
          <ellipse cx="156" cy="80" rx="0.8" ry="0.6" />
          <ellipse cx="172" cy="84" rx="0.8" ry="0.6" />
          <ellipse cx="148" cy="92" rx="0.8" ry="0.6" />
          <ellipse cx="132" cy="118" rx="0.8" ry="0.6" />
          <ellipse cx="160" cy="118" rx="0.8" ry="0.6" />
          <ellipse cx="146" cy="132" rx="0.8" ry="0.6" />
        </g>

        {/* Flour dusting — sparse light specks */}
        <g opacity="0.35" strokeWidth="0.5">
          <path d="M112 88 L 113 88.5" />
          <path d="M128 92 L 129 92.5" />
          <path d="M144 86 L 145 86.5" />
          <path d="M168 90 L 169 90.5" />
          <path d="M182 96 L 183 96.5" />
          <path d="M104 102 L 105 102.5" />
          <path d="M192 114 L 193 114.5" />
          <path d="M152 102 L 153 102.5" />
          <path d="M138 108 L 139 108.5" />
        </g>

        {/* Bottom shadow line — anchors loaf to cloth */}
        <path
          d="M88 152 C 110 158, 150 160, 200 156"
          opacity="0.5"
          strokeWidth="0.8"
        />

        {/* ---------- Scattered wheat grains ---------- */}
        {/* Left grain cluster */}
        <g opacity="0.9">
          {/* Grain 1 — stem with seeds */}
          <path d="M22 178 C 18 174, 16 168, 18 162" strokeWidth="1" />
          {/* Seeds along stem */}
          <path d="M20 168 C 16 167, 14 169, 16 172 C 18 173, 20 171, 20 168 Z" strokeWidth="0.9" />
          <path d="M19 162 C 15 161, 13 163, 15 166 C 17 167, 19 165, 19 162 Z" strokeWidth="0.9" />
          <path d="M22 173 C 26 172, 28 174, 26 177 C 24 178, 22 176, 22 173 Z" strokeWidth="0.9" />
          {/* Awns (tiny whiskers) */}
          <path d="M18 162 L 15 156" strokeWidth="0.5" opacity="0.7" />
          <path d="M19 162 L 22 156" strokeWidth="0.5" opacity="0.7" />
          <path d="M18 162 L 18 154" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Right grain cluster */}
        <g opacity="0.9">
          <path d="M260 176 C 264 172, 266 166, 264 160" strokeWidth="1" />
          <path d="M262 166 C 266 165, 268 167, 266 170 C 264 171, 262 169, 262 166 Z" strokeWidth="0.9" />
          <path d="M263 160 C 267 159, 269 161, 267 164 C 265 165, 263 163, 263 160 Z" strokeWidth="0.9" />
          <path d="M260 171 C 256 170, 254 172, 256 175 C 258 176, 260 174, 260 171 Z" strokeWidth="0.9" />
          <path d="M264 160 L 267 154" strokeWidth="0.5" opacity="0.7" />
          <path d="M263 160 L 260 154" strokeWidth="0.5" opacity="0.7" />
          <path d="M264 160 L 264 152" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Single loose grain — front left */}
        <g opacity="0.85">
          <path d="M58 188 C 54 187, 52 189, 54 192 C 57 193, 60 191, 58 188 Z" strokeWidth="0.9" />
          <path d="M56 188 L 53 184" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Single loose grain — front right */}
        <g opacity="0.85">
          <path d="M226 190 C 230 189, 232 191, 230 194 C 227 195, 224 193, 226 190 Z" strokeWidth="0.9" />
          <path d="M228 190 L 231 186" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Single loose grain — center foreground */}
        <g opacity="0.8">
          <path d="M142 188 C 138 187, 136 189, 138 192 C 141 193, 144 191, 142 188 Z" strokeWidth="0.9" />
          <path d="M140 188 L 137 184" strokeWidth="0.5" opacity="0.65" />
          <path d="M140 188 L 143 184" strokeWidth="0.5" opacity="0.65" />
        </g>
      </g>
    </svg>
  );
}

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  hookA: string;
  hookB: string;
  isiA: string;
  isiB: string;
  isiC: string;
  ctaA: string;
  ctaB: string;
  showCaptions: boolean;
};

type Mood = 'stress' | 'happy' | 'wink' | 'calm';
type EyeKind = 'round' | 'arc' | 'wide';

const INK = '#22223B';
const SKIN = '#FFC9A3';
const HAIR = '#4A3B7C';
const SHIRT = '#6EE7B7';
const PINK = '#FF8FB1';
const CORAL = '#FF5D73';
const SUN = '#FFD93D';
const SKY = '#CDEBFF';
const LILAC = '#C9B6FF';
const GREEN = '#4ADE80';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';

const HOOK_END = 150;
const ISI_END = 330;
const TOTAL = 450;

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const T = (x: number, y: number) => 'translate(' + x + ' ' + y + ')';

const Sparkle: React.FC<{
  x: number;
  y: number;
  s: number;
  color: string;
  opacity?: number;
  rot?: number;
}> = ({x, y, s, color, opacity = 1, rot = 0}) => (
  <polygon
    points="0,-1 0.26,-0.26 1,0 0.26,0.26 0,1 -0.26,0.26 -1,0 -0.26,-0.26"
    transform={T(x, y) + ' rotate(' + rot + ') scale(' + s + ')'}
    fill={color}
    opacity={opacity}
  />
);

const Heart: React.FC<{
  x: number;
  y: number;
  s: number;
  color: string;
  opacity?: number;
  rot?: number;
}> = ({x, y, s, color, opacity = 1, rot = 0}) => (
  <path
    d="M50 88 C10 58 0 35 0 22 C0 8 12 0 25 0 C38 0 46 8 50 16 C54 8 62 0 75 0 C88 0 100 8 100 22 C100 35 90 58 50 88 Z"
    transform={
      T(x, y) +
      ' rotate(' +
      rot +
      ') scale(' +
      s / 100 +
      ') translate(-50 -44)'
    }
    fill={color}
    stroke={INK}
    strokeWidth={600 / Math.max(s, 1)}
    strokeLinejoin="round"
    opacity={opacity}
  />
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blobs = new Array(7).fill(0).map((_, i) => {
    const x = random('bx' + i) * 1080 + Math.sin(t * 0.5 + i) * 40;
    const y = random('by' + i) * 1920 + Math.cos(t * 0.4 + i * 2) * 50;
    const r = 90 + random('br' + i) * 150;
    return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.14} />;
  });
  const stars = new Array(9).fill(0).map((_, i) => {
    const x = random('sx' + i) * 1000 + 40;
    const y = random('sy' + i) * 1500 + 150;
    const s = 16 + random('ss' + i) * 18;
    const o = 0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i * 1.7));
    return <Sparkle key={i} x={x} y={y} s={s} color="#FFFFFF" opacity={o} />;
  });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD6E8" />
            <stop offset="1" stopColor={LILAC} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#bg)" />
        {blobs}
        {stars}
      </svg>
    </AbsoluteFill>
  );
};

const handPos = (side: number, angle: number) => {
  const a = (angle * Math.PI) / 180;
  return {
    x: side * 95 + side * 170 * Math.sin(a),
    y: 120 + 170 * Math.cos(a),
  };
};

const Arm: React.FC<{
  side: number;
  angle: number;
  hand?: React.ReactNode;
}> = ({side, angle, hand}) => {
  const h = handPos(side, angle);
  return (
    <g>
      <line
        x1={side * 95}
        y1={120}
        x2={h.x}
        y2={h.y}
        stroke={INK}
        strokeWidth={62}
        strokeLinecap="round"
      />
      <line
        x1={side * 95}
        y1={120}
        x2={h.x}
        y2={h.y}
        stroke={SHIRT}
        strokeWidth={46}
        strokeLinecap="round"
      />
      <circle cx={h.x} cy={h.y} r={34} fill={SKIN} stroke={INK} strokeWidth={7} />
      <g transform={T(h.x, h.y)}>{hand}</g>
    </g>
  );
};

const Eye: React.FC<{
  cx: number;
  kind: EyeKind;
  blink: number;
  look: number;
}> = ({cx, kind, blink, look}) => {
  if (kind === 'arc') {
    return (
      <path
        d={'M' + (cx - 26) + ',-6 Q' + cx + ',-48 ' + (cx + 26) + ',-6'}
        fill="none"
        stroke={INK}
        strokeWidth={9}
        strokeLinecap="round"
      />
    );
  }
  const wide = kind === 'wide';
  const ry = (wide ? 44 : 36) * blink;
  return (
    <g>
      <ellipse
        cx={cx}
        cy={-12}
        rx={wide ? 33 : 28}
        ry={ry}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={7}
      />
      {blink > 0.5 ? (
        <circle cx={cx + look} cy={-12} r={wide ? 9 : 14} fill={INK} />
      ) : null}
    </g>
  );
};

const Character: React.FC<{
  x: number;
  y: number;
  s: number;
  mood: Mood;
  armL: number;
  armR: number;
  leftHand?: React.ReactNode;
  rightHand?: React.ReactNode;
  shh?: boolean;
}> = ({x, y, s, mood, armL, armR, leftHand, rightHand, shh = false}) => {
  const frame = useCurrentFrame();
  const blink = frame % 96 > 91 ? 0.12 : 1;
  const kindL: EyeKind =
    mood === 'happy' ? 'arc' : mood === 'stress' ? 'wide' : 'round';
  const kindR: EyeKind =
    mood === 'happy' || mood === 'wink'
      ? 'arc'
      : mood === 'stress'
      ? 'wide'
      : 'round';
  const look = mood === 'stress' ? Math.sin(frame / 2) * 6 : 0;
  const drop = (frame % 36) / 36;

  let mouth: React.ReactNode;
  if (mood === 'stress') {
    mouth = (
      <path
        d="M-34,80 Q-17,62 0,80 Q17,98 34,80"
        fill="none"
        stroke={INK}
        strokeWidth={8}
        strokeLinecap="round"
      />
    );
  } else if (mood === 'happy') {
    mouth = (
      <path
        d="M-48,46 Q0,112 48,46 Z"
        fill="#E64A6B"
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />
    );
  } else {
    mouth = (
      <path
        d="M-36,52 Q0,96 36,52 Z"
        fill="#E64A6B"
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />
    );
  }

  return (
    <g transform={T(x, y) + ' scale(' + s + ')'}>
      <ellipse cx={0} cy={352} rx={170} ry={22} fill={INK} opacity={0.18} />
      <ellipse cx={0} cy={-30} rx={152} ry={150} fill={HAIR} stroke={INK} strokeWidth={8} />
      <rect x={-95} y={70} width={190} height={260} rx={72} fill={SHIRT} stroke={INK} strokeWidth={8} />
      <Heart x={0} y={205} s={58} color={PINK} />
      <Arm side={-1} angle={armL} hand={leftHand} />
      {shh ? (
        <g>
          <polyline
            points="95,120 165,235 38,96"
            fill="none"
            stroke={INK}
            strokeWidth={62}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="95,120 165,235 38,96"
            fill="none"
            stroke={SHIRT}
            strokeWidth={46}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={38} cy={96} r={30} fill={SKIN} stroke={INK} strokeWidth={7} />
        </g>
      ) : (
        <Arm side={1} angle={armR} hand={rightHand} />
      )}
      <circle cx={0} cy={-20} r={135} fill={SKIN} stroke={INK} strokeWidth={8} />
      <path
        d="M-133,-30 C-140,-190 140,-190 133,-30 C110,-90 70,-122 20,-108 C-30,-130 -90,-110 -133,-30 Z"
        fill={HAIR}
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <circle cx={-88} cy={38} r={20} fill="#FF8FA3" opacity={0.6} />
      <circle cx={88} cy={38} r={20} fill="#FF8FA3" opacity={0.6} />
      {mood === 'stress' ? (
        <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round">
          <path d="M-80,-66 L-26,-84" />
          <path d="M26,-84 L80,-66" />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round">
          <path d="M-76,-70 Q-50,-86 -24,-72" />
          <path d="M24,-72 Q50,-86 76,-70" />
        </g>
      )}
      <Eye cx={-50} kind={kindL} blink={blink} look={look} />
      <Eye cx={50} kind={kindR} blink={blink} look={look} />
      {mouth}
      {shh ? (
        <rect x={30} y={34} width={22} height={72} rx={11} fill={SKIN} stroke={INK} strokeWidth={6} />
      ) : null}
      {mood === 'stress' ? (
        <path
          d="M0,-22 C14,-2 16,8 8,18 C0,26 -12,22 -12,10 C-12,0 -4,-8 0,-22 Z"
          transform={T(128, -90 + drop * 80)}
          fill="#9AD7FF"
          stroke={INK}
          strokeWidth={5}
          opacity={1 - drop}
        />
      ) : null}
    </g>
  );
};

const Lipstick: React.FC = () => (
  <g>
    <rect x={-24} y={0} width={48} height={74} rx={9} fill={SUN} stroke={INK} strokeWidth={6} />
    <rect x={-19} y={-44} width={38} height={44} fill={CORAL} stroke={INK} strokeWidth={6} />
    <path d="M-19,-44 L19,-62 L19,-44 Z" fill={CORAL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

const Brush: React.FC = () => (
  <g>
    <line x1={0} y1={70} x2={0} y2={-10} stroke={INK} strokeWidth={26} strokeLinecap="round" />
    <line x1={0} y1={70} x2={0} y2={-10} stroke={SUN} strokeWidth={14} strokeLinecap="round" />
    <path d="M-26,-6 C-30,-56 0,-86 0,-86 C0,-86 30,-56 26,-6 Z" fill={PINK} stroke={INK} strokeWidth={6} />
  </g>
);

const Compact: React.FC = () => (
  <g>
    <circle r={46} fill="#B8C0FF" stroke={INK} strokeWidth={6} />
    <circle r={32} fill="#FFE5F1" stroke={INK} strokeWidth={5} />
    <path d="M-16,-8 Q-6,-22 8,-20" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Clock: React.FC<{
  x: number;
  y: number;
  r: number;
  spin: number;
  rot: number;
  tag?: number;
}> = ({x, y, r, spin, rot, tag = 1}) => {
  const ticks = new Array(12).fill(0).map((_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1={Math.sin(a) * r * 0.78}
        y1={-Math.cos(a) * r * 0.78}
        x2={Math.sin(a) * r * 0.9}
        y2={-Math.cos(a) * r * 0.9}
        stroke={INK}
        strokeWidth={6}
        strokeLinecap="round"
      />
    );
  });
  return (
    <g transform={T(x, y) + ' rotate(' + rot + ')'}>
      <circle r={r + 14} fill={SUN} stroke={INK} strokeWidth={9} />
      <circle r={r} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
      {ticks}
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={INK} strokeWidth={13} strokeLinecap="round" transform={'rotate(' + spin / 12 + ')'} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.76} stroke={CORAL} strokeWidth={9} strokeLinecap="round" transform={'rotate(' + spin + ')'} />
      <circle r={11} fill={INK} />
      <g opacity={tag}>
        <rect x={-98} y={r + 36} width={196} height={72} rx={30} fill={CORAL} stroke={INK} strokeWidth={7} />
        <text x={0} y={r + 73} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontSize={46} fontWeight={900} fill="#FFFFFF">
          2 JAM
        </text>
      </g>
    </g>
  );
};

const XMark: React.FC<{x: number; y: number; r: number; p: number}> = ({x, y, r, p}) => (
  <g transform={T(x, y) + ' scale(' + p + ')'}>
    <line x1={-r} y1={-r} x2={r} y2={r} stroke={INK} strokeWidth={50} strokeLinecap="round" />
    <line x1={r} y1={-r} x2={-r} y2={r} stroke={INK} strokeWidth={50} strokeLinecap="round" />
    <line x1={-r} y1={-r} x2={r} y2={r} stroke="#FF3B5C" strokeWidth={32} strokeLinecap="round" />
    <line x1={r} y1={-r} x2={-r} y2={r} stroke="#FF3B5C" strokeWidth={32} strokeLinecap="round" />
  </g>
);

const Friend: React.FC<{
  x: number;
  y: number;
  skin: string;
  hair: string;
  shirt: string;
  start: number;
}> = ({x, y, skin, hair, shirt, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - start,
    fps,
    config: {damping: 12, stiffness: 110},
  });
  const bob = Math.sin((frame - start) / 6) * 7;
  const px = x + (1 - p) * 460;
  return (
    <g transform={T(px, y + bob) + ' scale(1.2)'}>
      <rect x={-62} y={52} width={124} height={120} rx={44} fill={shirt} stroke={INK} strokeWidth={7} />
      <circle r={72} fill={skin} stroke={INK} strokeWidth={7} />
      <path d="M-72,-8 C-76,-100 76,-100 72,-8 C52,-52 -52,-52 -72,-8 Z" fill={hair} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={-26} cy={10} r={8} fill={INK} />
      <circle cx={26} cy={10} r={8} fill={INK} />
      <path d="M-26,32 Q0,56 26,32" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-48} cy={30} r={12} fill="#FF8FA3" opacity={0.6} />
      <circle cx={48} cy={30} r={12} fill="#FF8FA3" opacity={0.6} />
    </g>
  );
};

const Hearts: React.FC<{
  x: number;
  y: number;
  start: number;
  n?: number;
  color?: string;
  rise?: number;
}> = ({x, y, start, n = 3, color = CORAL, rise = 150}) => {
  const frame = useCurrentFrame();
  if (frame < start) {
    return null;
  }
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const age = (frame - start + i * (60 / n)) % 60;
        const q = age / 60;
        return (
          <Heart
            key={i}
            x={x + Math.sin(q * 6 + i * 2) * 26 + (i - 1) * 34}
            y={y - q * rise}
            s={34 + 16 * Math.sin(q * Math.PI)}
            color={color}
            opacity={Math.sin(q * Math.PI)}
          />
        );
      })}
    </g>
  );
};

const Bottle: React.FC<{
  x: number;
  y: number;
  s: number;
  rot: number;
  press?: number;
}> = ({x, y, s, rot, press = 0}) => (
  <g transform={T(x, y) + ' rotate(' + rot + ') scale(' + s + ')'}>
    <ellipse cx={0} cy={214} rx={130} ry={16} fill={INK} opacity={0.15} />
    <rect x={-110} y={-60} width={220} height={260} rx={52} fill={SKY} stroke={INK} strokeWidth={9} />
    <rect x={-94} y={44} width={188} height={140} rx={36} fill={PINK} />
    <rect x={-84} y={-34} width={18} height={110} rx={9} fill="#FFFFFF" opacity={0.75} />
    <circle cx={0} cy={112} r={40} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <Heart x={0} y={112} s={42} color={CORAL} />
    <rect x={-42} y={-124} width={84} height={68} fill={SUN} stroke={INK} strokeWidth={9} />
    <g transform={T(0, press)}>
      <rect x={-62} y={-214} width={124} height={96} rx={28} fill={SUN} stroke={INK} strokeWidth={9} />
      <rect x={-44} y={-198} width={14} height={60} rx={7} fill="#FFFFFF" opacity={0.7} />
      <rect x={-16} y={-242} width={32} height={30} rx={8} fill={INK} />
    </g>
  </g>
);

const nozzle = (x: number, y: number, s: number, rot: number) => {
  const a = (rot * Math.PI) / 180;
  const lx = -10;
  const ly = -236;
  return {
    x: x + s * (lx * Math.cos(a) - ly * Math.sin(a)),
    y: y + s * (lx * Math.sin(a) + ly * Math.cos(a)),
  };
};

const Mist: React.FC<{
  ox: number;
  oy: number;
  start: number;
  end: number;
}> = ({ox, oy, start, end}) => {
  const frame = useCurrentFrame();
  const L = 26;
  const n = 16;
  if (frame < start) {
    return null;
  }
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const age = (frame - start + (i * L) / n) % L;
        const birth = frame - age;
        if (birth < start || birth > end) {
          return null;
        }
        const q = age / L;
        const px = ox - q * 400 + (random('mx' + i) - 0.5) * 40;
        const py = oy + q * 70 + (random('my' + i) - 0.5) * 50;
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={20 + q * 62}
            fill={i % 2 === 0 ? '#FFFFFF' : '#FFE0EE'}
            stroke="#FFB3D1"
            strokeWidth={5}
            opacity={0.95 * (1 - q * q)}
          />
        );
      })}
    </g>
  );
};

const Stopwatch: React.FC<{x: number; y: number; r: number; t: number}> = ({
  x,
  y,
  r,
  t,
}) => (
  <g transform={T(x, y)}>
    <rect x={-18} y={-r - 40} width={36} height={34} rx={8} fill={INK} />
    <circle r={r + 12} fill={CORAL} stroke={INK} strokeWidth={9} />
    <circle r={r} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={INK} strokeWidth={9} strokeLinecap="round" transform={'rotate(' + t * 360 + ')'} />
    <circle r={9} fill={INK} />
    <line x1={-r - 70} y1={-24} x2={-r - 28} y2={-24} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <line x1={-r - 90} y1={4} x2={-r - 28} y2={4} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <line x1={-r - 70} y1={32} x2={-r - 28} y2={32} stroke={INK} strokeWidth={8} strokeLinecap="round" />
  </g>
);

const CheckBadge: React.FC<{x: number; y: number; p: number; q: number}> = ({
  x,
  y,
  p,
  q,
}) => {
  const colors = [SUN, PINK, SKY, GREEN, CORAL];
  const bits = new Array(16).fill(0).map((_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    const d = 130 + 120 * q;
    return (
      <rect
        key={i}
        x={Math.cos(a) * d - 8}
        y={Math.sin(a) * d - 8}
        width={16}
        height={16}
        rx={4}
        fill={colors[i % 5]}
        stroke={INK}
        strokeWidth={3}
        opacity={1 - q}
        transform={'rotate(' + i * 40 + ' ' + Math.cos(a) * d + ' ' + Math.sin(a) * d + ')'}
      />
    );
  });
  return (
    <g transform={T(x, y)}>
      {bits}
      <g transform={'scale(' + p + ')'}>
        <circle r={95} fill={GREEN} stroke={INK} strokeWidth={10} />
        <path d="M-44,2 L-12,36 L48,-30" fill="none" stroke="#FFFFFF" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const LiveBadge: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  const frame = useCurrentFrame();
  const ring = (frame % 36) / 36;
  const dot = frame % 24 < 14 ? 1 : 0.35;
  return (
    <g transform={T(x, y) + ' rotate(-6) scale(' + p + ')'}>
      <rect
        x={-160}
        y={-52}
        width={320}
        height={104}
        rx={52}
        fill="none"
        stroke="#FF2D55"
        strokeWidth={8}
        opacity={0.7 * (1 - ring)}
        transform={'scale(' + (1 + ring * 0.3) + ')'}
      />
      <rect x={-160} y={-52} width={320} height={104} rx={52} fill="#FF2D55" stroke={INK} strokeWidth={9} />
      <circle cx={-96} cy={0} r={17} fill="#FFFFFF" opacity={dot} />
      <text x={30} y={3} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontSize={62} fontWeight={900} fill="#FFFFFF" letterSpacing={4}>
        LIVE
      </text>
    </g>
  );
};

const Lock: React.FC<{x: number; y: number; s: number; rot: number}> = ({
  x,
  y,
  s,
  rot,
}) => (
  <g transform={T(x, y) + ' rotate(' + rot + ') scale(' + s + ')'}>
    <path d="M-46,-48 L-46,-92 A46,46 0 0 1 46,-92 L46,-48" fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
    <path d="M-46,-48 L-46,-92 A46,46 0 0 1 46,-92 L46,-48" fill="none" stroke="#E5E7EB" strokeWidth={14} strokeLinecap="round" />
    <rect x={-80} y={-48} width={160} height={130} rx={28} fill={SUN} stroke={INK} strokeWidth={9} />
    <circle cx={0} cy={6} r={18} fill={INK} />
    <rect x={-8} y={12} width={16} height={38} rx={6} fill={INK} />
  </g>
);

const QMark: React.FC<{
  x: number;
  y: number;
  size: number;
  rot: number;
  opacity: number;
}> = ({x, y, size, rot, opacity}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    dominantBaseline="central"
    fontFamily={FONT}
    fontSize={size}
    fontWeight={900}
    fill="#FFFFFF"
    stroke={INK}
    strokeWidth={12}
    strokeLinejoin="round"
    paintOrder="stroke"
    opacity={opacity}
    transform={'rotate(' + rot + ' ' + x + ' ' + y + ')'}
  >
    ?
  </text>
);

type Seg = {text: string; hl: boolean};

const parse = (s: string): Seg[] => {
  const out: Seg[] = [];
  s.split('*').forEach((part, i) => {
    if (i % 2 === 1) {
      if (part.trim().length > 0) {
        out.push({text: part.trim(), hl: true});
      }
      return;
    }
    part
      .split(' ')
      .filter((w) => w.length > 0)
      .forEach((w) => out.push({text: w, hl: false}));
  });
  return out;
};

const Caption: React.FC<{
  text: string;
  from: number;
  to: number;
  size: number;
  show: boolean;
  top?: number;
}> = ({text, from, to, size, show, top = 1090}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!show || frame < from || frame > to) {
    return null;
  }
  const words = parse(text);
  const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 22,
        rowGap: 6,
        opacity: out,
      }}
    >
      {words.map((w, i) => {
        const p = spring({
          frame: frame - from - i * 4,
          fps,
          config: {damping: 11, stiffness: 160},
        });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: size,
              fontWeight: 900,
              lineHeight: 1.12,
              color: w.hl ? SUN : '#FFFFFF',
              WebkitTextStroke: '14px ' + INK,
              paintOrder: 'stroke fill',
              transform: 'scale(' + p + ') rotate(' + (1 - p) * -8 + 'deg)',
              opacity: Math.min(1, p * 2),
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

const Canvas: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <svg
    width={1080}
    height={1920}
    viewBox="0 0 1080 1920"
    style={{position: 'absolute', top: 0, left: 0}}
  >
    {children}
  </svg>
);

const SceneHook: React.FC<Props> = ({hookA, hookB, showCaptions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stress = frame < 70;
  const spin = Math.min(frame, 70) * 34;
  const slam = spring({
    frame: frame - 70,
    fps,
    config: {damping: 9, stiffness: 180},
  });
  const itemOut = interpolate(frame, [70, 100], [1, 0], clamp);
  const jitter = stress ? Math.sin(frame * 3) * 4 : 0;
  const bob = Math.sin(frame / 7) * 6;
  const armL = stress ? 150 + Math.sin(frame / 2.5) * 28 : 25;
  const armR = stress
    ? 150 + Math.sin(frame / 2.5 + 2) * 28
    : 140 + Math.sin(frame / 4) * 22;
  const orbit = [<Lipstick key="l" />, <Compact key="c" />, <Brush key="b" />];
  return (
    <AbsoluteFill>
      <Canvas>
        {itemOut > 0.01
          ? orbit.map((item, i) => {
              const th = frame * 0.12 + i * 2.1;
              const ox = 380 + 290 * Math.cos(th);
              const oy = 600 + 160 * Math.sin(th);
              return (
                <g
                  key={i}
                  transform={
                    T(ox, oy) +
                    ' rotate(' +
                    frame * 6 +
                    ') scale(' +
                    itemOut * 1.1 +
                    ')'
                  }
                >
                  {item}
                </g>
              );
            })
          : null}
        <Clock
          x={830}
          y={430}
          r={130}
          spin={spin}
          rot={stress ? Math.sin(frame * 2) * 4 : 0}
          tag={interpolate(frame, [72, 92], [1, 0], clamp)}
        />
        {frame >= 70 ? <XMark x={830} y={430} r={110} p={slam} /> : null}
        <Character
          x={380 + jitter}
          y={640 + bob}
          s={1.1}
          mood={stress ? 'stress' : 'happy'}
          armL={armL}
          armR={armR}
          leftHand={
            stress ? (
              <g transform="rotate(-20)">
                <Brush />
              </g>
            ) : null
          }
          rightHand={
            stress ? (
              <g transform="rotate(20)">
                <Lipstick />
              </g>
            ) : null
          }
        />
        <Friend x={760} y={850} skin="#F5B78F" hair="#2D1B4E" shirt={SKY} start={92} />
        <Friend x={930} y={800} skin="#D9966A" hair={PINK} shirt={SUN} start={100} />
        <Hearts x={760} y={740} start={108} rise={90} />
        <Hearts x={930} y={690} start={116} color={PINK} rise={90} />
        <Hearts x={560} y={470} start={96} n={2} />
      </Canvas>
      <Caption text={hookA} from={4} to={78} size={96} show={showCaptions} />
      <Caption text={hookB} from={80} to={148} size={82} show={showCaptions} />
    </AbsoluteFill>
  );
};

const SceneIsi: React.FC<Props> = ({isiA, isiB, isiC, showCaptions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const make = frame < 55;
  const watchScale = interpolate(frame, [0, 10, 60, 72], [0, 1, 1, 0], clamp);
  const watchT = interpolate(frame, [4, 44], [0, 1], clamp);
  const bp = spring({frame: frame - 48, fps, config: {damping: 11, stiffness: 100}});
  const bx = 1300 - (1300 - 760) * bp;
  const by = 780 + (frame > 132 ? Math.sin((frame - 132) / 6) * 8 : 0);
  const rot = interpolate(frame, [62, 74, 118, 132], [0, -30, -30, 0], clamp);
  const spraying = frame >= 78 && frame <= 118;
  const press = spraying ? 16 * Math.max(0, Math.sin(frame * 0.9)) : 0;
  const nz = nozzle(bx, by, 0.95, rot);
  const armR = make
    ? 120 + Math.sin(frame * 0.6) * 35
    : interpolate(frame, [55, 75, 120, 140], [120, 25, 25, 168], clamp);
  const armL = make ? 120 + Math.sin(frame * 0.5 + 1) * 15 : 22;
  const cp = spring({frame: frame - 128, fps, config: {damping: 9, stiffness: 140}});
  const cq = interpolate(frame, [128, 160], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Canvas>
        <g transform={'translate(0 0)'} opacity={watchScale > 0.01 ? 1 : 0}>
          <g transform={T(830, 440) + ' scale(' + watchScale + ') translate(-830 -440)'}>
            <Stopwatch x={830} y={440} r={85} t={watchT} />
          </g>
        </g>
        <Character
          x={360}
          y={640}
          s={1.1}
          mood={make ? 'calm' : 'happy'}
          armL={armL}
          armR={armR}
          leftHand={
            make ? (
              <g transform="scale(0.8)">
                <Compact />
              </g>
            ) : null
          }
          rightHand={
            make ? (
              <g transform="rotate(25)">
                <Brush />
              </g>
            ) : frame >= 120 ? (
              <rect x={-10} y={-62} width={20} height={38} rx={10} fill={SKIN} stroke={INK} strokeWidth={6} />
            ) : null
          }
        />
        {make
          ? [0, 1, 2, 3, 4].map((i) => {
              const f = (frame - i * 7) % 24;
              const sc = Math.max(0, Math.sin((f / 24) * Math.PI));
              const px = 360 + (i - 2) * 125 + Math.sin(i * 3) * 30;
              const py = 470 + Math.cos(i * 2) * 70;
              return (
                <Sparkle key={i} x={px} y={py} s={14 + 26 * sc} color={SUN} rot={frame * 4} opacity={sc} />
              );
            })
          : null}
        <Mist ox={nz.x} oy={nz.y} start={78} end={118} />
        <Bottle x={bx} y={by} s={0.95} rot={rot} press={press} />
        <Hearts x={360} y={430} start={96} n={3} />
        {frame >= 128 ? <CheckBadge x={800} y={430} p={cp} q={cq} /> : null}
      </Canvas>
      <Caption text={isiA} from={4} to={50} size={96} show={showCaptions} />
      <Caption text={isiB} from={54} to={118} size={120} show={showCaptions} />
      <Caption text={isiC} from={122} to={178} size={112} show={showCaptions} />
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<Props> = ({ctaA, ctaB, showCaptions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lp = spring({frame: frame - 10, fps, config: {damping: 9, stiffness: 140}});
  const kp = spring({frame: frame - 34, fps, config: {damping: 10, stiffness: 120}});
  const bob = Math.sin(frame / 8) * 6;
  const qs = [
    {x: 700, y: 600, ph: 0},
    {x: 930, y: 640, ph: 1.7},
    {x: 860, y: 560, ph: 3.1},
  ];
  return (
    <AbsoluteFill>
      <Canvas>
        <Character
          x={370}
          y={640 + bob}
          s={1.1}
          mood="wink"
          armL={38}
          armR={0}
          shh
          leftHand={
            <g transform={'translate(0 -50) rotate(-8) scale(0.5)'}>
              <Bottle x={0} y={0} s={1} rot={0} />
            </g>
          }
        />
        <LiveBadge x={790} y={400} p={lp} />
        <Lock x={810} y={760} s={kp} rot={Math.sin(frame / 5) * 8} />
        {qs.map((q, i) => {
          const f = (frame * 2 + q.ph * 20) % 80;
          return (
            <QMark
              key={i}
              x={q.x + Math.sin(f / 10) * 14}
              y={q.y - f * 0.8 + 40}
              size={96}
              rot={Math.sin(f / 9 + q.ph) * 14}
              opacity={frame > 40 ? Math.sin((f / 80) * Math.PI) : 0}
            />
          );
        })}
        {[0, 1, 2].map((i) => {
          const f = (frame - i * 9) % 30;
          const sc = Math.max(0, Math.sin((f / 30) * Math.PI));
          return (
            <Sparkle
              key={i}
              x={720 + i * 90}
              y={870 - (i % 2) * 40}
              s={12 + 22 * sc}
              color={SUN}
              rot={frame * 3}
              opacity={frame > 40 ? sc : 0}
            />
          );
        })}
      </Canvas>
      <Caption text={ctaA} from={4} to={58} size={112} show={showCaptions} />
      <Caption text={ctaB} from={60} to={118} size={88} show={showCaptions} />
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at - 8 || frame > at + 8) {
    return null;
  }
  const x =
    frame <= at
      ? interpolate(frame, [at - 8, at], [-1080, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(frame, [at, at + 8], [0, 1080], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        });
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        transform: 'translateX(' + x + 'px)',
        background:
          'linear-gradient(90deg, ' +
          SUN +
          ' 0%, ' +
          SUN +
          ' 88%, ' +
          CORAL +
          ' 88%, ' +
          CORAL +
          ' 100%)',
      }}
    />
  );
};

export const Intro: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: LILAC}}>
      <Background />
      <Sequence from={0} durationInFrames={HOOK_END}>
        <SceneHook {...props} />
      </Sequence>
      <Sequence from={HOOK_END} durationInFrames={ISI_END - HOOK_END}>
        <SceneIsi {...props} />
      </Sequence>
      <Sequence from={ISI_END} durationInFrames={TOTAL - ISI_END}>
        <SceneCta {...props} />
      </Sequence>
      <Wipe at={HOOK_END} />
      <Wipe at={ISI_END} />
    </AbsoluteFill>
  );
};

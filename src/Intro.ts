import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Semua props dibuat opsional (?) agar TIDAK AKAN ERROR
// meskipun Root.tsx atau render.yml mengirim props lama maupun baru
export type Props = {
  kicker?: string;
  hookTop?: string;
  hookBottom?: string;
  brand?: string;
  tagline?: string;
  valueTitle?: string;
  points?: string[];
  ctaLead?: string;
  ctaMain?: string;
  isiStep1?: string;
  isiStep2?: string;
};

const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const STROKE = '#1E1B2E';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const CartoonBackground: React.FC<{bgColor: string; accentColor: string}> = ({
  bgColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const offset = (frame * 1.5) % 80;

  return (
    <AbsoluteFill style={{backgroundColor: bgColor, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: -160,
          left: -160,
          right: -160,
          bottom: -160,
          backgroundImage:
            'radial-gradient(' + accentColor + ' 22%, transparent 23%)',
          backgroundSize: '80px 80px',
          backgroundPosition: offset + 'px ' + offset + 'px',
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 120 + Math.sin(frame / 15) * 25,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: accentColor,
          border: '8px solid ' + STROKE,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 180 + Math.cos(frame / 18) * 30,
          right: -90,
          width: 360,
          height: 360,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '8px solid ' + STROKE,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

const CartoonBubbleText: React.FC<{
  text: string;
  delay: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  rotate?: number;
}> = ({
  text,
  delay,
  bg = '#FFFFFF',
  color = STROKE,
  fontSize = 58,
  rotate = -2,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 10, stiffness: 160},
  });
  const scale = interpolate(pop, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: 'scale(' + scale + ') rotate(' + rotate + 'deg)',
        backgroundColor: bg,
        color,
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        padding: '24px 42px',
        borderRadius: 36,
        border: '8px solid ' + STROKE,
        boxShadow: '12px 14px 0px ' + STROKE,
        textAlign: 'center',
        lineHeight: 1.25,
        maxWidth: 920,
      }}
    >
      {text}
    </div>
  );
};

const CartoonCharacter: React.FC<{
  mood: 'tired' | 'happy' | 'wink';
  scale?: number;
}> = ({mood, scale = 1}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 6) * 10;
  const sweatY = (frame * 4) % 45;

  return (
    <div
      style={{
        transform: 'translateY(' + bob + 'px) scale(' + scale + ')',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width="460" height="480" viewBox="0 0 460 480">
        <path
          d="M80 220 C60 100, 400 100, 380 220 C400 320, 390 400, 340 420 L120 420 C70 400, 60 320, 80 220 Z"
          fill="#2D2346"
          stroke={STROKE}
          strokeWidth="12"
        />
        <path
          d="M120 370 C120 330, 340 330, 340 370 L370 470 L90 470 Z"
          fill="#FF6B9E"
          stroke={STROKE}
          strokeWidth="12"
          strokeLinejoin="round"
        />
        <rect
          x="200"
          y="310"
          width="60"
          height="60"
          rx="20"
          fill="#FFE0C8"
          stroke={STROKE}
          strokeWidth="12"
        />
        <circle
          cx="230"
          cy="220"
          r="115"
          fill="#FFE0C8"
          stroke={STROKE}
          strokeWidth="12"
        />
        <path
          d="M115 200 C130 110, 330 110, 345 200 C310 160, 260 180, 230 150 C190 180, 150 160, 115 200 Z"
          fill="#2D2346"
          stroke={STROKE}
          strokeWidth="12"
          strokeLinejoin="round"
        />
        <ellipse
          cx="155"
          cy="245"
          rx="22"
          ry="12"
          fill="#FF8DA1"
          opacity={mood === 'tired' ? 0.3 : 0.85}
        />
        <ellipse
          cx="305"
          cy="245"
          rx="22"
          ry="12"
          fill="#FF8DA1"
          opacity={mood === 'tired' ? 0.3 : 0.85}
        />

        {mood === 'tired' && (
          <g>
            <line
              x1="155"
              y1="205"
              x2="195"
              y2="225"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="195"
              y1="205"
              x2="155"
              y2="225"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="265"
              y1="205"
              x2="305"
              y2="225"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="305"
              y1="205"
              x2="265"
              y2="225"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M155 238 Q175 248 195 238"
              fill="none"
              stroke="#8C7A9E"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M265 238 Q285 248 305 238"
              fill="none"
              stroke="#8C7A9E"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M195 280 Q212 265 230 280 T265 280"
              fill="none"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle
              cx="355"
              cy={155 + sweatY}
              r="14"
              fill="#4CC9F0"
              stroke={STROKE}
              strokeWidth="6"
            />
          </g>
        )}

        {mood === 'happy' && (
          <g>
            <circle cx="175" cy="215" r="16" fill={STROKE} />
            <circle cx="170" cy="209" r="6" fill="#FFFFFF" />
            <circle cx="285" cy="215" r="16" fill={STROKE} />
            <circle cx="280" cy="209" r="6" fill="#FFFFFF" />
            <path
              d="M190 260 Q230 310 270 260 Z"
              fill="#FF4D6D"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinejoin="round"
            />
          </g>
        )}

        {mood === 'wink' && (
          <g>
            <path
              d="M155 215 Q175 195 195 215"
              fill="none"
              stroke={STROKE}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="285" cy="215" r="16" fill={STROKE} />
            <circle cx="280" cy="209" r="6" fill="#FFFFFF" />
            <path
              d="M195 262 Q235 300 275 258"
              fill="none"
              stroke={STROKE}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

const SceneHook: React.FC<{hookTop: string; hookBottom: string}> = ({
  hookTop,
  hookBottom,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const clockPop = spring({
    frame: frame - 8,
    fps,
    config: {damping: 12, stiffness: 140},
  });
  const crossPop = spring({
    frame: frame - 45,
    fps,
    config: {damping: 8, stiffness: 180},
  });
  const isSecondPart = frame >= 68;
  const heartPop = spring({
    frame: frame - 72,
    fps,
    config: {damping: 10, stiffness: 130},
  });

  return (
    <AbsoluteFill>
      <CartoonBackground
        bgColor={isSecondPart ? '#FFF0F5' : '#FFF3B0'}
        accentColor={isSecondPart ? '#FF9EBB' : '#FFB703'}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '130px 60px 140px',
        }}
      >
        <CartoonBubbleText
          text={hookTop}
          delay={4}
          bg="#FFDE59"
          fontSize={62}
          rotate={-2}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: -130,
              transform:
                'scale(' +
                clockPop +
                ') rotate(' +
                Math.sin(frame / 2) * 8 +
                'deg)',
              zIndex: 5,
            }}
          >
            <svg width="210" height="210" viewBox="0 0 210 210">
              <circle
                cx="105"
                cy="105"
                r="85"
                fill="#FFFFFF"
                stroke={STROKE}
                strokeWidth="12"
              />
              <line
                x1="105"
                y1="105"
                x2={105 + Math.cos(frame * 0.4) * 55}
                y2={105 + Math.sin(frame * 0.4) * 55}
                stroke={STROKE}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <line
                x1="105"
                y1="105"
                x2={105 + Math.cos(frame * 0.08) * 40}
                y2={105 + Math.sin(frame * 0.08) * 40}
                stroke="#FF3B30"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <rect
                x="25"
                y="145"
                width="160"
                height="50"
                rx="14"
                fill="#FF3B30"
                stroke={STROKE}
                strokeWidth="8"
              />
              <text
                x="105"
                y="180"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily={FONT}
                fontWeight="900"
                fontSize="32"
              >
                2 JAM?!
              </text>
              <g
                transform={
                  'translate(105, 105) scale(' +
                  crossPop +
                  ') translate(-105, -105)'
                }
              >
                <line
                  x1="35"
                  y1="35"
                  x2="175"
                  y2="175"
                  stroke="#FF1E42"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <line
                  x1="175"
                  y1="35"
                  x2="35"
                  y2="175"
                  stroke="#FF1E42"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {isSecondPart && (
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -120,
                transform: 'scale(' + heartPop + ') rotate(12deg)',
                backgroundColor: '#FF4D8D',
                color: '#FFFFFF',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 36,
                padding: '16px 28px',
                borderRadius: 999,
                border: '8px solid ' + STROKE,
                boxShadow: '8px 10px 0px ' + STROKE,
                zIndex: 6,
              }}
            >
              Nyaman Banget!
            </div>
          )}

          <CartoonCharacter
            mood={isSecondPart ? 'happy' : 'tired'}
            scale={1.15}
          />
        </div>

        <CartoonBubbleText
          text={hookBottom}
          delay={65}
          bg="#72EFDD"
          fontSize={52}
          rotate={2}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneIsi: React.FC<{isiStep1: string; isiStep2: string}> = ({
  isiStep1,
  isiStep2,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bottleEnter = spring({
    frame: frame - 35,
    fps,
    config: {damping: 11, stiffness: 140},
  });

  const isSpraying =
    (frame >= 50 && frame <= 75) || (frame >= 85 && frame <= 115);
  const sprayProgress = interpolate(frame, [50, 120], [0, 1], clamp);

  const badgePop = spring({
    frame: frame - 95,
    fps,
    config: {damping: 9, stiffness: 170},
  });

  return (
    <AbsoluteFill>
      <CartoonBackground bgColor="#E0FBFC" accentColor="#48CAE4" />

      <AbsoluteFill
        style={{

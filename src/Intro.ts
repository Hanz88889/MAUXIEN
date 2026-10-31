import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type Props = {
  hookTop: string;
  hookBottom: string;
  isiStep1: string;
  isiStep2: string;
  ctaLead: string;
  ctaMain: string;
};

const FONT = "'Plus Jakarta Sans', 'Comic Sans MS', 'Chalkboard SE', sans-serif";
const STROKE = '#1E1B2E';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// Background Kartun Pop-Art Dinamis
const CartoonBackground: React.FC<{bgColor: string; accentColor: string}> = ({
  bgColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const offset = (frame * 1.5) % 80;

  return (
    <AbsoluteFill style={{backgroundColor: bgColor, overflow: 'hidden'}}>
      {/* Polkadot bergerak miring */}
      <div
        style={{
          position: 'absolute',
          inset: -160,
          backgroundImage: `radial-gradient(${accentColor} 22%, transparent 23%)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${offset}px ${offset}px`,
          opacity: 0.35,
        }}
      />
      {/* Lingkaran dekoratif mengambang */}
      <div
        style={{
          position: 'absolute',
          top: 120 + Math.sin(frame / 15) * 25,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: accentColor,
          border: `8px solid ${STROKE}`,
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
          border: `8px solid ${STROKE}`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

// Komponen Teks Bergaya Komik / Kartun
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
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        backgroundColor: bg,
        color,
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        padding: '24px 42px',
        borderRadius: 36,
        border: `8px solid ${STROKE}`,
        boxShadow: `12px 14px 0px ${STROKE}`,
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: 920,
      }}
    >
      {text}
    </div>
  );
};

// Karakter Kartun Ekspresif (SVG)
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
        transform: `translateY(${bob}px) scale(${scale})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width="460" height="480" viewBox="0 0 460 480">
        {/* Rambut Belakang */}
        <path
          d="M80 220 C60 100, 400 100, 380 220 C400 320, 390 400, 340 420 L120 420 C70 400, 60 320, 80 220 Z"
          fill="#2D2346"
          stroke={STROKE}
          strokeWidth="12"
        />

        {/* Badan / Baju Cerah */}
        <path
          d="M120 370 C120 330, 340 330, 340 370 L370 470 L90 470 Z"
          fill="#FF6B9E"
          stroke={STROKE}
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* Leher */}
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

        {/* Kepala */}
        <circle
          cx="230"
          cy="220"
          r="115"
          fill="#FFE0C8"
          stroke={STROKE}
          strokeWidth="12"
        />

        {/* Poni Rambut */}
        <path
          d="M115 200 C130 110, 330 110, 345 200 C310 160, 260 180, 230 150 C190 180, 150 160, 115 200 Z"
          fill="#2D2346"
          stroke={STROKE}
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* Pipi Merona */}
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

        {/* Ekspresi Mata & Mulut */}
        {mood === 'tired' && (
          <>
            {/* Mata Lelah / Pusing */}
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
            {/* Kantung Mata */}
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
            {/* Mulut Bergelombang Lelah */}
            <path
              d="M195 280 Q212 265 230 280 T265 280"
              fill="none"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Tetesan Keringat Kartun */}
            <path
              d={`M355 ${140 + sweatY} C355 ${140 + sweatY}, 375 ${170 + sweatY}, 355 ${185 + sweatY} C335 ${170 + sweatY}, 355 ${140 + sweatY}, 355 ${140 + sweatY} Z`}
              fill="#4CC9F0"
              stroke={STROKE}
              strokeWidth="6"
            />
          </>
        )}

        {mood === 'happy' && (
          <>
            {/* Mata Berbinar Bahagia */}
            <circle cx="175" cy="215" r="16" fill={STROKE} />
            <circle cx="170" cy="209" r="6" fill="#FFFFFF" />
            <circle cx="285" cy="215" r="16" fill={STROKE} />
            <circle cx="280" cy="209" r="6" fill="#FFFFFF" />
            {/* Senyum Lebar */}
            <path
              d="M190 260 Q230 310 270 260 Z"
              fill="#FF4D6D"
              stroke={STROKE}
              strokeWidth="10"
              strokeLinejoin="round"
            />
          </>
        )}

        {mood === 'wink' && (
          <>
            {/* Satu Mata Kedip */}
            <path
              d="M155 215 Q175 195 195 215"
              fill="none"
              stroke={STROKE}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="285" cy="215" r="16" fill={STROKE} />
            <circle cx="280" cy="209" r="6" fill="#FFFFFF" />
            {/* Senyum Pede */}
            <path
              d="M195 262 Q235 300 275 258"
              fill="none"
              stroke={STROKE}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};

// ==========================================
// SCENE 1: HOOK (0 - 5 Detik / 150 Frames)
// ==========================================
const SceneHook: React.FC<Props> = ({hookTop, hookBottom}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Animasi Jam Kartun & Tanda Silang
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

  // Pergantian mood dari lelah (2 jam dandan) ke nyaman (dekat orang sekitar)
  const isSecondPart = frame >= 68;

  // Hati melayang di paruh kedua Scene 1
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
        {/* Hook Teks Atas */}
        <CartoonBubbleText
          text={hookTop}
          delay={4}
          bg="#FFDE59"
          fontSize={64}
          rotate={-2}
        />

        {/* Visual Tengah: Jam 2 Jam + Karakter */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Jam Kartun di Samping Kepala */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: -130,
              transform: `scale(${clockPop}) rotate(${Math.sin(frame / 2) * 8}deg)`,
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
              {/* Jarum Jam Berputar Cepat */}
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
              {/* Label 2 JAM! */}
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
              {/* Tanda Silang Besar (X) */}
              <g
                transform={`translate(105, 105) scale(${crossPop}) translate(-105, -105)`}
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

          {/* Aura Hati Nyaman ketika masuk paruh ke-2 */}
          {isSecondPart && (
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -120,
                transform: `scale(${heartPop}) rotate(12deg)`,
                backgroundColor: '#FF4D8D',
                color: '#FFFFFF',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 38,
                padding: '16px 28px',
                borderRadius: 999,
                border: `8px solid ${STROKE}`,
                boxShadow: `8px 10px 0px ${STROKE}`,
                zIndex: 6,
              }}
            >
              Nyaman Banget 💖
            </div>
          )}

          <CartoonCharacter
            mood={isSecondPart ? 'happy' : 'tired'}
            scale={1.15}
          />
        </div>

        {/* Hook Teks Bawah */}
        <CartoonBubbleText
          text={hookBottom}
          delay={65}
          bg="#72EFDD"
          fontSize={54}
          rotate={2}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 2: ISI (5 - 10.5 Detik / 170 Frames)
// ==========================================
const SceneIsi: React.FC<Props> = ({isiStep1, isiStep2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Animasi Botol Semprot Masuk & Menyemprot
  const bottleEnter = spring({
    frame: frame - 35,
    fps,
    config: {damping: 11, stiffness: 140},
  });

  // Efek tekan nozzle semprotan pada frame 55 & 85
  const isSpraying = (frame >= 50 && frame <= 75) || (frame >= 85 && frame <= 115);
  const sprayProgress = interpolate(frame, [50, 120], [0, 1], clamp);

  // Badge "SAT-SET BERES!"
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
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '120px 60px 130px',
        }}
      >
        {/* Step 1: Cukup dandan bentar */}
        <CartoonBubbleText
          text={isiStep1}
          delay={5}
          bg="#FFFFFF"
          fontSize={60}
          rotate={-1.5}
        />

        {/* Area Tengah: Karakter + Botol Semprot Kartun + Partikel Kabut Wangi */}
        <div
          style={{
            position: 'relative',
            width: 900,
            height: 620,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Lingkaran Aura Segar di Belakang Karakter */}
          <div
            style={{
              position: 'absolute',
              width: 520,
              height: 520,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,214,10,0.65) 0%, rgba(114,239,221,0.3) 60%, transparent 75%)',
              transform: `scale(${1 + Math.sin(frame / 5) * 0.08})`,
            }}
          />

          {/* Karakter di sebelah kiri-tengah */}
          <div style={{transform: 'translateX(-70px)'}}>
            <CartoonCharacter mood="happy" scale={1.1} />
          </div>

          {/* Botol Parfum Kartun Menyemprot dari Kanan */}
          <div
            style={{
              position: 'absolute',
              right: 25,
              top: 130,
              transform: `translateX(${interpolate(bottleEnter, [0, 1], [350, 0])}px) rotate(${isSpraying ? -18 : -8}deg) scale(${isSpraying ? 1.08 : 1})`,
            }}
          >
            <svg width="260" height="340" viewBox="0 0 260 340">
              {/* Tutup / Nozzle Semprot */}
              <rect
                x="95"
                y={isSpraying ? 42 : 28}
                width="70"
                height="45"
                rx="12"
                fill="#FFD166"
                stroke={STROKE}
                strokeWidth="10"
              />
              {/* Leher Botol */}
              <rect
                x="80"
                y="65"
                width="100"
                height="35"
                rx="10"
                fill="#FFFFFF"
                stroke={STROKE}
                strokeWidth="10"
              />
              {/* Badan Botol Parfum Cantik */}
              <rect
                x="40"
                y="95"
                width="180"
                height="210"
                rx="48"
                fill="#FF6B9E"
                stroke={STROKE}
                strokeWidth="12"
              />
              {/* Label Hati di Botol */}
              <rect
                x="68"
                y="145"
                width="124"
                height="110"
                rx="24"
                fill="#FFF0F5"
                stroke={STROKE}
                strokeWidth="8"
              />
              <text
                x="130"
                y="215"
                textAnchor="middle"
                fontSize="54"
              >
                💖
              </text>
            </svg>
          </div>

          {/* Efek Semprotan Kabut & Bintang Kartun (Mist Particles) */}
          {frame >= 48 && (
            <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const pProgress = ((frame - 48 + i * 8) % 45) / 45;
                const px = interpolate(pProgress, [0, 1], [620, 260 - i * 25]);
                const py = 240 + Math.sin(i * 2 + frame / 4) * 90;
                const pScale = interpolate(pProgress, [0, 0.5, 1], [0.3, 1.3, 0]);

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: px,
                      top: py,
                      transform: `scale(${pScale})`,
                      fontSize: i % 2 === 0 ? 54 : 44,
                    }}
                  >
                    {i % 2 === 0 ? '✨' : '🌸'}
                  </div>
                );
              })}
            </div>
          )}

          {/* Stiker Pop-up "SAT-SET, BERES!" */}
          <div
            style={{
              position: 'absolute',
              bottom: -15,
              right: 40,
              transform: `scale(${badgePop}) rotate(-6deg)`,
              backgroundColor: '#06D6A0',
              color: '#FFFFFF',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 46,
              padding: '18px 36px',
              borderRadius: 28,
              border: `8px solid ${STROKE}`,
              boxShadow: `10px 12px 0px ${STROKE}`,
              opacity: sprayProgress > 0.2 ? 1 : 0,
            }}
          >
            ⚡ SAT-SET, BERES!
          </div>
        </div>

        {/* Step 2: Semprot ini, sat-set, beres */}
        <CartoonBubbleText
          text={isiStep2}
          delay={45}
          bg="#FFD166"
          fontSize={58}
          rotate={1.5}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 3: CTA LIVE (10.5 - 15 Detik / 140 Frames)
// ==========================================
const SceneCta: React.FC<Props> = ({ctaLead, ctaMain}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const livePop = spring({
    frame: frame - 6,
    fps,
    config: {damping: 10, stiffness: 150},
  });

  const btnPop = spring({
    frame: frame - 24,
    fps,
    config: {damping: 8, stiffness: 160},
  });

  const pulse = 1 + Math.sin(frame / 4) * 0.05;
  const fingerBounce = Math.sin(frame / 3.5) * 18;

  return (
    <AbsoluteFill>
      <CartoonBackground bgColor="#FFE5EC" accentColor="#FF8FAB" />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '120px 60px 150px',
        }}
      >
        {/* Badge Ikon LIVE Kartun Berdenyut */}
        <div
          style={{
            position: 'relative',
            transform: `scale(${livePop * pulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            backgroundColor: '#FF1E42',
            color: '#FFFFFF',
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 900,
            padding: '22px 54px',
            borderRadius: 999,
            border: `8px solid ${STROKE}`,
            boxShadow: `10px 12px 0px ${STROKE}`,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: frame % 16 < 8 ? 1 : 0.25,
            }}
          />
          <span>LIVE SEKARANG</span>
        </div>

        {/* Karakter Mengedipkan Mata + Teks Rahasia */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <CartoonCharacter mood="wink" scale={1.08} />
          <CartoonBubbleText
            text={ctaLead}
            delay={12}
            bg="#FFFFFF"
            fontSize={52}
            rotate={-1}
          />
        </div>

        {/* Tombol CTA Besar + Panah Kartun Menunjuk */}
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
              transform: `scale(${btnPop * pulse})`,
              backgroundColor: '#FFBE0B',
              color: STROKE,
              fontFamily: FONT,
              fontSize: 60,
              fontWeight: 900,
              padding: '34px 60px',
              borderRadius: 999,
              border: `10px solid ${STROKE}`,
              boxShadow: `14px 16px 0px ${STROKE}`,
              textAlign: 'center',
            }}
          >
            {ctaMain}
          </div>

          {/* Tangan Kartun Menunjuk Tombol Live */}
          <div
            style={{
              marginTop: 24,
              fontSize: 88,
              transform: `translateY(${fingerBounce}px)`,
            }}
          >
            👆
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================
// KOMPOSISI UTAMA (Total 450 Frames = 15 Detik)
// ==========================================
export const Intro: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#FFF3B0'}}>
      {/* 0.0s - 5.0s: Hook */}
      <Sequence from={0} durationInFrames={150}>
        <SceneHook {...props} />
      </Sequence>

      {/* 4.8s - 10.5s: Isi (Sat-Set Semprot) */}
      <Sequence from={145} durationInFrames={170}>
        <SceneIsi {...props} />
      </Sequence>

      {/* 10.3s - 15.0s: CTA Kepoin Live */}
      <Sequence from={310} durationInFrames={140}>
        <SceneCta {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
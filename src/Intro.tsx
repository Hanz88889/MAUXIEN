import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  hookA?: string;
  hookB?: string;
  isiA?: string;
  isiB?: string;
  isiC?: string;
  ctaA?: string;
  ctaB?: string;
  showCaptions?: boolean;
};

const C = {
  navy: '#061329',
  navy2: '#0B1D3B',
  blue: '#258BFF',
  cyan: '#54D9FF',
  violet: '#875BFF',
  white: '#F7FAFF',
  muted: '#B8C7DE',
  green: '#65E6B1',
};

const FONT = 'Inter, Manrope, Arial, sans-serif';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const asset = (path: string) => staticFile(`assets/${path}`);

const FadeUp: React.FC<{
  children: React.ReactNode;
  from: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({children, from, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - from - delay,
    fps,
    config: {damping: 16, stiffness: 120, mass: 0.8},
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${(1 - p) * 48}px) scale(${0.96 + p * 0.04})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Backdrop: React.FC<{variant?: 'dark' | 'gradient' | 'platform'}> = ({variant = 'dark'}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 48) * 28;
  const bg =
    variant === 'gradient'
      ? 'bg_gradient.jpg'
      : variant === 'platform'
        ? 'bg_platform.jpg'
        : 'bg_dark_blue.jpg';

  return (
    <AbsoluteFill style={{backgroundColor: C.navy, overflow: 'hidden'}}>
      <Img
        src={asset(`backgrounds/${bg}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          transform: `scale(1.12) translateX(${drift}px)`,
          opacity: 0.76,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,12,29,.34) 0%, rgba(4,12,29,.12) 48%, rgba(4,12,29,.82) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          left: -330,
          top: 260,
          background: 'rgba(37,139,255,.18)',
          filter: 'blur(100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          borderRadius: '50%',
          right: -340,
          bottom: 220,
          background: 'rgba(135,91,255,.18)',
          filter: 'blur(110px)',
        }}
      />
    </AbsoluteFill>
  );
};

const BrandTag: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 82,
      left: 72,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      color: C.white,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 28,
      letterSpacing: 1.5,
    }}
  >
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 20,
        background: C.cyan,
        boxShadow: `0 0 22px ${C.cyan}`,
      }}
    />
    QUORVANTE
    <span style={{fontSize: 15, color: C.muted, fontWeight: 600, letterSpacing: 3}}>
      AI ECOSYSTEM
    </span>
  </div>
);

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 20px',
      border: '1px solid rgba(84,217,255,.42)',
      borderRadius: 100,
      background: 'rgba(17,55,96,.54)',
      color: C.cyan,
      fontFamily: FONT,
      fontSize: 21,
      fontWeight: 800,
      letterSpacing: 3,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{
  lines: string[];
  highlight?: string;
  size?: number;
  align?: 'left' | 'center';
}> = ({lines, highlight, size = 76, align = 'center'}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 900,
      lineHeight: 1.06,
      letterSpacing: -2.5,
      textAlign: align,
      color: C.white,
      textShadow: '0 8px 34px rgba(0,0,0,.35)',
    }}
  >
    {lines.map((line, i) => (
      <div key={i}>
        {highlight && line.includes(highlight) ? (
          <>
            {line.split(highlight)[0]}
            <span
              style={{
                color: C.cyan,
                textShadow: `0 0 28px rgba(84,217,255,.48)`,
              }}
            >
              {highlight}
            </span>
            {line.split(highlight).slice(1).join(highlight)}
          </>
        ) : (
          line
        )}
      </div>
    ))}
  </div>
);

const SceneProblem: React.FC<Props> = ({hookA, hookB, showCaptions = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = frame < 48 ? Math.sin(frame * 2.7) * 5 : 0;
  const ownerIn = spring({frame: frame - 4, fps, config: {damping: 13, stiffness: 110}});
  const boxesIn = spring({frame: frame - 22, fps, config: {damping: 12, stiffness: 130}});
  const zoom = interpolate(frame, [0, 88], [1.04, 1.16], clamp);

  return (
    <AbsoluteFill>
      <Backdrop variant="dark" />
      <BrandTag />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${shake}px) scale(${zoom})`,
        }}
      >
        <Img
          src={asset('characters/owner_stress.png')}
          style={{
            position: 'absolute',
            width: 900,
            left: 80,
            top: 570,
            transform: `translateY(${(1 - ownerIn) * 100}px)`,
            opacity: ownerIn,
            filter: 'drop-shadow(0 28px 45px rgba(0,0,0,.35))',
          }}
        />
        <Img
          src={asset('illustrations/orders_packages.png')}
          style={{
            position: 'absolute',
            width: 570,
            right: -38,
            bottom: 190,
            transform: `translateY(${(1 - boxesIn) * 90}px) rotate(-4deg)`,
            opacity: boxesIn,
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,.4))',
          }}
        />
      </div>

      {showCaptions && (
        <>
          <div style={{position: 'absolute', top: 260, left: 66, right: 66}}>
            <FadeUp from={3}>
              <Kicker>REALITA PEMILIK USAHA</Kicker>
            </FadeUp>
            <FadeUp from={8} delay={3} style={{marginTop: 34}}>
              <Headline
                lines={[hookA || 'Jualan aja', 'udah sibuk?']}
                size={82}
                highlight="sibuk?"
              />
            </FadeUp>
          </div>
          <FadeUp from={48} style={{position: 'absolute', left: 76, right: 76, bottom: 180}}>
            <div
              style={{
                padding: '22px 28px',
                borderRadius: 22,
                background: 'rgba(5,17,39,.82)',
                border: '1px solid rgba(255,255,255,.16)',
                color: C.white,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 34,
                textAlign: 'center',
              }}
            >
              {hookB || 'Pesanan banyak, waktu makin terbatas.'}
            </div>
          </FadeUp>
        </>
      )}
    </AbsoluteFill>
  );
};

const ScenePain: React.FC<Props> = ({isiA, isiB, showCaptions = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shop = spring({frame: frame - 8, fps, config: {damping: 14, stiffness: 120}});
  const content = spring({frame: frame - 42, fps, config: {damping: 12, stiffness: 140}});
  const x = interpolate(frame, [0, 88], [28, -34], clamp);

  return (
    <AbsoluteFill>
      <Backdrop variant="gradient" />
      <BrandTag />
      <div
        style={{
          position: 'absolute',
          top: 390,
          left: 40,
          right: 40,
          transform: `translateX(${x}px)`,
        }}
      >
        <Img
          src={asset('illustrations/shop_store.png')}
          style={{
            width: 660,
            display: 'block',
            margin: '0 auto',
            opacity: shop,
            transform: `scale(${0.85 + shop * 0.15})`,
            filter: 'drop-shadow(0 24px 35px rgba(0,0,0,.35))',
          }}
        />
        <Img
          src={asset('illustrations/content_creation.png')}
          style={{
            width: 570,
            display: 'block',
            margin: '-20px auto 0',
            opacity: content,
            transform: `translateY(${(1 - content) * 70}px)`,
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,.35))',
          }}
        />
      </div>
      {showCaptions && (
        <div style={{position: 'absolute', top: 220, left: 70, right: 70}}>
          <FadeUp from={3}>
            <Headline
              lines={[isiA || 'Masih harus', 'mikirin konten?']}
              size={76}
              highlight="konten?"
            />
          </FadeUp>
          <FadeUp from={48} style={{marginTop: 30, textAlign: 'center'}}>
            <div
              style={{
                color: C.muted,
                fontFamily: FONT,
                fontSize: 29,
                fontWeight: 600,
              }}
            >
              {isiB || 'Ide, desain, sampai materi promosi.'}
            </div>
          </FadeUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneSolution: React.FC<Props> = ({isiC, showCaptions = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const robot = spring({frame: frame - 8, fps, config: {damping: 13, stiffness: 115}});
  const panel = spring({frame: frame - 36, fps, config: {damping: 14, stiffness: 125}});
  const float = Math.sin(frame / 9) * 12;
  const spin = interpolate(frame, [0, 120], [-8, 4], clamp);

  return (
    <AbsoluteFill>
      <Backdrop variant="platform" />
      <BrandTag />
      <div
        style={{
          position: 'absolute',
          top: 390,
          left: 0,
          right: 0,
          height: 850,
        }}
      >
        <Img
          src={asset('illustrations/ai_assistant.png')}
          style={{
            position: 'absolute',
            width: 600,
            left: 0,
            top: 30 + float,
            opacity: robot,
            transform: `translateX(${(1 - robot) * -100}px) rotate(${spin}deg)`,
            filter: 'drop-shadow(0 25px 45px rgba(0,0,0,.35))',
          }}
        />
        <Img
          src={asset('ui-elements/ai_tools_ui.png')}
          style={{
            position: 'absolute',
            width: 650,
            right: -50,
            top: 250 - float,
            opacity: panel,
            transform: `translateX(${(1 - panel) * 110}px) rotate(2deg)`,
            filter: 'drop-shadow(0 25px 45px rgba(0,0,0,.4))',
          }}
        />
        <Img
          src={asset('ui-elements/analytics_dashboard.png')}
          style={{
            position: 'absolute',
            width: 440,
            left: 320,
            top: 590 + float * 0.5,
            opacity: interpolate(frame, [68, 92], [0, 1], clamp),
            transform: `scale(${interpolate(frame, [68, 92], [0.82, 1], clamp)})`,
            filter: 'drop-shadow(0 18px 34px rgba(0,0,0,.38))',
          }}
        />
      </div>
      {showCaptions && (
        <div style={{position: 'absolute', top: 220, left: 64, right: 64}}>
          <FadeUp from={3}>
            <Kicker>INTRODUCING QUORVANTE</Kicker>
          </FadeUp>
          <FadeUp from={12} delay={2} style={{marginTop: 30}}>
            <Headline
              lines={['Sekarang,', isiC || 'manfaatkan kekuatan AI!']}
              size={72}
              highlight="AI!"
            />
          </FadeUp>
          <FadeUp from={75} style={{marginTop: 26, textAlign: 'center'}}>
            <div
              style={{
                color: C.muted,
                fontFamily: FONT,
                fontSize: 27,
                fontWeight: 600,
              }}
            >
              Ide • Visual • Konten • Produktivitas
            </div>
          </FadeUp>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC<Props> = ({ctaA, ctaB, showCaptions = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame: frame - 8, fps, config: {damping: 12, stiffness: 120}});
  const buttonIn = spring({frame: frame - 54, fps, config: {damping: 10, stiffness: 145}});
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  const glow = 0.45 + (Math.sin(frame / 8) + 1) * 0.18;

  return (
    <AbsoluteFill>
      <Backdrop variant="dark" />
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          left: 140,
          top: 390,
          background: `rgba(37,139,255,${glow * 0.22})`,
          filter: 'blur(100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${logoIn})`,
          opacity: logoIn,
        }}
      >
        <Img
          src={asset('illustrations/quorvante_logo_lockup.png')}
          style={{
            width: 900,
            maxHeight: 360,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 34px rgba(84,217,255,.3))',
          }}
        />
      </div>
      {showCaptions && (
        <>
          <FadeUp from={26} style={{position: 'absolute', top: 850, left: 70, right: 70}}>
            <Headline
              lines={[ctaA || 'Bisnis jalan.', 'Konten makin mudah.']}
              size={66}
              highlight="mudah."
            />
          </FadeUp>
          <div
            style={{
              position: 'absolute',
              left: 125,
              right: 125,
              bottom: 300,
              transform: `scale(${buttonIn * pulse})`,
              opacity: buttonIn,
            }}
          >
            <div
              style={{
                padding: '27px 20px',
                borderRadius: 22,
                textAlign: 'center',
                background: 'linear-gradient(100deg, #247BFF, #7357F5)',
                border: '1px solid rgba(255,255,255,.45)',
                boxShadow: '0 0 45px rgba(37,139,255,.42)',
                color: C.white,
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 1.5,
              }}
            >
              {ctaB || 'KENALAN DENGAN QUORVANTE'}
            </div>
            <div
              style={{
                textAlign: 'center',
                color: C.muted,
                fontFamily: FONT,
                fontSize: 20,
                marginTop: 20,
                letterSpacing: 3,
                fontWeight: 700,
              }}
            >
              AI BUSINESS ECOSYSTEM
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at - 9 || frame > at + 9) return null;
  const x =
    frame <= at
      ? interpolate(frame, [at - 9, at], [-1080, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(frame, [at, at + 9], [0, 1080], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, #247BFF 0%, #54D9FF 72%, #875BFF 100%)',
        transform: `translateX(${x}px)`,
      }}
    />
  );
};

export const Intro: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: C.navy, fontFamily: FONT, overflow: 'hidden'}}>
      <Sequence from={0} durationInFrames={90}>
        <SceneProblem {...props} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <ScenePain {...props} />
      </Sequence>
      <Sequence from={180} durationInFrames={150}>
        <SceneSolution {...props} />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <SceneCTA {...props} />
      </Sequence>
      <Wipe at={90} />
      <Wipe at={180} />
      <Wipe at={330} />
    </AbsoluteFill>
  );
};

export default Intro;

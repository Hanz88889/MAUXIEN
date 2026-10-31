import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  kicker: string;
  hookTop: string;
  hookBottom: string;
  brand: string;
  tagline: string;
  valueTitle: string;
  points: string[];
  ctaLead: string;
  ctaMain: string;
};

const GOLD = '#E9B949';
const GOLD_DEEP = '#B98A24';
const SILVER = '#C9CFD8';
const BLUE = '#2A63FF';
const WHITE = '#F4F6FA';
const BASE = '#05060A';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const useFade = (duration: number, fadeIn: number, fadeOut: number) => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    clamp
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const gx = 20 + Math.sin(t * 0.6) * 12;
  const gy = 18 + Math.cos(t * 0.5) * 8;
  const bx = 80 + Math.cos(t * 0.5) * 12;
  const by = 82 + Math.sin(t * 0.7) * 8;
  const palette = [GOLD, SILVER, BLUE];

  const dots = new Array(30).fill(0).map((_, i) => {
    const size = 3 + random('s' + i) * 6;
    const speed = 25 + random('v' + i) * 55;
    const x = random('x' + i) * width;
    const startY = random('y' + i) * height;
    const y = (((startY - speed * t) % height) + height) % height;
    const opacity = 0.2 + 0.5 * Math.abs(Math.sin(t * 1.2 + i));
    const color = palette[i % 3];
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity,
          boxShadow: '0 0 ' + size * 3 + 'px ' + color,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{backgroundColor: BASE}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at ' +
            gx +
            '% ' +
            gy +
            '%, rgba(233,185,73,0.22), transparent 45%), radial-gradient(circle at ' +
            bx +
            '% ' +
            by +
            '%, rgba(42,99,255,0.26), transparent 50%)',
        }}
      />
      {dots}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const MaskWord: React.FC<{
  text: string;
  delay: number;
  size: number;
  color: string;
}> = ({text, delay, size, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 120},
  });
  const y = interpolate(p, [0, 1], [115, 0]);
  return (
    <div style={{overflow: 'hidden', height: size * 1.22}}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          lineHeight: 1.22,
          fontWeight: 800,
          color,
          letterSpacing: -2,
          whiteSpace: 'nowrap',
          transform: 'translateY(' + y + '%)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const MaskLine: React.FC<{
  text: string;
  startDelay: number;
  size: number;
  color: string;
  gap?: number;
  center?: boolean;
}> = ({text, startDelay, size, color, gap = 26, center = false}) => {
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: gap,
        justifyContent: center ? 'center' : 'flex-start',
      }}
    >
      {words.map((w, i) => (
        <MaskWord
          key={i}
          text={w}
          delay={startDelay + i * 6}
          size={size}
          color={color}
        />
      ))}
    </div>
  );
};

const TopLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 230,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <Img
        src={staticFile('logo.png')}
        style={{width: 200, height: 200, filter: 'url(#lumaKey)'}}
      />
    </div>
  );
};

const SceneHook: React.FC<Props & {duration: number}> = ({
  kicker,
  hookTop,
  hookBottom,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = useFade(duration, 4, 12);
  const kickerOpacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const lineW = interpolate(frame, [30, 70], [0, 300], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{opacity, padding: '0 90px', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 34,
          letterSpacing: 10,
          fontWeight: 700,
          color: SILVER,
          opacity: kickerOpacity,
          marginBottom: 44,
        }}
      >
        {kicker}
      </div>
      <MaskLine text={hookTop} startDelay={6} size={112} color={WHITE} />
      <div style={{height: 28}} />
      <MaskLine text={hookBottom} startDelay={30} size={112} color={GOLD} />
      <div
        style={{
          height: 14,
          width: lineW,
          backgroundColor: BLUE,
          marginTop: 52,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneLogo: React.FC<Props & {duration: number}> = ({
  brand,
  tagline,
  duration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = useFade(duration, 4, 12);
  const p = spring({frame, fps, config: {damping: 13, stiffness: 90}});
  const scale = interpolate(p, [0, 1], [0.55, 1]);
  const blur = interpolate(frame, [0, 24], [22, 0], clamp);
  const float = Math.sin(frame / 18) * 10;
  const glowScale = 1 + 0.06 * Math.sin(frame / 14);
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const tagOpacity = interpolate(frame, [48, 68], [0, 1], clamp);
  const brandY = interpolate(
    spring({frame: frame - 26, fps, config: {damping: 16, stiffness: 120}}),
    [0, 1],
    [115, 0]
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
      }}
    >
      <div style={{position: 'relative', width: 640, height: 640}}>
        <div
          style={{
            position: 'absolute',
            left: -230,
            top: -230,
            width: 1100,
            height: 1100,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(42,99,255,0.35), rgba(233,185,73,0.12) 45%, transparent 70%)',
            transform: 'scale(' + glowScale + ')',
            opacity: logoOpacity,
          }}
        />
        <Img
          src={staticFile('logo.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 640,
            height: 640,
            opacity: logoOpacity,
            filter: 'url(#lumaKey) blur(' + blur + 'px)',
            transform: 'translateY(' + float + 'px) scale(' + scale + ')',
          }}
        />
      </div>
      <div style={{height: 50}} />
      <div style={{overflow: 'hidden', height: 100}}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 70,
            lineHeight: '100px',
            fontWeight: 800,
            letterSpacing: 20,
            paddingLeft: 20,
            background: 'linear-gradient(90deg, ' + GOLD + ', ' + SILVER + ')',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'translateY(' + brandY + '%)',
          }}
        >
          {brand}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 38,
          fontWeight: 500,
          color: SILVER,
          opacity: tagOpacity,
          marginTop: 8,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

const PointRow: React.FC<{index: number; text: string; delay: number}> = ({
  index,
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 110},
  });
  const x = interpolate(p, [0, 1], [-80, 0]);
  const o = interpolate(p, [0, 1], [0, 1]);
  return (
    <div
      style={{
        opacity: o,
        transform: 'translateX(' + x + 'px)',
        display: 'flex',
        alignItems: 'center',
        padding: '26px 0',
        borderBottom: '2px solid rgba(201,207,216,0.25)',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 800,
          color: GOLD,
          width: 100,
        }}
      >
        {'0' + (index + 1)}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 600,
          color: WHITE,
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ScenePoints: React.FC<Props & {duration: number}> = ({
  valueTitle,
  points,
  duration,
}) => {
  const opacity = useFade(duration, 6, 12);
  return (
    <AbsoluteFill style={{opacity}}>
      <TopLogo />
      <div style={{position: 'absolute', left: 90, right: 90, top: 560}}>
        <MaskLine
          text={valueTitle}
          startDelay={4}
          size={84}
          color={WHITE}
          gap={22}
        />
        <div style={{height: 56}} />
        {points.map((pt, i) => (
          <PointRow key={i} index={i} text={pt} delay={30 + i * 14} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneCta: React.FC<Props & {duration: number}> = ({
  ctaLead,
  ctaMain,
  brand,
  duration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = useFade(duration, 6, 10);
  const pop = spring({
    frame: frame - 22,
    fps,
    config: {damping: 10, stiffness: 140},
  });
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const pillScale = interpolate(pop, [0, 1], [0.4, 1]) * pulse;
  const pillOpacity = interpolate(pop, [0, 1], [0, 1], clamp);
  const ring = (frame % 45) / 45;
  const ringScale = 1 + ring * 0.35;
  const ringOpacity = frame > 22 ? 0.6 * (1 - ring) : 0;
  const brandOpacity = interpolate(frame, [50, 70], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity}}>
      <TopLogo />
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MaskLine
          text={ctaLead}
          startDelay={4}
          size={64}
          color={WHITE}
          gap={20}
          center
        />
        <div style={{height: 70}} />
        <div style={{position: 'relative'}}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 999,
              border: '4px solid ' + GOLD,
              opacity: ringOpacity,
              transform: 'scale(' + ringScale + ')',
            }}
          />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: 1,
              color: '#0A0A0A',
              whiteSpace: 'nowrap',
              padding: '30px 54px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg, #F6D27A, ' + GOLD + ' 50%, ' + GOLD_DEEP + ')',
              boxShadow: '0 0 60px rgba(233,185,73,0.45)',
              opacity: pillOpacity,
              transform: 'scale(' + pillScale + ')',
            }}
          >
            {ctaMain}
          </div>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 14,
            color: SILVER,
            marginTop: 80,
            opacity: brandOpacity,
          }}
        >
          {brand}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Intro: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: BASE}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="lumaKey" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1.8 1.8 1.8 0 -0.25"
          />
        </filter>
      </svg>
      <Background />
      <Sequence from={0} durationInFrames={100}>
        <SceneHook {...props} duration={100} />
      </Sequence>
      <Sequence from={90} durationInFrames={130}>
        <SceneLogo {...props} duration={130} />
      </Sequence>
      <Sequence from={210} durationInFrames={130}>
        <ScenePoints {...props} duration={130} />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <SceneCta {...props} duration={120} />
      </Sequence>
    </AbsoluteFill>
  );
};

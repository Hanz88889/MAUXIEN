import React from 'react';
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadSans} from '@remotion/google-fonts/PlusJakartaSans';

export type Word = {
  text: string;
  startMs: number;
  endMs: number;
  hl?: boolean;
};

export type Callout = {
  text: string;
  x: number;
  y: number;
  direction?: 'down' | 'left' | 'right';
};

export type Segment = {
  startMs: number;
  endMs: number;
  words: Word[];
  kicker: string | null;
  zoomFrom: number;
  zoomTo: number;
  transition: 'none' | 'cut' | 'wipe' | 'flash';
  callout?: Callout;
};

export type Timeline = {
  videoFile: string;
  fps: number;
  durationSec: number;
  title: string;
  frame: 'editorial' | 'none';
  theme: {accent: string; text: string};
  zones: {
    topY: number;
    topH: number;
    lowerY: number;
    lowerH: number;
    leftX: number;
    maxW: number;
    faceCenterY: number;
  };
  segments: Segment[];
};

export type TalkingHeadProps = {
  name: string;
  timeline: Timeline | null;
};

const {fontFamily: serif} = loadFont('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
loadFont('italic', {weights: ['400'], subsets: ['latin']});

const {fontFamily: sans} = loadSans('normal', {
  weights: ['600', '800'],
  subsets: ['latin'],
});

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const toFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const calculateTalkingHeadMetadata: CalculateMetadataFunction<
  TalkingHeadProps
> = async ({props}) => {
  const res = await fetch(staticFile(`data/${props.name}.timeline.json`));
  if (!res.ok) {
    throw new Error(`Timeline tidak ditemukan untuk video: ${props.name}`);
  }
  const timeline = (await res.json()) as Timeline;
  return {
    durationInFrames: Math.max(1, Math.ceil(timeline.durationSec * timeline.fps)),
    fps: timeline.fps,
    props: {...props, timeline},
  };
};

// LAYER 1: Video Asli 100% Untouched Pixels, hanya camera scale halus
const VideoLayer: React.FC<{t: Timeline}> = ({t}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let active: Segment | null = null;
  for (const s of t.segments) {
    if (toFrame(s.startMs, fps) <= frame) active = s;
  }

  let scale = 1;
  if (active) {
    const a = toFrame(active.startMs, fps);
    const b = Math.max(a + 1, toFrame(active.endMs, fps));
    const p = interpolate(frame, [a, b], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    });
    scale = active.zoomFrom + (active.zoomTo - active.zoomFrom) * p;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `50% ${t.zones.faceCenterY}%`,
      }}
    >
      <OffthreadVideo
        src={staticFile(`videos/${t.videoFile}`)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </AbsoluteFill>
  );
};

// LAYER 2: Gradient Scrim di batas paling atas & bawah (Area produk di tengah 100% bebas gradasi)
const Scrims: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to top, rgba(8,10,18,0.88) 0%, rgba(8,10,18,0.45) 22%, rgba(8,10,18,0) 36%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to bottom, rgba(8,10,18,0.65) 0%, rgba(8,10,18,0) 20%)',
      }}
    />
  </>
);

// LAYER 3: Tipografi Bawah dengan Highlight Pill Dinamis
const LowerCaption: React.FC<{
  seg: Segment;
  t: Timeline;
  baseFrame: number;
  dur: number;
}> = ({seg, t, baseFrame, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = seg.words.reduce((n, w) => n + w.text.length + 1, 0);
  const size = chars > 44 ? 82 : 94;
  const fadeOut = interpolate(frame, [dur - 6, dur], [1, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: t.zones.leftX,
        top: t.zones.lowerY,
        width: t.zones.maxW,
        height: t.zones.lowerH,
        display: 'flex',
        alignItems: 'flex-end',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          columnGap: size * 0.22,
          rowGap: size * 0.12,
          fontFamily: serif,
          fontSize: size,
          lineHeight: 1.05,
          color: t.theme.text,
          textShadow: '0 6px 28px rgba(0,0,0,0.65)',
        }}
      >
        {seg.words.map((w, i) => {
          const local = toFrame(w.startMs, fps) - baseFrame;
          const p = spring({
            frame: frame - local,
            fps,
            config: {damping: 16, stiffness: 190, mass: 0.65},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${(1 - p) * 28}px) scale(${0.92 + 0.08 * p})`,
                fontStyle: w.hl ? 'italic' : 'normal',
                color: w.hl ? '#0B0D13' : t.theme.text,
                backgroundColor: w.hl ? t.theme.accent : 'transparent',
                padding: w.hl ? '2px 18px 8px 18px' : '0px',
                borderRadius: w.hl ? 14 : 0,
                fontSize: w.hl ? size * 1.06 : size,
                boxShadow: w.hl ? '0 8px 24px rgba(245, 197, 66, 0.35)' : 'none',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// LAYER 4: Editorial Kicker di Bagian Atas
const TopKeyword: React.FC<{
  word: string;
  t: Timeline;
  dur: number;
}> = ({word, t, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const size = Math.max(
    86,
    Math.min(150, Math.floor(880 / (Math.max(word.length, 1) * 0.5))),
  );
  const inP = spring({
    frame: frame - 2,
    fps,
    config: {damping: 18, stiffness: 160, mass: 0.8},
  });
  const outP = interpolate(frame, [dur - 8, dur], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const shift = (1 - inP) * 100 - outP * 100;

  return (
    <div
      style={{
        position: 'absolute',
        left: t.zones.leftX,
        top: t.zones.topY,
        width: t.zones.maxW,
        height: t.zones.topH,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{overflow: 'hidden', height: size * 1.25}}>
        <div
          style={{
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: size,
            lineHeight: 1.1,
            color: t.theme.accent,
            textShadow: '0 6px 28px rgba(0,0,0,0.55)',
            transform: `translateY(${shift}%)`,
          }}
        >
          {word}
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 5,
          width: 180,
          backgroundColor: t.theme.accent,
          transformOrigin: 'left center',
          transform: `scaleX(${inP * (1 - outP)})`,
        }}
      />
    </div>
  );
};

// LAYER 5: Callout Badge & Panah Animasi (Menunjuk produk/keranjang tanpa menyentuh area produk)
const FloatingCallout: React.FC<{
  callout: Callout;
  t: Timeline;
  dur: number;
}> = ({callout, t, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 6,
    fps,
    config: {damping: 14, stiffness: 180, mass: 0.6},
  });
  const exit = interpolate(frame, [dur - 7, dur], [1, 0], clamp);
  const bounce = Math.sin(frame / 4) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        left: callout.x,
        top: callout.y + bounce,
        opacity: enter * exit,
        transform: `scale(${enter})`,
        transformOrigin: 'left center',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(12, 14, 22, 0.88)',
        border: `2px solid ${t.theme.accent}`,
        borderRadius: 999,
        padding: '12px 24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: t.theme.accent,
          display: 'inline-block',
        }}
      />
      <span
        style={{
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 1.2,
          color: t.theme.text,
        }}
      >
        {callout.text}
      </span>
      <span style={{fontSize: 28, color: t.theme.accent, fontWeight: 800}}>
        {callout.direction === 'down' ? '↓' : callout.direction === 'left' ? '←' : '→'}
      </span>
    </div>
  );
};

// LAYER 6: Bingkai Editorial + Indikator LIVE
const EditorialFrame: React.FC<{t: Timeline}> = ({t}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const draw = interpolate(frame, [0, 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const labelIn = interpolate(frame, [15, 35], [0, 1], clamp);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
  const m = 36;

  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect
          x={m}
          y={m}
          width={width - 2 * m}
          height={height - 2 * m}
          fill="none"
          stroke={t.theme.text}
          strokeOpacity={0.45}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
      {t.title ? (
        <div
          style={{
            position: 'absolute',
            left: m + 28,
            top: m + 22,
            right: m + 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: labelIn,
          }}
        >
          <div
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 2,
              color: t.theme.text,
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            {t.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(220, 38, 38, 0.9)',
              padding: '6px 16px',
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: pulse,
              }}
            />
            <span
              style={{
                fontFamily: sans,
                fontWeight: 800,
                fontSize: 20,
                color: '#FFFFFF',
                letterSpacing: 1.5,
              }}
            >
              LIVE PROMO
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// LAYER 7: Transisi Halus di Luar Area Produk
const TransitionFx: React.FC<{kind: 'wipe' | 'flash'; color: string}> = ({
  kind,
  color,
}) => {
  const frame = useCurrentFrame();

  if (kind === 'flash') {
    const o = interpolate(frame, [0, 2, 8], [0, 0.35, 0], clamp);
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0) 35%, ${color} 100%)`,
          opacity: o,
        }}
      />
    );
  }

  const x =
    frame < 6
      ? interpolate(frame, [0, 6], [-100, 0], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        })
      : interpolate(frame, [6, 12], [0, 100], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity: 0.18,
        transform: `translateX(${x}%)`,
      }}
    />
  );
};

export const TalkingHead: React.FC<TalkingHeadProps> = ({timeline}) => {
  const {fps} = useVideoConfig();

  if (!timeline) {
    return <AbsoluteFill style={{backgroundColor: '#000000'}} />;
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <VideoLayer t={timeline} />
      <Scrims />

      {timeline.segments.map((seg, i) => {
        const from = toFrame(seg.startMs, fps);
        const dur = Math.max(6, toFrame(seg.endMs, fps) - from);
        return (
          <Sequence key={`seg-${i}`} from={from} durationInFrames={dur}>
            <LowerCaption seg={seg} t={timeline} baseFrame={from} dur={dur} />
            {seg.kicker ? (
              <TopKeyword word={seg.kicker} t={timeline} dur={dur} />
            ) : null}
            {seg.callout ? (
              <FloatingCallout callout={seg.callout} t={timeline} dur={dur} />
            ) : null}
          </Sequence>
        );
      })}

      {timeline.frame === 'editorial' ? <EditorialFrame t={timeline} /> : null}

      {timeline.segments.map((seg, i) => {
        const at = toFrame(seg.startMs, fps);
        if (seg.transition === 'wipe' && at - 6 >= 0) {
          return (
            <Sequence key={`fx-${i}`} from={at - 6} durationInFrames={12}>
              <TransitionFx kind="wipe" color={timeline.theme.accent} />
            </Sequence>
          );
        }
        if (seg.transition === 'flash' && at - 2 >= 0) {
          return (
            <Sequence key={`fx-${i}`} from={at - 2} durationInFrames={8}>
              <TransitionFx kind="flash" color={timeline.theme.accent} />
            </Sequence>
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};
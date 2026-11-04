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

export type Word = {
  text: string;
  startMs: number;
  endMs: number;
  hl?: boolean;
};

export type Segment = {
  startMs: number;
  endMs: number;
  words: Word[];
  kicker: string | null;
  zoomFrom: number;
  zoomTo: number;
  transition: 'none' | 'cut' | 'wipe' | 'flash';
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

const Scrims: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to top, rgba(8,10,18,0.78) 0%, rgba(8,10,18,0.35) 28%, rgba(8,10,18,0) 48%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to bottom, rgba(8,10,18,0.55) 0%, rgba(8,10,18,0) 24%)',
      }}
    />
  </>
);

const LowerCaption: React.FC<{
  seg: Segment;
  t: Timeline;
  baseFrame: number;
  dur: number;
}> = ({seg, t, baseFrame, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = seg.words.reduce((n, w) => n + w.text.length + 1, 0);
  const size = chars > 44 ? 88 : 100;
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
          columnGap: size * 0.24,
          rowGap: size * 0.02,
          fontFamily: serif,
          fontSize: size,
          lineHeight: 1.02,
          color: t.theme.text,
          textShadow: '0 6px 28px rgba(0,0,0,0.5)',
        }}
      >
        {seg.words.map((w, i) => {
          const local = toFrame(w.startMs, fps) - baseFrame;
          const p = spring({
            frame: frame - local,
            fps,
            config: {damping: 18, stiffness: 170, mass: 0.7},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
                fontStyle: w.hl ? 'italic' : 'normal',
                color: w.hl ? t.theme.accent : t.theme.text,
                fontSize: w.hl ? size * 1.1 : size,
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

const TopKeyword: React.FC<{
  word: string;
  t: Timeline;
  dur: number;
}> = ({word, t, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const size = Math.max(
    96,
    Math.min(200, Math.floor(880 / (Math.max(word.length, 1) * 0.46))),
  );
  const inP = spring({
    frame: frame - 2,
    fps,
    config: {damping: 20, stiffness: 150, mass: 0.8},
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
        width: t.zones.maxW + 100,
        height: t.zones.topH,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{overflow: 'hidden', height: size * 1.2}}>
        <div
          style={{
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: size,
            lineHeight: 1.1,
            color: t.theme.accent,
            textShadow: '0 6px 28px rgba(0,0,0,0.45)',
            transform: `translateY(${shift}%)`,
          }}
        >
          {word}
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          height: 5,
          width: 168,
          backgroundColor: t.theme.accent,
          transformOrigin: 'left center',
          transform: `scaleX(${inP * (1 - outP)})`,
        }}
      />
    </div>
  );
};

const EditorialFrame: React.FC<{t: Timeline}> = ({t}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const draw = interpolate(frame, [0, 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const labelIn = interpolate(frame, [20, 40], [0, 1], clamp);
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
          strokeOpacity={0.5}
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
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: 34,
            color: t.theme.text,
            opacity: labelIn * 0.9,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {t.title}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const TransitionFx: React.FC<{kind: 'wipe' | 'flash'; color: string}> = ({
  kind,
  color,
}) => {
  const frame = useCurrentFrame();

  if (kind === 'flash') {
    const o = interpolate(frame, [0, 2, 9], [0, 0.85, 0], clamp);
    return <AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: o}} />;
  }

  const x =
    frame < 8
      ? interpolate(frame, [0, 8], [-100, 0], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        })
      : interpolate(frame, [8, 15], [0, 100], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });

  return (
    <AbsoluteFill
      style={{backgroundColor: color, transform: `translateX(${x}%)`}}
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
          </Sequence>
        );
      })}

      {timeline.frame === 'editorial' ? <EditorialFrame t={timeline} /> : null}

      {timeline.segments.map((seg, i) => {
        const at = toFrame(seg.startMs, fps);
        if (seg.transition === 'wipe' && at - 8 >= 0) {
          return (
            <Sequence key={`fx-${i}`} from={at - 8} durationInFrames={16}>
              <TransitionFx kind="wipe" color={timeline.theme.accent} />
            </Sequence>
          );
        }
        if (seg.transition === 'flash' && at - 2 >= 0) {
          return (
            <Sequence key={`fx-${i}`} from={at - 2} durationInFrames={10}>
              <TransitionFx kind="flash" color="#FFFFFF" />
            </Sequence>
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};

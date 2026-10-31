import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  title: string;
  subtitle: string;
};

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const Intro: React.FC<Props> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const words = title.split(' ');

  const barWidth = interpolate(frame, [30, 70], [0, 420], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const subtitleOpacity = interpolate(frame, [70, 95], [0, 1], clamp);
  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    clamp
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1F3BFF',
        padding: 96,
        justifyContent: 'center',
        opacity: exit,
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <div>
        {words.map((word, i) => {
          const progress = spring({
            frame: frame - i * 8,
            fps,
            config: {damping: 16, stiffness: 120},
          });
          const y = interpolate(progress, [0, 1], [100, 0]);
          return (
            <div key={i} style={{overflow: 'hidden', height: 190}}>
              <div
                style={{
                  fontSize: 160,
                  fontWeight: 900,
                  lineHeight: '190px',
                  letterSpacing: -4,
                  color: '#F5F7FF',
                  transform: `translateY(${y}%)`,
                }}
              >
                {word}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          height: 14,
          width: barWidth,
          backgroundColor: '#FFD23F',
          marginTop: 48,
        }}
      />
      <div
        style={{
          marginTop: 40,
          fontSize: 52,
          lineHeight: 1.3,
          maxWidth: 800,
          color: '#F5F7FF',
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

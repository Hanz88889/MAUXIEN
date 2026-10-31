import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './Intro';

export const Root: React.FC = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        hookA: 'Gak perlu dandan *2 jam*',
        hookB: 'biar orang di sekitar nyaman dekat kamu',
        isiA: 'Cukup dandan bentar',
        isiB: 'Semprot ini',
        isiC: 'Sat-set, beres!',
        ctaA: 'Kepoin *live-nya*',
        ctaB: 'kalau mau tau rahasianya',
        showCaptions: true,
      }}
    />
  );
};

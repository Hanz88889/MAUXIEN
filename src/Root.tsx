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
        hookTop: 'Gak perlu dandan 2 jam',
        hookBottom: 'biar orang disekitar nyaman dekat kamu!',
        isiStep1: 'Cukup dandan bentar ✨',
        isiStep2: 'Semprot ini... Sat-set, beres! 💨',
        ctaLead: 'Kalau mau tau rahasianya...',
        ctaMain: 'KEPOIN LIVE-NYA SEKARANG!',
      }}
    />
  );
};
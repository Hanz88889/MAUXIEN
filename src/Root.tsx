import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './Intro';

export const Root: React.FC = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'VIDEO PERTAMA',
        subtitle: 'Dibuat dengan Claude dan Remotion',
      }}
    />
  );
};

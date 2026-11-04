import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './Intro';
import {
  TalkingHead,
  TalkingHeadProps,
  calculateTalkingHeadMetadata,
} from './TalkingHead';

const talkingHeadDefaults: TalkingHeadProps = {
  name: 'sample',
  timeline: null,
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hookA: 'Jualan aja',
          hookB: 'Pesanan banyak, waktu makin terbatas.',
          isiA: 'Masih harus',
          isiB: 'Ide, desain, sampai materi promosi.',
          isiC: 'manfaatkan kekuatan AI!',
          ctaA: 'Bisnis jalan.',
          ctaB: 'KENALAN DENGAN QUORVANTE',
          showCaptions: true,
        }}
      />
      <Composition
        id="TalkingHead"
        component={TalkingHead}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={talkingHeadDefaults}
        calculateMetadata={calculateTalkingHeadMetadata}
      />
    </>
  );
};

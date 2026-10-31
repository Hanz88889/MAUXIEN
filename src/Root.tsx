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
        kicker: 'AI UNTUK INDONESIA',
        hookTop: 'Semua orang bicara AI.',
        hookBottom: 'Yang beneran kepakai?',
        brand: 'QUORVANTE',
        tagline: 'Ekosistem AI buatan Indonesia',
        valueTitle: 'AI yang pas buat kerja kamu',
        points: [
          'Ide jadi hasil lebih cepat',
          'Praktis dipakai dari HP',
          'Dibuat untuk pasar Indonesia',
        ],
        ctaLead: 'Yang mau liat produknya',
        ctaMain: 'LINK ADA DI BIO',
      }}
    />
  );
};

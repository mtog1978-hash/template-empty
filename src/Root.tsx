import React from 'react';
import { Composition } from 'remotion';
import { ShortFilm } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChipYLaEstrellaVertical"
        component={ShortFilm}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

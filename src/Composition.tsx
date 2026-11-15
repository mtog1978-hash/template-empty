import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999.13) * 10000;
  return x - Math.floor(x);
};

/* Cielo estrellado, luna y luciérnagas (9:16) */
const StarrySky: React.FC<{ globalFrameOffset?: number }> = ({
  globalFrameOffset = 0,
}) => {
  const localFrame = useCurrentFrame();
  const frame = localFrame + globalFrameOffset;

  const stars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => ({
      x: seededRandom(i + 1) * 1080,
      y: seededRandom(i + 101) * 1350,
      r: 1.5 + seededRandom(i + 201) * 2.8,
      speed: 0.04 + seededRandom(i + 301) * 0.08,
      phase: seededRandom(i + 401) * Math.PI * 2,
    }));
  }, []);

  const fireflies = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      baseX: seededRandom(i + 501) * 1080,
      baseY: 1180 + seededRandom(i + 601) * 580,
      radius: 2.5 + seededRandom(i + 701) * 3.5,
      speedX: 0.02 + seededRandom(i + 801) * 0.03,
      speedY: 0.03 + seededRandom(i + 901) * 0.04,
      phase: seededRandom(i + 1001) * Math.PI * 2,
    }));
  }, []);

  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070B19" />
            <stop offset="58%" stopColor="#121D3D" />
            <stop offset="100%" stopColor="#263159" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFF7D6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#skyGrad)" />

        {stars.map((s, idx) => {
          const opacity =
            0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase));
          return (
            <circle
              key={idx}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#FFFFFF"
              opacity={opacity}
            />
          );
        })}

        <g transform="translate(830, 290)">
          <circle cx="0" cy="0" r="145" fill="url(#moonGlow)" />
          <mask id="crescentMask">
            <rect x="-80" y="-80" width="160" height="160" fill="white" />
            <circle cx="28" cy="-16" r="56" fill="black" />
          </mask>
          <circle
            cx="0"
            cy="0"
            r="64"
            fill="#FFF5C0"
            mask="url(#crescentMask)"
          />
        </g>

        {fireflies.map((f, idx) => {
          const x = f.baseX + Math.sin(frame * f.speedX + f.phase) * 30;
          const y = f.baseY + Math.cos(frame * f.speedY + f.phase) * 20;
          const opacity =
            0.2 + 0.8 * (0.5 + 0.5 * Math.sin(frame * 0.09 + f.phase));
          return (
            <g key={idx} opacity={opacity}>
              <circle
                cx={x}
                cy={y}
                r={f.radius * 3.5}
                fill="#A7F3D0"
                opacity={0.22}
              />
              <circle cx={x} cy={y} r={f.radius} fill="#D1FAE5" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* Personaje Robot Chip */
const RobotChip: React.FC<{
  x: number;
  y: number;
  scale?: number;
  isWalking?: boolean;
  expression?: 'neutral' | 'surprised' | 'happy';
  lookDirection?: 'forward' | 'right' | 'up';
  antennaIntensity?: number;
  armRaise?: number;
}> = ({
  x,
  y,
  scale = 1,
  isWalking = false,
  expression = 'neutral',
  lookDirection = 'forward',
  antennaIntensity = 0.5,
  armRaise = 0,
}) => {
  const frame = useCurrentFrame();

  const walkPhase = frame * 0.35;
  const bounceY = isWalking
    ? Math.abs(Math.sin(walkPhase)) * -12
    : Math.sin(frame * 0.08) * 2;
  const bodyTilt = isWalking ? Math.sin(walkPhase) * 3.5 : 0;
  const leftLegOffset = isWalking ? Math.sin(walkPhase) * 14 : 0;
  const rightLegOffset = isWalking ? Math.sin(walkPhase + Math.PI) * 14 : 0;

  const blinkCycle = frame % 95;
  const isBlinking =
    blinkCycle >= 90 && blinkCycle <= 94 && expression === 'neutral';

  const pupilDx = lookDirection === 'right' ? 6 : 0;
  const pupilDy = lookDirection === 'up' ? -6 : 0;
  const antennaPulse = 0.7 + 0.3 * Math.sin(frame * 0.25);

  return (
    <g
      transform={`translate(${x}, ${y + bounceY}) scale(${scale}) rotate(${bodyTilt})`}
    >
      <ellipse
        cx="0"
        cy={98 - bounceY}
        rx="44"
        ry="10"
        fill="#050814"
        opacity="0.45"
      />

      <rect
        x={-26 + leftLegOffset * 0.4}
        y={58 + Math.min(0, leftLegOffset * 0.5)}
        width="16"
        height="34"
        rx="8"
        fill="#64748B"
      />
      <rect
        x={10 + rightLegOffset * 0.4}
        y={58 + Math.min(0, rightLegOffset * 0.5)}
        width="16"
        height="34"
        rx="8"
        fill="#475569"
      />

      <line
        x1="0"
        y1="-62"
        x2="0"
        y2="-96"
        stroke="#94A3B8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="0"
        cy="-102"
        r={14 + antennaIntensity * 18 * antennaPulse}
        fill="#FDE047"
        opacity={0.25 + antennaIntensity * 0.35}
      />
      <circle cx="0" cy="-102" r="9" fill="#FEF08A" />

      <g
        transform={`translate(-46, 12) rotate(${
          isWalking ? Math.sin(walkPhase + Math.PI) * 18 : 8
        })`}
      >
        <rect x="-8" y="0" width="14" height="36" rx="7" fill="#94A3B8" />
      </g>

      <rect x="-38" y="-2" width="76" height="66" rx="18" fill="#CBD5E1" />
      <rect x="-24" y="14" width="48" height="34" rx="8" fill="#1E293B" />
      <circle
        cx="0"
        cy="31"
        r={7 + antennaIntensity * 3}
        fill="#38BDF8"
        opacity={0.6 + 0.4 * antennaPulse}
      />

      <rect x="-46" y="-66" width="92" height="64" rx="22" fill="#E2E8F0" />
      <rect x="-36" y="-54" width="72" height="40" rx="14" fill="#0F172A" />

      {expression === 'happy' ? (
        <>
          <path
            d="M -24 -32 Q -16 -43 -8 -32"
            stroke="#38BDF8"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 8 -32 Q 16 -43 24 -32"
            stroke="#38BDF8"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : expression === 'surprised' ? (
        <>
          <circle cx={-16 + pupilDx} cy={-34 + pupilDy} r="9" fill="#38BDF8" />
          <circle cx={16 + pupilDx} cy={-34 + pupilDy} r="9" fill="#38BDF8" />
          <circle cx={-14 + pupilDx} cy={-37 + pupilDy} r="3" fill="#FFFFFF" />
          <circle cx={18 + pupilDx} cy={-37 + pupilDy} r="3" fill="#FFFFFF" />
        </>
      ) : isBlinking ? (
        <>
          <line
            x1="-24"
            y1="-34"
            x2="-8"
            y2="-34"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="-34"
            x2="24"
            y2="-34"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx={-16 + pupilDx} cy={-34 + pupilDy} r="7" fill="#38BDF8" />
          <circle cx={16 + pupilDx} cy={-34 + pupilDy} r="7" fill="#38BDF8" />
          <circle
            cx={-14 + pupilDx}
            cy={-36 + pupilDy}
            r="2.2"
            fill="#FFFFFF"
          />
          <circle
            cx={18 + pupilDx}
            cy={-36 + pupilDy}
            r="2.2"
            fill="#FFFFFF"
          />
        </>
      )}

      <g
        transform={`translate(46, 12) rotate(${
          armRaise > 0
            ? -armRaise * 65
            : isWalking
            ? Math.sin(walkPhase) * 18
            : -8
        })`}
      >
        <rect x="-6" y="0" width="14" height="36" rx="7" fill="#94A3B8" />
      </g>
    </g>
  );
};

/* Colinas del paisaje */
const Hills: React.FC = () => (
  <svg
    width="1080"
    height="1920"
    viewBox="0 0 1080 1920"
    style={{ position: 'absolute', inset: 0 }}
  >
    <defs>
      <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1B3B36" />
        <stop offset="100%" stopColor="#0B191E" />
      </linearGradient>
    </defs>
    <path
      d="M 0 1380 Q 270 1240 540 1350 T 1080 1320 L 1080 1920 L 0 1920 Z"
      fill="url(#hillBack)"
    />
    <path
      d="M 0 1480 Q 320 1420 580 1490 T 1080 1450 L 1080 1920 L 0 1920 Z"
      fill="url(#hillFront)"
    />
  </svg>
);

/* Estrella dorada */
const GoldenStar: React.FC<{
  x: number;
  y: number;
  scale?: number;
  brightness?: number;
  rotation?: number;
}> = ({ x, y, scale = 1, brightness = 1, rotation = 0 }) => {
  const color = brightness > 0.6 ? '#FACC15' : '#94A3B8';
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
      <circle
        cx="0"
        cy="0"
        r={55 * brightness}
        fill="#FEF08A"
        opacity={brightness * 0.45}
      />
      <polygon
        points="0,-32 9,-10 32,-10 14,5 20,28 0,14 -20,28 -14,5 -32,-10 -9,-10"
        fill={color}
        stroke="#FEF9C3"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
  );
};

/* Escena 1: Título */
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [85, 110], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <StarrySky globalFrameOffset={0} />
      <Hills />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 64px 260px 64px',
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            transform: `translateY(${(1 - titleSpring) * 40}px)`,
            opacity: titleSpring,
          }}
        >
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FEF9C3',
              margin: 0,
              letterSpacing: 2,
              textShadow: '0 0 35px rgba(250, 204, 21, 0.5)',
            }}
          >
            Chip y la Estrella
          </h1>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 28,
              color: '#CBD5E1',
              marginTop: 22,
              opacity: subtitleOpacity,
              letterSpacing: 4,
            }}
          >
            UN CORTO ANIMADO EN REMOTION
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Escena 2: La estrella fugaz */
const ShootingStarScene: React.FC = () => {
  const frame = useCurrentFrame();

  const chipX = interpolate(frame, [0, 100], [140, 390], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const isWalking = frame < 98;

  const starProgress = interpolate(frame, [50, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const starX = interpolate(starProgress, [0, 1], [980, 740]);
  const starY = interpolate(starProgress, [0, 1], [140, 1440]);

  const impactFlash = interpolate(frame, [106, 114, 135], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <StarrySky globalFrameOffset={110} />
      <Hills />
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
      >
        {frame >= 50 && frame <= 112 && (
          <g>
            <line
              x1={starX + 95}
              y1={starY - 220}
              x2={starX}
              y2={starY}
              stroke="#FEF08A"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.75}
            />
            <GoldenStar x={starX} y={starY} scale={1} rotation={frame * 8} />
          </g>
        )}

        {impactFlash > 0 && (
          <circle
            cx={740}
            cy={1440}
            r={40 + impactFlash * 130}
            fill="#FEF08A"
            opacity={impactFlash * 0.6}
          />
        )}

        <RobotChip
          x={chipX}
          y={1420}
          scale={1.25}
          isWalking={isWalking}
          expression={frame >= 95 ? 'surprised' : 'neutral'}
          lookDirection={frame >= 85 ? 'right' : 'forward'}
          antennaIntensity={0.6}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* Escena 3: El encuentro */
const EncounterScene: React.FC = () => {
  const frame = useCurrentFrame();

  const chipX = interpolate(frame, [0, 65], [200, 420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const isWalking = frame < 63;

  const armRaise = interpolate(frame, [75, 95, 145, 165], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const waveProgress = interpolate(frame, [95, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const starBrightness = interpolate(frame, [105, 140], [0.25, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const starBounce =
    frame > 135
      ? Math.abs(Math.sin((frame - 135) * 0.2)) * -32
      : Math.sin(frame * 0.4) * 2;

  return (
    <AbsoluteFill>
      <StarrySky globalFrameOffset={280} />
      <Hills />
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
      >
        {waveProgress > 0 && waveProgress < 1 && (
          <circle
            cx={chipX}
            cy={1282}
            r={20 + waveProgress * 340}
            fill="none"
            stroke="#FEF08A"
            strokeWidth={7 * (1 - waveProgress)}
            opacity={1 - waveProgress}
          />
        )}

        <GoldenStar
          x={720}
          y={1500 + starBounce}
          scale={1.0 + starBrightness * 0.4}
          brightness={starBrightness}
          rotation={frame > 135 ? Math.sin(frame * 0.15) * 15 : -12}
        />

        <RobotChip
          x={chipX}
          y={1430}
          scale={1.45}
          isWalking={isWalking}
          expression={frame > 125 ? 'happy' : 'neutral'}
          lookDirection="right"
          antennaIntensity={frame > 75 && frame < 130 ? 1.4 : 0.6}
          armRaise={armRaise}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* Escena 4: Regreso al cielo y créditos */
const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();

  const riseProgress = interpolate(frame, [10, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const starX =
    interpolate(riseProgress, [0, 1], [720, 720]) +
    Math.sin(riseProgress * Math.PI * 2) * 95;
  const starY = interpolate(riseProgress, [0, 1], [1460, 420]);

  const cameraPanY = interpolate(frame, [70, 150], [0, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const creditsOpacity = interpolate(frame, [110, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeToBlack = interpolate(frame, [168, 190], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <StarrySky globalFrameOffset={470} />
      <div style={{ transform: `translateY(${cameraPanY}px)` }}>
        <Hills />
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute', inset: 0 }}
        >
          <RobotChip
            x={420}
            y={1420}
            scale={1.35}
            expression="happy"
            lookDirection="up"
            antennaIntensity={0.8}
          />
        </svg>
      </div>

      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
      >
        <GoldenStar
          x={starX}
          y={starY + cameraPanY * 0.25}
          scale={interpolate(riseProgress, [0, 1], [1.25, 0.9])}
          brightness={1}
          rotation={frame * 2}
        />
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: creditsOpacity,
          paddingBottom: 380,
        }}
      >
        <h2
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 92,
            color: '#FEF9C3',
            margin: 0,
            textShadow: '0 0 25px rgba(250, 204, 21, 0.5)',
          }}
        >
          Fin
        </h2>
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 24,
            color: '#94A3B8',
            marginTop: 14,
            letterSpacing: 3,
          }}
        >
          HECHO CON REACT & REMOTION
        </p>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: '#000000',
          opacity: fadeToBlack,
        }}
      />
    </AbsoluteFill>
  );
};

export const ShortFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#070B19' }}>
      <Series>
        <Series.Sequence durationInFrames={110}>
          <TitleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={170}>
          <ShootingStarScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={190}>
          <EncounterScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={190}>
          <FinaleScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

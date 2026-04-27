import { useId, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { cn } from '@/lib/utils';
import { motion, useAnimation } from 'framer-motion';

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}) => {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } });
    }
  };

  return (
    <motion.div animate={controls} className={cn('opacity-0', className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || 'transparent' } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: false }, resize: true },
              modes: { push: { quantity: 3 } },
            },
            particles: {
              color: {
                value: particleColor || '#6366f1',
                animation: { h: { enable: true, speed: 40, sync: false } },
              },
              move: {
                enable: true,
                speed: { min: speed || 1, max: (speed || 1) * 3 },
                direction: 'none',
                outModes: { default: 'out' },
                random: true,
                straight: false,
              },
              number: {
                density: { enable: true, width: 600, height: 600 },
                value: particleDensity || 50,
              },
              opacity: {
                value: { min: 0.5, max: 1 },
                animation: { enable: true, speed: 1.5, sync: false, startValue: 'random' },
              },
              shadow: {
                enable: true,
                blur: 12,
                color: { value: particleColor || '#6366f1' },
                offset: { x: 0, y: 0 },
              },
              shape: { type: 'circle' },
              size: {
                value: { min: minSize || 1.5, max: maxSize || 3.5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

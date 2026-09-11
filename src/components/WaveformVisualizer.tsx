import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface WaveformVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyser, isPlaying }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const fallbackPhaseRef = useRef<number>(0);

  // Smooth decay values to avoid jerky transitions
  const previousDataRef = useRef<number[]>([]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    if (!svg.node() || !container) return;

    // Set up ResizeObserver to handle fluid responsive resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        svg.attr('width', width).attr('height', height);
      }
    });

    resizeObserver.observe(container);

    // D3 visualizer loop
    const tick = () => {
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 120;
      
      const fftSize = analyser ? analyser.frequencyBinCount : 0;
      const dataArray = new Uint8Array(fftSize);
      
      const pointsCount = 48; // Number of interpolation points across the screen
      let waveData = new Array(pointsCount).fill(0);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);

        // We focus on the vocal/main melodic ranges of the audio spectrum (indexes 0 to 80 of fftSize)
        const usefulLimit = Math.min(fftSize, 80);
        
        // Map raw frequencies to visual data points with left-right symmetry (creating a centered landscape)
        for (let i = 0; i < pointsCount; i++) {
          // Calculate the distance from center (0 at edges, 1 at center)
          const centerFactor = 1 - Math.abs((i - (pointsCount - 1) / 2) / ((pointsCount - 1) / 2));
          
          // Smooth bell curve envelope to taper edges beautifully
          const envelope = Math.sin(centerFactor * Math.PI / 2);
          
          // Map index to a frequency bin in the lower-middle active spectrum
          const binIndex = Math.floor((centerFactor * usefulLimit) * 0.85);
          let rawValue = dataArray[binIndex] || 0;

          // Convert to fraction (0 to 1) and apply envelope
          let valueFraction = (rawValue / 255) * envelope;
          
          // Set a minimum aesthetic noise threshold so the wave never feels entirely dead when quiet
          valueFraction = Math.max(0.015, valueFraction);
          
          waveData[i] = valueFraction;
        }
      } else {
        // AUTOMATED BREEDING/SINE MODE: Gentle, therapeutic gold waves when idle or paused
        fallbackPhaseRef.current += 0.012; // Slow elegant frequency
        const phase = fallbackPhaseRef.current;
        
        for (let i = 0; i < pointsCount; i++) {
          const centerFactor = 1 - Math.abs((i - (pointsCount - 1) / 2) / ((pointsCount - 1) / 2));
          const envelope = Math.sin(centerFactor * Math.PI); // Strong center taper
          
          // Multiphase overlapping waves for organic floatiness
          const sine1 = Math.sin(i * 0.15 - phase) * 0.55;
          const sine2 = Math.cos(i * 0.08 + phase * 0.7) * 0.35;
          const sine3 = Math.sin(i * 0.32 - phase * 1.5) * 0.1;
          
          let simulatedVal = (sine1 + sine2 + sine3 + 1) / 2; // Normalize to 0-1
          waveData[i] = Math.max(0.015, simulatedVal * envelope * 0.28);
        }
      }

      // Smooth transition with previous frame to prevent fast jitter
      if (previousDataRef.current.length !== pointsCount) {
        previousDataRef.current = new Array(pointsCount).fill(0.01);
      }
      for (let i = 0; i < pointsCount; i++) {
        // Interpolate: 82% old value, 18% new value for smooth, liquid response
        previousDataRef.current[i] = previousDataRef.current[i] * 0.82 + waveData[i] * 0.18;
      }

      const activePoints = previousDataRef.current;

      // Construct coordinate points for background and foreground waves
      // Mirroring/centering logic: map points to [x, y] coordinates
      const step = width / (pointsCount - 1);
      
      const foregroundCoordinates = activePoints.map((val, i) => {
        const x = i * step;
        // Map 0-1 to actual height offset from absolute vertical center
        const maxAmplitude = height * 0.72;
        const y = (height / 2) - (val * maxAmplitude);
        return [x, y] as [number, number];
      });

      // Construct a mirroring bottom-half coordinate set for symmetrical double-wave
      const mirroredCoordinates = activePoints.map((val, i) => {
        const x = i * step;
        const maxAmplitude = height * 0.72;
        const y = (height / 2) + (val * maxAmplitude);
        return [x, y] as [number, number];
      });

      // Background coordinates with phase/decay offset for elegant spatial parallax
      const backgroundCoordinates = activePoints.map((val, i) => {
        const x = i * step;
        // Background has reduced amplitude and visual shift
        const offsetVal = val * 0.75;
        const maxAmplitude = height * 0.65;
        // Add smooth shifting wave phase
        const phaseAnim = isPlaying ? Math.sin(i * 0.12 - (fallbackPhaseRef.current * 0.5)) * 4 : 0;
        const y = (height / 2) - (offsetVal * maxAmplitude) + phaseAnim;
        return [x, y] as [number, number];
      });

      const backgroundMirroredCoordinates = activePoints.map((val, i) => {
        const x = i * step;
        const offsetVal = val * 0.75;
        const maxAmplitude = height * 0.65;
        const phaseAnim = isPlaying ? Math.sin(i * 0.12 - (fallbackPhaseRef.current * 0.5)) * 4 : 0;
        const y = (height / 2) + (offsetVal * maxAmplitude) - phaseAnim;
        return [x, y] as [number, number];
      });

      // Use D3 Line Generator with smooth cardinal spline curves
      const lineGenerator = d3.line<[number, number]>()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveBasis);

      // Render Foreground Paths
      svg.select('#primary-wave')
        .attr('d', lineGenerator(foregroundCoordinates) || '');
        
      svg.select('#primary-wave-mirror')
        .attr('d', lineGenerator(mirroredCoordinates) || '');

      // Render Background Parallax Paths
      svg.select('#secondary-wave')
        .attr('d', lineGenerator(backgroundCoordinates) || '');
        
      svg.select('#secondary-wave-mirror')
        .attr('d', lineGenerator(backgroundMirroredCoordinates) || '');

      // Also render a glowing horizontal central line (the "equilibrium") that beats with quiet energy
      const baselinePoints: [number, number][] = [];
      for (let i = 0; i < pointsCount; i++) {
        const x = i * step;
        // Soft central wiggle based on audio magnitude
        const totalEnergy = activePoints.reduce((sum, v) => sum + v, 0) / pointsCount;
        const baseWiggle = Math.sin(i * 0.25 + (fallbackPhaseRef.current * 1.5)) * (totalEnergy * 15 + 1.2);
        baselinePoints.push([x, (height / 2) + baseWiggle]);
      }
      
      svg.select('#baseline')
        .attr('d', lineGenerator(baselinePoints) || '');

      animationRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <div ref={containerRef} className="w-full h-28 relative flex items-center justify-center select-none overflow-hidden my-2">
      {/* Visualizer SVG */}
      <svg ref={svgRef} className="absolute inset-0 z-0 overflow-visible pointer-events-none">
        <defs>
          {/* Glowing Filters to fit the high-end Twilight & Gold theme */}
          <filter id="gold-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6px" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="intense-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3px" result="blur" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Golden Gradient Fills and Strokes */}
          <linearGradient id="fore-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C5A030" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FFF2CC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="back-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87681C" stopOpacity="0" />
            <stop offset="50%" stopColor="#C5A030" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#87681C" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="equilibrium-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF2CC" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFF2CC" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFF2CC" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. Deep Parallax Background Wave */}
        <path
          id="secondary-wave"
          fill="none"
          stroke="url(#back-grad)"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          id="secondary-wave-mirror"
          fill="none"
          stroke="url(#back-grad)"
          strokeWidth="1.5"
          opacity="0.45"
        />

        {/* 2. Main High-Fidelity Foreground Wave */}
        <path
          id="primary-wave"
          fill="none"
          stroke="url(#fore-grad)"
          strokeWidth="2"
          filter="url(#gold-glow)"
          opacity="0.85"
        />
        <path
          id="primary-wave-mirror"
          fill="none"
          stroke="url(#fore-grad)"
          strokeWidth="2"
          filter="url(#gold-glow)"
          opacity="0.85"
        />

        {/* 3. Intense Core Wave highlight */}
        <path
          id="primary-wave"
          fill="none"
          stroke="#FFFFEE"
          strokeWidth="0.75"
          opacity="0.95"
        />
        
        {/* 4. Center Equilibrium Ray */}
        <path
          id="baseline"
          fill="none"
          stroke="url(#equilibrium-grad)"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

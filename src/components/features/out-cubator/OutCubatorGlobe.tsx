"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function OutCubatorGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    // #47295C in RGB: 71, 41, 92 -> [0.28, 0.16, 0.36]
    // #964594 in RGB: 150, 69, 148 -> [0.59, 0.27, 0.58]

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 320 * 2,
      height: 320 * 2,
      phi: 0,
      theta: 0.1,
      dark: 0,
      diffuse: 2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [1, 1, 1],
      markerColor: [0.59, 0.27, 0.58], // Purple markers
      glowColor: [0.95, 0.95, 0.95],
      markers: [
        { location: [36.75, 3.04], size: 0.1 }, // Algiers
        { location: [48.85, 2.35], size: 0.05 }, // Paris
        { location: [40.71, -74.0], size: 0.07 }, // NY
        { location: [-23.55, -46.63], size: 0.05 }, // Sao Paulo
        { location: [35.68, 139.69], size: 0.06 }, // Tokyo
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center opacity-80" style={{ mixBlendMode: 'multiply' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: 320,
          height: 320,
          maxWidth: "100%",
          aspectRatio: 1,
          filter: "hue-rotate(240deg) saturate(2) contrast(0.8)", // CSS trick to try to tint the dark dots towards purple/blue
        }}
      />
    </div>
  );
}

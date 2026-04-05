'use client';

/**
 * Subtle SVG noise grain overlay applied over the entire page.
 * Adds cinematic film-grain depth without performance cost.
 * Opacity is intentionally very low (0.025–0.04).
 */
export default function NoiseLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] opacity-[0.032]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  );
}

'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 90;

// ─── Particle generator ──────────────────────────────────────────────────────
function generateParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const pha = new Float32Array(count);
  const spd = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 9;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

    pha[i] = Math.random() * Math.PI * 2;
    spd[i] = 0.15 + Math.random() * 0.35;
  }

  return { positions: pos, phases: pha, speeds: spd };
}

// ─── Particle Field ──────────────────────────────────────────────────────────
function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useRef(new THREE.Object3D());

  const clockRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const dataRef = useRef<ReturnType<typeof generateParticles> | null>(null);

  // Generate once
  useEffect(() => {
    dataRef.current = generateParticles(COUNT);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const data = dataRef.current;

    if (!mesh || !data) return;

    clockRef.current += delta;
    const t = clockRef.current;

    const { positions, phases, speeds } = data;
    const mouse = mouseRef.current;

    for (let i = 0; i < COUNT; i++) {
      const bx = positions[i * 3];
      const by = positions[i * 3 + 1];
      const bz = positions[i * 3 + 2];

      const ph = phases[i];
      const sp = speeds[i];

      // ✨ base motion
      let x = bx + Math.sin(t * sp * 0.4 + ph) * 0.2;
      let y = by + Math.cos(t * sp * 0.3 + ph) * 0.25;

      // ✨ mouse magnetic pull (cinematic)
      const dist = Math.sqrt(x * x + y * y);
      const influence = Math.max(0, 1 - dist / 5);

      x += mouse.x * influence * 0.6;
      y += mouse.y * influence * 0.6;

      // ✨ subtle depth breathing
      const z = bz + Math.sin(t * 0.2 + ph) * 0.2;

      dummy.current.position.set(x, y, z);

      const scale = 0.012 + Math.sin(t * sp + ph) * 0.006;
      dummy.current.scale.setScalar(scale);

      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Canvas ──────────────────────────────────────────────────────────────────
export default function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1]}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}
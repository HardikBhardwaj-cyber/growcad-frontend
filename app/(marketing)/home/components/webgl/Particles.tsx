'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 90;

// ✅ generate once (outside render lifecycle)
function generateParticleData() {
  const pos = new Float32Array(COUNT * 3);
  const pha = new Float32Array(COUNT);
  const spd = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 9;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

    pha[i] = Math.random() * Math.PI * 2;
    spd[i] = 0.15 + Math.random() * 0.35;
  }

  return { positions: pos, phases: pha, speeds: spd };
}

// ─── Instanced particle field ─────────────────────────────────────────────────
function ParticleField() {
  const meshRef  = useRef<THREE.InstancedMesh>(null);
  const clockRef = useRef(0);

  // ✅ stable data (fixes ESLint)
  const dataRef = useRef(generateParticleData());
  const { positions, phases, speeds } = dataRef.current;

  // keep your optimization
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < COUNT; i++) {
      const bx = positions[i * 3];
      const by = positions[i * 3 + 1];
      const bz = positions[i * 3 + 2];
      const ph = phases[i];
      const sp = speeds[i];

      dummy.position.set(
        bx + Math.sin(t * sp * 0.4 + ph) * 0.18,
        by + Math.cos(t * sp * 0.3 + ph) * 0.22,
        bz
      );

      const sc = 0.014 + Math.sin(t * sp + ph) * 0.005;
      dummy.scale.setScalar(sc);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
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
        dpr={[
          1,
          typeof window !== 'undefined'
            ? Math.min(window.devicePixelRatio, 1.5)
            : 1,
        ]}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}
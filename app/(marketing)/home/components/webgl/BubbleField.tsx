'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUBBLE_COUNT = 16;

// ✅ move random logic OUTSIDE render lifecycle
function generateBubbleData() {
  const bp = new Float32Array(BUBBLE_COUNT * 3);
  const sp = new Float32Array(BUBBLE_COUNT);
  const ph = new Float32Array(BUBBLE_COUNT);
  const ra = new Float32Array(BUBBLE_COUNT);

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bp[i * 3]     = (Math.random() - 0.5) * 9;
    bp[i * 3 + 1] = (Math.random() - 0.5) * 7;
    bp[i * 3 + 2] = (Math.random() - 0.5) * 3;

    sp[i] = 0.18 + Math.random() * 0.32;
    ph[i] = Math.random() * Math.PI * 2;
    ra[i] = 0.12 + Math.random() * 0.55;
  }

  return { basePos: bp, speeds: sp, phases: ph, radii: ra };
}

function Bubbles() {
  const meshRef  = useRef<THREE.InstancedMesh>(null);
  const clockRef = useRef(0);

  // ✅ keep dummy optimized
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ✅ stable random data (NO ESLint error)
  const dataRef = useRef(generateBubbleData());
  const { basePos, speeds, phases, radii } = dataRef.current;

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const sp = speeds[i];
      const ph = phases[i];

      dummy.position.set(
        basePos[i * 3]     + Math.cos(t * sp * 0.55 + ph) * 0.22,
        basePos[i * 3 + 1] + Math.sin(t * sp * 0.40 + ph) * 0.30,
        basePos[i * 3 + 2]
      );

      dummy.scale.setScalar(radii[i]);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color="#6d28d9"
        transparent
        opacity={0.055}
        roughness={0.1}
        metalness={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default function BubbleField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 52 }}
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
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={0.9} color="#8b5cf6" />

        <Suspense fallback={null}>
          <Bubbles />
        </Suspense>
      </Canvas>
    </div>
  );
}
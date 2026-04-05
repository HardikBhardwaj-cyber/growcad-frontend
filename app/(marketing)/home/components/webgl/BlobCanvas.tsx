'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ─── Pause rendering when tab is hidden (R3F safe) ───────────────────────────
function VisibilityPause() {
  const { setFrameloop } = useThree();

  useEffect(() => {
    const onVisChange = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };

    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, [setFrameloop]);

  return null;
}

// ─── Primary animated blob ────────────────────────────────────────────────────
function PrimaryBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<React.ElementRef<typeof MeshDistortMaterial>>(null);
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.07;
      meshRef.current.rotation.y += delta * 0.11;
    }

    if (matRef.current) {
      matRef.current.distort = 0.32 + Math.sin(t * 0.45) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.7, 56, 56]}>
      <MeshDistortMaterial
        ref={matRef}
        color="#5b21b6"
        distort={0.35}
        speed={1.4}
        roughness={0.05}
        metalness={0.08}
        transparent
        opacity={0.16}
      />
    </Sphere>
  );
}

// ─── Secondary blob ───────────────────────────────────────────────────────────
function SecondaryBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.x -= delta * 0.055;
      meshRef.current.rotation.z += delta * 0.085;

      meshRef.current.position.x = Math.sin(t * 0.28) * 0.55;
      meshRef.current.position.y = Math.cos(t * 0.18) * 0.32;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1.05, 40, 40]}
      position={[1.6, -0.6, -1.2]}
    >
      <MeshDistortMaterial
        color="#1d4ed8"
        distort={0.48}
        speed={1.9}
        roughness={0}
        transparent
        opacity={0.09}
      />
    </Sphere>
  );
}

// ─── Scene setup ──────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <VisibilityPause />

      <ambientLight intensity={0.45} />

      <directionalLight
        position={[2.5, 2.5, 2]}
        intensity={1.6}
        color="#8b5cf6"
      />

      <directionalLight
        position={[-2, -1.5, -1]}
        intensity={0.7}
        color="#3b82f6"
      />

      <Suspense fallback={null}>
        <PrimaryBlob />
        <SecondaryBlob />
      </Suspense>
    </>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
export default function BlobCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 48 }}
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
        <Scene />
      </Canvas>
    </div>
  );
}
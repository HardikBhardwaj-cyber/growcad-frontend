"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const count = 500;

// ✅ PURE FUNCTION OUTSIDE REACT (NO ESLINT ISSUE)
function generatePositions() {
  const arr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return arr;
}

// ✅ generated once at module level
const positions = generatePositions();

function ParticleField() {
  const points = useRef<THREE.Points>(null!);

  useFrame(() => {
    if (!points.current) return;
    points.current.rotation.y += 0.0005;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.7}
      />
    </points>
  );
}

export default function Particles() {
  return (
    <div className="absolute inset-0 -z-20">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
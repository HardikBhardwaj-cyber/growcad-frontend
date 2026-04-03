"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingBubble({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    mesh.current.position.y =
      position[1] + Math.sin(t + position[0]) * 0.3;

    mesh.current.rotation.x += 0.002;
    mesh.current.rotation.y += 0.002;
  });

  return (
    <Sphere args={[scale, 32, 32]} ref={mesh} position={position}>
      <meshStandardMaterial
        color="#60a5fa"
        transparent
        opacity={0.2}
        roughness={0.1}
      />
    </Sphere>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      <FloatingBubble position={[-2, 0, 0]} scale={0.3} />
      <FloatingBubble position={[2, 1, -1]} scale={0.4} />
      <FloatingBubble position={[0, -1, -2]} scale={0.5} />
    </>
  );
}

export default function BubbleField() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
    </div>
  );
}
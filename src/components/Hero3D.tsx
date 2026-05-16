"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/Button";

function CakeModel() {
  const { scene } = useGLTF("/assets/decoration/cake.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Gentle rotation based on mouse position
      const targetRotationX = (state.pointer.y * Math.PI) / 8;
      const targetRotationY = (state.pointer.x * Math.PI) / 4;

      modelRef.current.rotation.x +=
        (targetRotationX - modelRef.current.rotation.x) * 0.1;
      modelRef.current.rotation.y +=
        (targetRotationY - modelRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <group ref={modelRef} dispose={null}>
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </group>
  );
}

// Preload the model
useGLTF.preload("/assets/decoration/cake.glb");

export default function Hero3D() {
  const { scrollY } = useScroll();

  // Parallax effects based on scroll
  const canvasY = useTransform(scrollY, [0, 500], [0, 150]);
  const canvasOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const blobScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const blobOpacity = useTransform(scrollY, [0, 300], [0.6, 0]);

  return (
    <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Decorative Blob */}
      <motion.div
        style={{ scale: blobScale, opacity: blobOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Text Layer - Behind the cake */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none pb-[15vh] md:pb-[10vh]">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[25vw] md:text-[22vw] lg:text-[18vw] font-black text-foreground leading-none tracking-tighter"
          style={{ textShadow: "6px 6px 0px rgba(244, 222, 220, 0.6)" }}
        >
          KOKI
        </motion.h1>
        {/* Smaller spacer to allow overlapping effect */}
        <div className="h-[2vh] md:h-[5vh] lg:h-[8vh] w-full" />
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-[25vw] md:text-[22vw] lg:text-[18vw] font-black text-foreground leading-none tracking-tighter"
          style={{ textShadow: "6px 6px 0px rgba(244, 222, 220, 0.6)" }}
        >
          MUGI
        </motion.h1>
      </div>

      {/* 3D Canvas Layer */}
      <motion.div
        style={{ y: canvasY, opacity: canvasOpacity }}
        className="absolute inset-0 z-20 pb-[5vh] md:pb-[10vh]"
      >
        <Canvas
          className="touch-none cursor-grab active:cursor-grabbing w-full h-full"
          camera={{ position: [0, 0, 16], fov: 50 }}
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <OrbitControls
              enableZoom={true}
              minDistance={2}
              maxDistance={50}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
              enableDamping={true}
              dampingFactor={0.05}
            />
            <Float
              speed={2} // Animation speed
              rotationIntensity={0.2} // XYZ rotation intensity
              floatIntensity={0.5} // Up/down float intensity
            >
              <CakeModel />
            </Float>

            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.4}
              scale={20}
              blur={2}
              far={4.5}
            />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* UI Elements Layer - In front of everything */}
      <div className="absolute bottom-[10vh] md:bottom-[8vh] lg:bottom-[10vh] left-0 w-full z-40 flex flex-col items-center px-6 text-center pointer-events-none">
        <Button
          variant="eclair"
          flavor="caramel"
          size="md"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ y: [0, -8, 0], opacity: 1, scale: 1 }}
          transition={{
            y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
            opacity: { duration: 0.5, delay: 0.5 },
            scale: { duration: 0.5, delay: 0.5 },
          }}
          className="pointer-events-auto drop-shadow-[0_10px_20px_rgba(214,100,93,0.3)]"
        >
          Explore Now!
        </Button>
      </div>

      {/* Wave Layer */}
      <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-none leading-[0]">
        <img
          src="/assets/wave/wave-top.svg"
          alt="Wave decoration"
          className="w-full h-[80px] md:h-[120px] object-cover object-bottom"
        />
      </div>
    </section>
  );
}

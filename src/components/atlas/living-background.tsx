"use client";

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Manus.im-inspired Living Background
 * - Subtle reactive grid that responds to mouse position
 * - Pulsing radial gradients that breathe
 * - Data-flow particles drifting across the screen
 * - Gives the sensation of an AI server continuously processing
 */
export function LivingBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const isClient = useIsClient();
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  if (!isClient) {
    return <div className="absolute inset-0 bg-obsidian" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid */}
      <div className="absolute inset-0 grid-bg-animated" />

      {/* Mouse-reactive primary gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `
            radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(57,255,20,0.06) 0%, transparent 60%)
          `,
        }}
        transition={{ type: "tween", duration: 0.8, ease: "easeOut" }}
      />

      {/* Secondary breathing gradient (top-right) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse 500px 400px at 80% 20%, rgba(0,240,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Tertiary breathing gradient (bottom-left) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          background:
            "radial-gradient(ellipse 400px 500px at 15% 80%, rgba(57,255,20,0.035) 0%, transparent 70%)",
        }}
      />

      {/* Center breathing core glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(57,255,20,0.025) 0%, transparent 70%)",
        }}
      />

      {/* Data flow lines - horizontal */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-px"
          style={{
            width: `${200 + i * 80}px`,
            background: `linear-gradient(90deg, transparent 0%, rgba(57,255,20,${0.06 + i * 0.01}) 30%, rgba(57,255,20,${0.06 + i * 0.01}) 70%, transparent 100%)`,
            top: `${15 + i * 18}%`,
          }}
          animate={{
            x: ["-100%", "120%"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 15 + i * 4,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear",
          }}
        />
      ))}

      {/* Data flow lines - vertical */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-px"
          style={{
            height: `${150 + i * 60}px`,
            background: `linear-gradient(180deg, transparent 0%, rgba(0,240,255,${0.04 + i * 0.008}) 30%, rgba(0,240,255,${0.04 + i * 0.008}) 70%, transparent 100%)`,
            left: `${20 + i * 22}%`,
          }}
          animate={{
            y: ["-100%", "120%"],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 18 + i * 5,
            repeat: Infinity,
            delay: i * 4 + 1,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating micro-particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = ((i * 37 + 13) % 100);
        const y = ((i * 53 + 7) % 100);
        const size = (i % 3) * 0.5 + 0.5;
        const dur = (i % 8) + 6;
        const delay = (i % 5);
        const isGreen = i % 2 === 0;

        return (
          <motion.div
            key={`p-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              backgroundColor: isGreen
                ? "rgba(57,255,20,0.25)"
                : "rgba(0,240,255,0.2)",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(5,5,5,0.4) 100%)",
        }}
      />
    </div>
  );
}

'use client';

import { useEffect, useRef, useCallback } from 'react';

/* ─── Animated Grid Background with Neon Light Beams ─── */
interface Beam {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  speed: number;
  life: number;
  maxLife: number;
  width: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const GRID_SIZE = 60;
const CYAN = '#00F0FF';
const GREEN = '#00FF41';

export function LoginGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let beams: Beam[] = [];
    let particles: Particle[] = [];
    const time = { now: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnBeam = () => {
      const isHorizontal = Math.random() > 0.5;
      const color = Math.random() > 0.5 ? CYAN : GREEN;
      const speed = 1.5 + Math.random() * 2.5;

      if (isHorizontal) {
        const y = Math.floor(Math.random() * Math.ceil(canvas.height / GRID_SIZE)) * GRID_SIZE;
        const goRight = Math.random() > 0.5;
        beams.push({
          x: goRight ? -20 : canvas.width + 20,
          y,
          dx: goRight ? speed : -speed,
          dy: 0,
          color,
          speed,
          life: 0,
          maxLife: canvas.width / speed + 40,
          width: 1 + Math.random() * 1.5,
        });
      } else {
        const x = Math.floor(Math.random() * Math.ceil(canvas.width / GRID_SIZE)) * GRID_SIZE;
        const goDown = Math.random() > 0.5;
        beams.push({
          x,
          y: goDown ? -20 : canvas.height + 20,
          dx: 0,
          dy: goDown ? speed : -speed,
          color,
          speed,
          life: 0,
          maxLife: canvas.height / speed + 40,
          width: 1 + Math.random() * 1.5,
        });
      }
    };

    const spawnBurstParticles = (x: number, y: number, color1: string, color2: string) => {
      const count = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 0.8 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 30 + Math.random() * 30,
          color: Math.random() > 0.5 ? color1 : color2,
          size: 1 + Math.random() * 2,
        });
      }
    };

    let spawnTimer = 0;

    const draw = () => {
      time.now++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pulsating grid glow factor
      const glowPulse = 0.5 + 0.5 * Math.sin(time.now * 0.015);

      // Draw grid lines
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        const alpha = 0.025 + 0.015 * glowPulse;
        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        const alpha = 0.025 + 0.015 * glowPulse;
        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Intersection glow dots
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        for (let y = 0; y < canvas.height; y += GRID_SIZE) {
          const pulseAlpha = 0.03 + 0.04 * glowPulse;
          ctx.fillStyle = `rgba(57, 255, 20, ${pulseAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spawn beams periodically
      spawnTimer++;
      if (spawnTimer > 20 + Math.random() * 30) {
        spawnBeam();
        spawnTimer = 0;
      }

      // Update and draw beams
      for (let i = beams.length - 1; i >= 0; i--) {
        const beam = beams[i];
        beam.x += beam.dx;
        beam.y += beam.dy;
        beam.life++;

        if (beam.life > beam.maxLife) {
          beams.splice(i, 1);
          continue;
        }

        const fadeIn = Math.min(beam.life / 15, 1);
        const fadeOut = Math.max(0, 1 - (beam.life - beam.maxLife + 60) / 60);
        const alpha = fadeIn * Math.min(fadeOut, 1) * 0.8;

        if (alpha <= 0) continue;

        const isHorizontal = beam.dx !== 0;
        const tailLength = 80 + beam.speed * 20;
        const headX = beam.x;
        const headY = beam.y;
        const tailX = isHorizontal ? headX - (beam.dx > 0 ? tailLength : -tailLength) : headX;
        const tailY = !isHorizontal ? headY - (beam.dy > 0 ? tailLength : -tailLength) : headY;

        // Draw beam trail
        const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
        const beamColorRgb = beam.color === CYAN ? '0,240,255' : '0,255,65';
        gradient.addColorStop(0, `rgba(${beamColorRgb}, 0)`);
        gradient.addColorStop(0.6, `rgba(${beamColorRgb}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${beamColorRgb}, ${alpha})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        // Draw beam head glow
        ctx.beginPath();
        const headGlow = ctx.createRadialGradient(headX, headY, 0, headX, headY, 8 + beam.width * 3);
        headGlow.addColorStop(0, `rgba(${beamColorRgb}, ${alpha * 0.6})`);
        headGlow.addColorStop(1, `rgba(${beamColorRgb}, 0)`);
        ctx.fillStyle = headGlow;
        ctx.arc(headX, headY, 8 + beam.width * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Check beam crossings / proximity for burst effects
      for (let i = 0; i < beams.length; i++) {
        for (let j = i + 1; j < beams.length; j++) {
          const a = beams[i];
          const b = beams[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 20) {
            // Only burst once — mark them
            if (!a['_burst'] && !b['_burst']) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              spawnBurstParticles(mx, my, a.color, b.color);
              a['_burst'] = true;
              b['_burst'] = true;
            }
          }
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life++;

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - p.life / p.maxLife;
        const particleRgb = p.color === CYAN ? '0,240,255' : '0,255,65';

        // Particle glow
        ctx.beginPath();
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `rgba(${particleRgb}, ${alpha * 0.5})`);
        glow.addColorStop(1, `rgba(${particleRgb}, 0)`);
        ctx.fillStyle = glow;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleRgb}, ${alpha * 0.9})`;
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.9
      );
      vignette.addColorStop(0, 'rgba(10,10,10,0)');
      vignette.addColorStop(1, 'rgba(10,10,10,0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    // Initial beams
    for (let i = 0; i < 3; i++) {
      spawnBeam();
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: '#0A0A0A' }}
    />
  );
}

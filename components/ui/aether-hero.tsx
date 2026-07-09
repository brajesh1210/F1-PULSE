'use client';

import React, { useRef, useEffect } from 'react';

const F1_AETHER_FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define R resolution
#define T time
#define FC gl_FragCoord.xy

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float line(vec2 uv, float y, float thickness, float speed, float offset) {
  float wave = sin((uv.x * 8.0) + T * speed + offset) * 0.035;
  float d = abs(uv.y - y - wave);
  return smoothstep(thickness, 0.0, d);
}
void main() {
  vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
  vec2 p = uv;
  float t = T * 0.65;
  vec3 bg = vec3(0.015, 0.012, 0.012);
  float r = length(p);
  float angle = atan(p.y, p.x);
  float tunnel = 0.03 / max(abs(sin(angle * 10.0 + t * 2.0)) * r, 0.015);
  tunnel *= smoothstep(1.2, 0.05, r);
  vec3 col = bg;
  col += vec3(0.8, 0.02, 0.0) * tunnel * 0.35;
  float redLines = line(p, -0.30, 0.008, 3.0, 0.0) + line(p, 0.18, 0.006, 2.4, 1.5) + line(p, 0.42, 0.004, 3.8, 2.7);
  float blueLines = line(p, -0.12, 0.006, 3.5, 2.0) + line(p, 0.31, 0.005, 2.8, 4.0);
  col += vec3(1.0, 0.02, 0.0) * redLines * 0.75;
  col += vec3(0.0, 0.65, 1.0) * blueLines * 0.55;
  vec2 grid = vec2(floor((p.x + t * 1.8) * 22.0), floor(p.y * 16.0));
  float rnd = hash(grid);
  float spark = step(0.965, rnd);
  float sparkShape = smoothstep(0.025, 0.0, abs(fract((p.x + t * (1.0 + rnd)) * 22.0) - 0.5));
  sparkShape *= smoothstep(0.03, 0.0, abs(fract(p.y * 16.0) - 0.5));
  col += vec3(1.0, 0.28, 0.02) * spark * sparkShape * 0.55;
  float centerGlow = smoothstep(0.75, 0.0, r);
  col += vec3(0.12, 0.0, 0.0) * centerGlow;
  col += vec3(0.0, 0.05, 0.09) * centerGlow;
  float vignette = smoothstep(1.05, 0.25, r);
  col *= vignette;
  col = pow(col, vec3(0.85));
  O = vec4(col, 1.0);
}`;

const vertShader = `#version 300 es
in vec4 position;
void main() { gl_Position = position; }`;

export interface AetherHeroProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  align?: 'left' | 'center' | 'right';
  fragmentSource?: string;
  overlayGradient?: string;
  textColor?: string;
  height?: string;
}

export function AetherHero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  align = 'center',
  fragmentSource = F1_AETHER_FRAG,
  overlayGradient = 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.9) 100%)',
  textColor = '#ffffff',
  height = '100vh',
}: AetherHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resLoc = gl.getUniformLocation(program, 'resolution');

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform1f(timeLoc, (now - startTime) / 1000);
      gl.uniform2f(resLoc, width, height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    render(startTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, [fragmentSource]);

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient, zIndex: 1, pointerEvents: 'none' }} />
      
      {/* Decorative Glows & Textures */}
      <div className="absolute w-[42rem] h-[42rem] -left-[12rem] -bottom-[14rem] rounded-full blur-[40px] opacity-70 pointer-events-none z-10 bg-[radial-gradient(circle,rgba(225,6,0,0.28),transparent_65%)]" />
      <div className="absolute w-[38rem] h-[38rem] -right-[10rem] -top-[12rem] rounded-full blur-[48px] opacity-70 pointer-events-none z-10 bg-[radial-gradient(circle,rgba(0,212,255,0.18),transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%)', backgroundSize: '18px 18px' }} />
      
      {/* Animated Speed Line */}
      <div className="absolute h-px w-[180px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20 animate-[f1-line-move_4s_linear_infinite]" style={{ top: '65%' }} />

      <div style={{ position: 'relative', zIndex: 20, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', textAlign: align, padding: '0 2rem', color: textColor }}>
        {title && <h1 className="font-bebas text-6xl md:text-8xl tracking-wider uppercase drop-shadow-2xl mb-4 animate-fade-in-up">{title}</h1>}
        {subtitle && <p className="font-space max-w-2xl text-lg md:text-xl text-gray-200 mb-8 drop-shadow-lg animate-fade-in-up animation-delay-100">{subtitle}</p>}
        <div className="flex gap-4 animate-fade-in-up animation-delay-200">
          {ctaLabel && <a href={ctaHref} className="px-8 py-3 bg-[#E10600] hover:bg-red-700 text-white font-bold rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(225,6,0,0.4)] hover:shadow-[0_0_40px_rgba(225,6,0,0.8)] relative overflow-hidden group"><span className="relative z-10">{ctaLabel}</span><div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" /></a>}
          {secondaryCtaLabel && <a href={secondaryCtaHref} className="px-8 py-3 border-2 border-white/30 hover:border-white text-white font-bold rounded-sm transition-all duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10">{secondaryCtaLabel}</a>}
        </div>
      </div>
    </div>
  );
}

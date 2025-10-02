import React, { useCallback, useEffect, useRef, useState } from "react";

export interface HeroCityMediaProps {
  title: string;
  subtitle: string;
  videoSrc?: string;
  posterSrc?: string;
  onStart?: () => void;
}

export default function HeroCityMedia({
  title,
  subtitle,
  videoSrc = "https://videos.pexels.com/video-files/855288/855288-uhd_4096_2160_25fps.mp4",
  posterSrc = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2400&auto=format&fit=crop",
  onStart,
}: HeroCityMediaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [starting, setStarting] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const c = containerRef.current;
    const m = mediaRef.current;
    if (!c || !m) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tx = x * 16; // px parallax
    const ty = y * 10;
    m.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.08)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const m = mediaRef.current;
    if (!m) return;
    m.style.transform = "translate3d(0,0,0) scale(1.0)";
  }, []);

  const onClickStart = useCallback(() => {
    setStarting(true);
  }, []);

  useEffect(() => {
    if (!starting) return;
    const id = setTimeout(() => {
      onStart?.();
    }, 900);
    return () => clearTimeout(id);
  }, [starting, onStart]);

  return (
    <section
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media background */}
      <div
        ref={mediaRef}
        className={`absolute inset-0 transition-transform duration-500 will-change-transform ${
          starting ? "scale-110 blur-sm" : ""
        }`}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
          aria-hidden
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 text-center">
        <div className="max-w-3xl rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-base text-white/80 sm:text-lg">{subtitle}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClickStart}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-primary-foreground shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
            >
              Iniciar
            </button>
          </div>
        </div>
      </div>

      {/* Entry animation overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 transform-gpu bg-black/0 transition-[background,transform,opacity] duration-700 ease-out ${
          starting ? "bg-black/40 opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </section>
  );
}

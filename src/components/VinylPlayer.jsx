import { useState, useEffect, useRef, useCallback } from "react";

// Student band demo playlist data with picture disc artwork
const TRACKS = [
  {
    id: 1,
    title: "Electric Echoes",
    artist: "The Basement Tapes",
    genre: "Indie Rock",
    tempo: 124,
    key: "Am",
    color: "#5dd9d0", // secondary cyan
    cover: "/image.jpeg",
    coverFilter: "brightness(0.95) contrast(1.1)",
    chords: [
      { root: 220.0, notes: [220.0, 261.63, 329.63] }, // Am
      { root: 174.61, notes: [174.61, 220.0, 261.63] }, // F
      { root: 261.63, notes: [261.63, 329.63, 392.0] }, // C
      { root: 196.0, notes: [196.0, 246.94, 293.66] }, // G
    ],
    melody: [440, 523.25, 440, 392, 329.63, 392, 440, 523.25],
  },
  {
    id: 2,
    title: "Koramangala Skies",
    artist: "Neon Velvet",
    genre: "Alt Post-Punk",
    tempo: 114,
    key: "Em",
    color: "#ffb2b6", // tertiary pink
    cover: "/image.jpeg",
    coverFilter: "hue-rotate(310deg) saturate(1.2) brightness(0.92)",
    chords: [
      { root: 164.81, notes: [164.81, 196.0, 246.94] }, // Em
      { root: 220.0, notes: [220.0, 261.63, 329.63] }, // Am
      { root: 146.83, notes: [146.83, 185.0, 220.0] }, // D
      { root: 196.0, notes: [196.0, 246.94, 293.66] }, // G
    ],
    melody: [329.63, 392.0, 493.88, 440.0, 392.0, 329.63, 293.66, 329.63],
  },
  {
    id: 3,
    title: "Midnight Strum",
    artist: "Velvet Frequency",
    genre: "Psychedelic Blues",
    tempo: 96,
    key: "Dm",
    color: "#c6c0ff", // primary lavender
    cover: "/image.jpeg",
    coverFilter: "hue-rotate(240deg) saturate(1.3) brightness(0.9)",
    chords: [
      { root: 146.83, notes: [146.83, 174.61, 220.0] }, // Dm
      { root: 196.0, notes: [196.0, 233.08, 293.66] }, // Gm
      { root: 174.61, notes: [174.61, 220.0, 261.63] }, // F
      { root: 220.0, notes: [220.0, 277.18, 329.63] }, // A
    ],
    melody: [293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63, 293.66],
  },
  {
    id: 4,
    title: "Raft Reverie",
    artist: "The Feedback Club",
    genre: "Garage Punk",
    tempo: 138,
    key: "E",
    color: "#f6b060", // yellow
    cover: "/image.jpeg",
    coverFilter: "hue-rotate(50deg) saturate(1.4) brightness(0.95)",
    chords: [
      { root: 164.81, notes: [164.81, 207.65, 246.94] }, // E
      { root: 220.0, notes: [220.0, 277.18, 329.63] }, // A
      { root: 246.94, notes: [246.94, 311.13, 369.99] }, // B
      { root: 220.0, notes: [220.0, 277.18, 329.63] }, // A
    ],
    melody: [329.63, 415.3, 493.88, 659.25, 493.88, 415.3, 369.99, 329.63],
  },
];

// Helper: Distortion curve for rock overdrive
function makeDistortionCurve(amount = 18) {
  const k = amount;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export default function VinylPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(33); // 33 or 45 RPM
  const [volume, setVolume] = useState(0.7);
  const [stipplePulse, setStipplePulse] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  // Web Audio engine refs
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const vinylNoiseNodeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef(null);
  const beatIndexRef = useRef(0);
  const speedMultiplierRef = useRef(1.0);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioPulseEnergyRef = useRef(0);

  // Sync refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    speedMultiplierRef.current = rpm === 45 ? 1.36 : 1.0;
  }, [isPlaying, rpm]);

  // Handle master volume changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        volume * 0.28,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume]);

  // Audio initialiser with stippled vinyl crackle/grain
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = volume * 0.28;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 4000;

      filter.connect(ctx.destination);
      master.connect(filter);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;

      // Analog Vinyl Stipple Surface Grain / Crackle generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Random micro-pops to emulate stippled analog vinyl texture
        const isCrack = Math.random() < 0.002;
        output[i] = isCrack
          ? (Math.random() * 2 - 1) * 0.2
          : (Math.random() * 2 - 1) * 0.012;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 1800;
      noiseFilter.Q.value = 1.2;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.08;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noiseSource.start(0);

      vinylNoiseNodeRef.current = noiseGain;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, [volume]);

  const triggerBeatPulse = (intensity = 1.0) => {
    audioPulseEnergyRef.current = Math.min(1.8, audioPulseEnergyRef.current + intensity);
    setStipplePulse((prev) => (prev + 1) % 100);
  };

  const playKick = (time) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(time);
    osc.stop(time + 0.18);
    triggerBeatPulse(1.2);
  };

  const playSnare = (time) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGainRef.current);

    const osc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);

    toneGain.gain.setValueAtTime(0.4, time);
    toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(toneGain);
    toneGain.connect(masterGainRef.current);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.15);
    osc.start(time);
    osc.stop(time + 0.12);
    triggerBeatPulse(0.9);
  };

  const playHiHat = (time) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 6500;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    noise.start(time);
    noise.stop(time + 0.05);
    triggerBeatPulse(0.35);
  };

  const playBassNote = (freq, time, dur = 0.22) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq / 2, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, time);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  };

  const playGuitarStrum = (chordNotes, time, dur = 0.35) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(16);
    distortion.oversample = "2x";

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2400;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    chordNotes.forEach((noteFreq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(noteFreq, time + idx * 0.015);

      osc.connect(distortion);
      osc.start(time + idx * 0.015);
      osc.stop(time + idx * 0.015 + dur);
    });
    triggerBeatPulse(0.7);
  };

  const playMelodyNote = (freq, time, dur = 0.18) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(time);
    osc.stop(time + dur);
  };

  // Step sequencer scheduler
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    initAudio();

    const bpm = currentTrack.tempo * speedMultiplierRef.current;
    const intervalMs = (60 / bpm / 2) * 1000;

    timerRef.current = setInterval(() => {
      if (!audioCtxRef.current || !isPlayingRef.current) return;

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime + 0.03;
      const step = beatIndexRef.current % 16;
      const chordIdx = Math.floor(step / 4) % currentTrack.chords.length;
      const chord = currentTrack.chords[chordIdx];

      if (step === 0 || step === 8 || step === 10) {
        playKick(now);
      }
      if (step === 4 || step === 12) {
        playSnare(now);
      }
      if (step % 2 === 0) {
        playHiHat(now);
      }

      if ([0, 3, 6, 8, 11, 14].includes(step)) {
        playBassNote(chord.root, now, 0.22);
      }

      if ([2, 6, 10, 14].includes(step)) {
        playGuitarStrum(chord.notes, now, 0.32);
      }

      if (step % 2 === 0) {
        const melodyIdx = (step / 2) % currentTrack.melody.length;
        playMelodyNote(currentTrack.melody[melodyIdx], now, 0.16);
      }

      beatIndexRef.current += 1;
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack, rpm, initAudio]);

  // ─── LIVE REACTIVE STIPPLE AUDIO CANVAS ───
  // Draws concentric stippled halftone dots that react to audio rhythm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * 2 || 560);
    let height = (canvas.height = canvas.offsetHeight * 2 || 560);
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate pre-calculated stippled dot coordinates
    const rings = [
      { r: 95, count: 32, dotSize: 1.8, alpha: 0.45 },
      { r: 110, count: 48, dotSize: 2.0, alpha: 0.55 },
      { r: 124, count: 64, dotSize: 2.2, alpha: 0.65 },
      { r: 136, count: 72, dotSize: 2.4, alpha: 0.75 },
    ];

    let angleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Decay audio energy smoothly
      audioPulseEnergyRef.current *= 0.92;
      const energy = audioPulseEnergyRef.current;

      if (isPlayingRef.current) {
        angleOffset += 0.008 * (rpm === 45 ? 1.4 : 1.0);
      }

      // Draw stippled particle aura around circular vinyl
      rings.forEach((ring, ringIdx) => {
        const currentR = ring.r + energy * (10 + ringIdx * 6);
        const dynamicAlpha = Math.min(
          1,
          ring.alpha * (isPlayingRef.current ? 0.8 + energy * 0.9 : 0.25)
        );

        ctx.fillStyle = isPlayingRef.current ? currentTrack.color : "#928f9c";
        ctx.globalAlpha = dynamicAlpha;

        for (let i = 0; i < ring.count; i++) {
          const theta = (i / ring.count) * Math.PI * 2 + angleOffset * (ringIdx % 2 === 0 ? 1 : -1);
          // Stipple scatter jitter responding to sound
          const jitter = isPlayingRef.current ? (Math.sin(i * 3 + energy * 10) * energy * 4) : 0;
          const x = centerX + Math.cos(theta) * (currentR + jitter);
          const y = centerY + Math.sin(theta) * (currentR + jitter);

          const dotR = ring.dotSize * (isPlayingRef.current ? 1 + energy * 0.6 : 0.85);

          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTrack.color, rpm]);

  const handleTogglePlay = () => {
    initAudio();
    setIsPlaying((prev) => !prev);
  };

  const handleSelectTrack = (index) => {
    initAudio();
    setCurrentTrackIndex(index);
    beatIndexRef.current = 0;
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    handleSelectTrack((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrevTrack = () => {
    handleSelectTrack((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="w-full bg-surface-container-high/90 border border-outline-variant/40 shadow-[6px_6px_0px_#100e09] p-space-md md:p-space-lg rounded-sm mt-3">
      {/* HEADER BAR: HI-FI STEREO BRANDING */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm mb-space-md">
        <div className="flex items-center gap-2">
          {/* LED Indicator */}
          <span
            className={`w-2.5 h-2.5 transition-all duration-300 ${
              isPlaying
                ? "bg-secondary shadow-[0_0_8px_#5dd9d0] animate-pulse"
                : "bg-outline/40"
            }`}
            style={{ borderRadius: "50%" }}
          />
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface font-bold">
            STIPPLED PICTURE DISC // STEREO
          </span>
        </div>

        {/* 33 / 45 RPM SPEED SWITCH */}
        <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 border border-outline-variant/40 text-[10px] font-mono">
          <span className="text-outline uppercase pr-1 font-bold">RPM</span>
          <button
            onClick={() => setRpm(33)}
            className={`px-1.5 py-0.5 font-bold transition-colors ${
              rpm === 33
                ? "bg-secondary text-on-secondary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            title="Standard speed"
          >
            33⅓
          </button>
          <button
            onClick={() => setRpm(45)}
            className={`px-1.5 py-0.5 font-bold transition-colors ${
              rpm === 45
                ? "bg-tertiary text-on-tertiary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            title="High speed overdrive"
          >
            45
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: FREESTANDING CIRCULAR RECORD + PLAYLIST */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
        {/* ─── LEFT: CIRCULAR PICTURE DISC VINYL RECORD ─── */}
        <div className="md:col-span-5 flex flex-col items-center justify-center py-2 relative">
          {/* Live Reactive Stippled Audio Halo Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ minHeight: "240px", minWidth: "240px" }}
          />

          {/* The Circular Vinyl Disc Container */}
          <div
            className="group relative w-48 h-48 sm:w-56 sm:h-56 cursor-pointer select-none z-10 transition-transform duration-300 hover:scale-[1.03]"
            onClick={handleTogglePlay}
            title={isPlaying ? "Click to Pause Vinyl" : "Click to Spin Picture Disc"}
            style={{ borderRadius: "50%" }}
          >
            {/* Outer Vinyl Drop Shadow */}
            <div
              className="absolute inset-0 shadow-[0_16px_36px_rgba(0,0,0,0.92)] pointer-events-none"
              style={{ borderRadius: "50%" }}
            />

            {/* Rotating 100% Circular Picture Disc */}
            <div
              className="relative w-full h-full overflow-hidden border-[4px] border-[#0c0a12]"
              style={{
                borderRadius: "50%",
                animation: isPlaying
                  ? `spin ${rpm === 45 ? "2.2s" : "3.6s"} linear infinite`
                  : "none",
              }}
            >
              {/* Picture Disc Full Artwork Background */}
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                style={{
                  borderRadius: "50%",
                  filter: currentTrack.coverFilter,
                  transform: "scale(1.18)",
                }}
              />

              {/* Riso Stippled Halftone Dot Screen Texture Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-45 mix-blend-multiply"
                style={{
                  borderRadius: "50%",
                  backgroundImage:
                    "radial-gradient(#100e09 1.5px, transparent 1.5px), radial-gradient(#100e09 1px, transparent 1px)",
                  backgroundSize: "8px 8px, 4px 4px",
                  backgroundPosition: "0 0, 4px 4px",
                }}
              />

              {/* Concentric Dark Vinyl Groove Etchings (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
                viewBox="0 0 240 240"
              >
                {/* Micro-groove rings etched across the artwork */}
                <circle cx="120" cy="120" r="116" fill="none" stroke="#000" strokeWidth="2.5" />
                <circle cx="120" cy="120" r="111" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" />
                <circle cx="120" cy="120" r="105" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
                <circle cx="120" cy="120" r="98" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
                <circle cx="120" cy="120" r="91" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
                <circle cx="120" cy="120" r="84" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" />
                <circle cx="120" cy="120" r="76" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" />
                <circle cx="120" cy="120" r="68" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" />
                <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2" />
                <circle cx="120" cy="120" r="52" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" />
                <circle cx="120" cy="120" r="44" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" />
                <circle cx="120" cy="120" r="38" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" />
              </svg>

              {/* Glossy Vinyl Specular Reflection Sheen */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 40deg, transparent 0deg, rgba(255,255,255,0.7) 35deg, transparent 75deg, transparent 180deg, rgba(255,255,255,0.7) 215deg, transparent 255deg)",
                }}
              />

              {/* True Circular Center Dead-Wax Hub */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ borderRadius: "50%" }}
              >
                <div
                  className="w-16 h-16 sm:w-18 sm:h-18 bg-[#14121a]/95 border-2 border-black/85 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center p-1"
                  style={{ borderRadius: "50%" }}
                >
                  <span
                    className="text-[6.5px] font-mono uppercase font-black tracking-tight leading-none truncate max-w-[50px]"
                    style={{ color: currentTrack.color }}
                  >
                    {currentTrack.genre}
                  </span>
                  <span className="text-[5.5px] font-mono text-[#e8e2d8]/80 font-bold mt-0.5">
                    SIDE A // {rpm}
                  </span>

                  {/* Circular Center Spindle Hole */}
                  <div
                    className="w-2.5 h-2.5 bg-[#3a3642] border-[1.5px] border-[#0a080e] shadow-inner mt-1"
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              </div>
            </div>

            {/* Play / Pause Circular Hover Ring */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderRadius: "50%" }}
            >
              <div
                className="w-11 h-11 bg-black/75 border border-white/20 flex items-center justify-center shadow-lg"
                style={{ borderRadius: "50%" }}
              >
                <span className="material-symbols-outlined text-white text-2xl drop-shadow">
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick status prompt with stippled indicator */}
          <div className="text-[11px] font-mono text-outline mt-3 flex items-center gap-1.5 z-10">
            <span className="material-symbols-outlined text-[14px] text-secondary">
              {isPlaying ? "grain" : "touch_app"}
            </span>
            <span>
              {isPlaying ? "Playing with stipple audio" : "Click circular vinyl to spin"}
            </span>
          </div>
        </div>

        {/* ─── RIGHT: PLAYLIST SELECTOR & CONTROLS ─── */}
        <div className="md:col-span-7 flex flex-col gap-space-xs">
          {/* NOW PLAYING DISPLAY */}
          <div className="bg-surface-container-lowest p-space-sm border border-outline-variant/30 flex items-center justify-between shadow-inner">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-[9px] uppercase tracking-wider text-secondary font-bold">
                  {isPlaying ? "NOW SPINNING" : "LOADED TRACK"}
                </span>
                <span className="text-outline text-[10px]">•</span>
                <span className="font-label-sm text-[9px] text-tertiary font-mono">
                  {currentTrack.key} // {currentTrack.tempo} BPM
                </span>
              </div>
              <p className="font-title-md text-[15px] font-bold text-on-surface truncate leading-tight mt-0.5">
                {currentTrack.title}
              </p>
              <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Stippled Halftone Dot Equalizer Waveform */}
            <div
              className="flex items-end gap-1.5 h-8 px-2.5 shrink-0 bg-surface-container-high/40 border border-outline-variant/20 py-1"
              title="Stippled audio equalizer"
            >
              {[1, 2, 3, 4, 5].map((colIndex) => {
                const dotCount = isPlaying
                  ? Math.max(1, Math.min(5, Math.floor(Math.sin((stipplePulse + colIndex * 2) * 0.8) * 2.5 + 3)))
                  : 1;
                return (
                  <div key={colIndex} className="flex flex-col-reverse gap-1">
                    {[1, 2, 3, 4, 5].map((dotIndex) => {
                      const isActive = dotIndex <= dotCount;
                      return (
                        <span
                          key={dotIndex}
                          className="w-1.5 h-1.5 transition-colors duration-75"
                          style={{
                            borderRadius: "50%",
                            backgroundColor: isActive
                              ? currentTrack.color
                              : "rgba(146, 143, 156, 0.25)",
                            boxShadow:
                              isActive && dotIndex === dotCount
                                ? `0 0 4px ${currentTrack.color}`
                                : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACKLIST SELECTOR */}
          <div className="flex flex-col gap-1 mt-1 max-h-[175px] overflow-y-auto pr-1">
            {TRACKS.map((track, idx) => {
              const isSelected = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between border transition-all text-xs ${
                    isSelected
                      ? "bg-surface-container border-secondary text-on-surface shadow-[2px_2px_0px_#100e09]"
                      : "bg-surface-container/50 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono text-[10px] font-bold w-4 shrink-0 ${
                        isSelected ? "text-secondary" : "text-outline"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-on-surface mr-1.5">
                        {track.title}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        — {track.artist}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-[10px] font-mono text-outline uppercase hidden sm:inline">
                      {track.genre}
                    </span>
                    {isSelected && isPlaying ? (
                      <span
                        className="w-2.5 h-2.5 bg-secondary animate-ping"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[14px] text-outline opacity-60">
                        play_arrow
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* COMPACT AUDIO TRANSPORT BAR */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 mt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevTrack}
                className="w-7 h-7 bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface border border-outline-variant/30 transition-colors"
                title="Previous Track"
              >
                <span className="material-symbols-outlined text-[16px]">skip_previous</span>
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-3 h-7 bg-secondary text-on-secondary hover:bg-secondary-fixed flex items-center gap-1 font-mono text-xs font-bold shadow-[2px_2px_0px_#100e09] transition-all"
                title={isPlaying ? "Pause Demo" : "Play Demo"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
                <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>

              <button
                onClick={handleNextTrack}
                className="w-7 h-7 bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface border border-outline-variant/30 transition-colors"
                title="Next Track"
              >
                <span className="material-symbols-outlined text-[16px]">skip_next</span>
              </button>
            </div>

            {/* Volume Control Slider */}
            <div className="flex items-center gap-1.5 text-outline">
              <span className="material-symbols-outlined text-[16px]">
                {volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-secondary h-1 cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

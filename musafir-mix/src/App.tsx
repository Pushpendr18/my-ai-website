/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Radio, Train, CloudRain, Coffee,
  Ticket, Sparkles, MapPin, Music, RefreshCw, ExternalLink
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  ytId: string;
  thumb: string;
}

const PLAYLIST_ID = "PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna";

const PLAYLIST: Track[] = [
  { id: 0, title: "Safarnama", artist: "Lucky Ali", album: "Tamasha", duration: "4:12", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
  { id: 1, title: "Yun Hi Chala Chal", artist: "Udit Narayan & Hariharan", album: "Swades", duration: "7:28", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80" },
  { id: 2, title: "Ilahi", artist: "Arijit Singh", album: "YJHD", duration: "3:48", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80" },
  { id: 3, title: "Kabira (Acoustic)", artist: "Tochi Raina & Rekha Bhardwaj", album: "YJHD", duration: "4:11", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
  { id: 4, title: "Phir Se Ud Chala", artist: "Mohit Chauhan", album: "Rockstar", duration: "4:31", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" },
  { id: 5, title: "Aao Milo Chalo", artist: "Shaan & Sultan Khan", album: "Jab We Met", duration: "5:28", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80" },
  { id: 6, title: "Choo Lo", artist: "The Local Train", album: "Aalas Ka Pedh", duration: "3:54", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
  { id: 7, title: "Tanha Dil", artist: "Shaan", album: "Tanha Dil", duration: "4:45", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80" },
  { id: 8, title: "Journey Song", artist: "Anupam Roy & Shreya Ghoshal", album: "Piku", duration: "4:12", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80" },
  { id: 9, title: "Patakha Guddi", artist: "Nooran Sisters", album: "Highway", duration: "4:44", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80" },
  { id: 10, title: "Khwabon Ke Parindey", artist: "Mohit Chauhan", album: "ZNMD", duration: "4:13", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400&q=80" },
  { id: 11, title: "Yeh Jo Des Hai Tera", artist: "A.R. Rahman", album: "Swades", duration: "5:28", ytId: "_J0-YKRHuEg", thumb: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80" },
];

const QUOTES = [
  { text: '"Subah ki pehli chai, khidki waali seat, aur kaanon mein Musafir Mix..."', tag: '🏷️ MORNING ROAD TRIP' },
  { text: '"Banjaara dil, lambi sadak, aur shyam ka dhalta suraj..."', tag: '🌅 GOLDEN HOUR' },
  { text: '"Safar khoobsurat hai manzil se bhi... ~ Musafir"', tag: '✨ WANDERLUST WISDOM' },
  { text: '"Yaad hai woh sleeper class ki khidki se hawa ka jhonka?"', tag: '🚂 INDIAN RAILWAYS MEMORY' },
  { text: '"Highway dhaba, kulhad wali chai, aur radio par chalta purana naghma..."', tag: '☕ HIGHWAY DHABA' },
  { text: '"Purani cassette ko pencil se rewind karne wala daur..."', tag: '📼 RETRO NOSTALGIA' }
];

export default function App() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [chaiSips, setChaiSips] = useState(0);
  const [trainSoundActive, setTrainSoundActive] = useState(false);
  const [rainSoundActive, setRainSoundActive] = useState(false);
  const [showPencilModal, setShowPencilModal] = useState(false);
  const [radioFreq, setRadioFreq] = useState("93.5");
  const [cassetteSide, setCassetteSide] = useState("SIDE A: HIGHWAY HITS");
  const [sceneryMode, setSceneryMode] = useState<"sunset" | "monsoon" | "night">("sunset");
  const [ticketName, setTicketName] = useState("Musafir Wanderer");
  const [ticketDest, setTicketDest] = useState("Sukoon (Peace)");
  const [clockTime, setClockTime] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const trainAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const rainAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Load YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    } else {
      initYTPlayer();
    }
  }, []);

  const initYTPlayer = () => {
    if (ytPlayerRef.current) return;
    try {
      ytPlayerRef.current = new window.YT.Player('youtube-player-hidden', {
        height: '0',
        width: '0',
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          'loop': 1,
          'playsinline': 1,
          'listType': 'playlist',
          'list': PLAYLIST_ID,
        },
        events: {
          'onStateChange': (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlaylistIndex === 'function') {
                const idx = ytPlayerRef.current.getPlaylistIndex();
                if (idx !== undefined && idx >= 0 && idx < PLAYLIST.length) {
                  setCurrentTrackIdx(idx);
                }
              }
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          }
        }
      });
    } catch (err) {
      console.log('YT Player Init error', err);
    }
  };

  // Live Progress & Timer loop
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          const cur = ytPlayerRef.current.getCurrentTime() || 0;
          const dur = ytPlayerRef.current.getDuration() || 240;
          if (dur > 0) {
            const pct = (cur / dur) * 100;
            setProgress(pct);
            const mins = Math.floor(cur / 60);
            const secs = Math.floor(cur % 60);
            setCurrentTimeStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
          }
        } else {
          // Fallback timer if YT isn't ready
          setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
        }
      }, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    setClockTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    return () => clearInterval(timer);
  }, []);

  // Quote Rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio Helpers
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playClickSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.log(e);
    }
  };

  const playRatchetSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      console.log(e);
    }
  };

  const playHornSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(320, ctx.currentTime);
      osc2.frequency.setValueAtTime(420, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log(e);
    }
  };

  const playClinkSound = () => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleTrainTrackSound = () => {
    playClickSound();
    if (trainSoundActive) {
      if (trainAudioRef.current) trainAudioRef.current.stop();
      trainAudioRef.current = null;
      setTrainSoundActive(false);
    } else {
      try {
        const ctx = getAudioCtx();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        const gain = ctx.createGain();
        gain.gain.value = 0.08;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        trainAudioRef.current = noise;
        setTrainSoundActive(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const toggleRainAmbience = () => {
    playClickSound();
    if (rainSoundActive) {
      if (rainAudioRef.current) rainAudioRef.current.stop();
      rainAudioRef.current = null;
      setRainSoundActive(false);
    } else {
      try {
        const ctx = getAudioCtx();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;
        const gain = ctx.createGain();
        gain.gain.value = 0.05;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        rainAudioRef.current = noise;
        setRainSoundActive(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handlePlayToggle = () => {
    playClickSound();
    if (ytPlayerRef.current) {
      if (isPlaying) {
        if (typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
        setIsPlaying(false);
      } else {
        if (typeof ytPlayerRef.current.playVideo === 'function') {
          ytPlayerRef.current.playVideo();
        }
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectTrack = (idx: number) => {
    playClickSound();
    setCurrentTrackIdx(idx);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTimeStr("0:00");

    if (ytPlayerRef.current) {
      if (typeof ytPlayerRef.current.playVideoAt === 'function') {
        ytPlayerRef.current.playVideoAt(idx);
      } else if (typeof ytPlayerRef.current.loadPlaylist === 'function') {
        ytPlayerRef.current.loadPlaylist({
          list: PLAYLIST_ID,
          listType: 'playlist',
          index: idx
        });
      }
    }
  };

  const handleSeek = (newPct: number) => {
    setProgress(newPct);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.getDuration === 'function') {
      const dur = ytPlayerRef.current.getDuration();
      if (dur) {
        ytPlayerRef.current.seekTo((newPct / 100) * dur, true);
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(newVol);
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (ytPlayerRef.current) {
      if (nextMute && typeof ytPlayerRef.current.mute === 'function') {
        ytPlayerRef.current.mute();
      } else if (!nextMute && typeof ytPlayerRef.current.unMute === 'function') {
        ytPlayerRef.current.unMute();
      }
    }
  };

  const handleSipChai = () => {
    playClinkSound();
    setChaiSips((prev) => prev + 1);
  };

  const randomizeTicket = () => {
    playClickSound();
    const names = ["Musafir Wanderer", "Aman Sharma", "Kavya Malhotra", "Rohit Verma", "Simran Kaur", "Arjun Kapoor"];
    const dests = ["Sukoon (Peace)", "Manali Pass", "Banaras Ghats", "Gokarna Beach", "Darjeeling Hills"];
    setTicketName(names[Math.floor(Math.random() * names.length)]);
    setTicketDest(dests[Math.floor(Math.random() * dests.length)]);
  };

  const currentTrack = PLAYLIST[currentTrackIdx];

  const getSceneryUrl = () => {
    if (sceneryMode === 'monsoon') return 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80';
    if (sceneryMode === 'night') return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#e6d5b8] font-sans relative overflow-x-hidden pb-36 selection:bg-[#8b5e34] selection:text-white">
      
      {/* Hidden YouTube Iframe Player Holder */}
      <div id="youtube-player-hidden" className="hidden pointer-events-none" />

      {/* Background Radial Gradient & Image Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000 opacity-20 pointer-events-none" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')` }}
      />
      
      {/* Film Vignette & Dot Matrix Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none film-overlay bg-grid-dots" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6">
        
        {/* Top Status Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#2c1e14]/80 backdrop-blur-md border border-[#d4a373]/25 text-xs sm:text-sm mb-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#8b5e34]/30 text-[#d4a373] border border-[#d4a373]/30">
              <span className="w-2 h-2 rounded-full bg-[#d4a373] mr-2 animate-pulse" />
              FM {radioFreq} SAFAR STEREO
            </span>
            <span className="text-[#e6d5b8]/70 hidden sm:inline">• LUCKNOW-MANALI HIGHWAY</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-[#d4a373] bg-[#1a120b] px-2.5 py-1 rounded border border-[#8b5e34]/40 font-bold">
              {clockTime}
            </span>
            <button 
              onClick={toggleTrainTrackSound} 
              className={`px-3 py-1 rounded-lg border text-xs font-mono transition flex items-center space-x-1.5 ${
                trainSoundActive 
                  ? 'bg-[#8b5e34] border-[#d4a373] text-[#1a120b] font-bold shadow-md' 
                  : 'bg-[#1a120b]/80 border-[#d4a373]/30 text-[#e6d5b8] hover:border-[#d4a373]/60'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Train: {trainSoundActive ? 'ON' : 'OFF'}</span>
            </button>
            <button 
              onClick={toggleRainAmbience} 
              className={`px-3 py-1 rounded-lg border text-xs font-mono transition flex items-center space-x-1.5 ${
                rainSoundActive 
                  ? 'bg-[#5c728a] border-[#a2b8d0] text-[#1a120b] font-bold shadow-md' 
                  : 'bg-[#1a120b]/80 border-[#d4a373]/30 text-[#e6d5b8] hover:border-[#d4a373]/60'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain: {rainSoundActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </header>

        {/* Title Hero */}
        <section className="text-center my-8">
          <p className="text-xs sm:text-sm font-serif italic text-[#d4a373] tracking-widest uppercase mb-2">
            Vol. 1 • The Wanderer's Mixtape • 1998-2026
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e6d5b8] via-[#d4a373] to-[#c28e5c] drop-shadow-md">
            MUSAFIR MIX
          </h1>
          <p className="text-lg sm:text-2xl font-serif italic text-[#e6d5b8]/80 mt-2">
            मुसाफ़िर मिक्स — Raasto Ka Naghma, Yaado Ka Safar
          </p>

          <div className="mt-3 inline-flex items-center space-x-2 bg-[#2c1e14]/90 px-3.5 py-1.5 rounded-full border border-[#d4a373]/40 text-xs font-mono text-[#d4a373]">
            <Music className="w-3.5 h-3.5" />
            <span>PLAYLIST: PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna</span>
            <a 
              href={`https://youtube.com/playlist?list=${PLAYLIST_ID}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#e6d5b8] hover:text-[#d4a373] underline flex items-center space-x-1 ml-1"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Rotating Quote Banner */}
          <div className="mt-6 max-w-2xl mx-auto px-6 py-4 rounded-2xl bg-[#2c1e14]/70 backdrop-blur-md border border-[#d4a373]/30 relative text-left shadow-lg">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8b5e34] rounded-l-2xl" />
            <p className="text-base sm:text-lg italic text-[#e6d5b8] font-serif transition-all duration-500 leading-relaxed">
              {QUOTES[quoteIdx].text}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-[#d4a373] font-mono">
              <span className="font-semibold">{QUOTES[quoteIdx].tag}</span>
              <span className="animate-pulse text-[10px] bg-[#1a120b] px-2 py-0.5 rounded border border-[#8b5e34]/40">AUTO-ROTATING ⚡</span>
            </div>
          </div>
        </section>

        {/* CENTRAL NOSTALGIC CASSETTE TAPE PLAYER */}
        <section className="my-10 max-w-3xl mx-auto">
          <div className="relative rounded-3xl glass-card-natural p-6 sm:p-9 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#d4a373]/20 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#8b5e34] animate-ping" />
                <span className="font-mono text-xs text-[#d4a373] tracking-widest font-bold">PHILIPS STEREO CASSETTE C-90</span>
              </div>
              <button 
                onClick={() => { 
                  playClickSound(); 
                  setCassetteSide(cassetteSide.includes('SIDE A') ? 'SIDE B: ACOUSTIC MIDNIGHT' : 'SIDE A: HIGHWAY HITS'); 
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1a120b] border border-[#d4a373]/40 text-[#d4a373] text-xs font-mono hover:bg-[#2c1e14] transition shadow-sm"
              >
                {cassetteSide}
              </button>
            </div>

            {/* Cassette Tape Illustration */}
            <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#2c1e14] via-[#1a120b] to-[#120b07] p-6 rounded-2xl border-4 border-[#8b5e34]/60 shadow-inner">
              <div className="bg-[#e6d5b8] text-[#1a120b] p-4 rounded-xl border border-[#8b5e34] shadow-md">
                
                <div className="flex justify-between items-start border-b border-[#8b5e34]/40 pb-2 mb-3">
                  <div>
                    <span className="font-mono text-[11px] font-bold tracking-wider uppercase block text-[#8b5e34]">TDK SA-90 • HIGH POSITION</span>
                    <h3 className="font-serif font-bold text-xl text-[#1a120b] leading-tight">Musafir Mix — {currentTrack.title}</h3>
                  </div>
                  <span className="font-mono text-xs bg-[#1a120b] text-[#e6d5b8] px-2.5 py-1 rounded font-bold shadow-sm">STEREO C-90</span>
                </div>

                <div className="relative bg-[#1a120b] rounded-xl p-3 border-2 border-[#2c1e14] flex items-center justify-around h-32 my-2 overflow-hidden shadow-inner">
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-10 bg-[#2c1e14]/90 border-y border-[#8b5e34]/40 pointer-events-none" />

                  {/* Left Reel */}
                  <div className="relative z-10 text-center">
                    <div 
                      onClick={() => playRatchetSound()}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#d4a373] bg-gradient-to-br from-[#8b5e34] to-[#1a120b] flex items-center justify-center relative cursor-pointer shadow-lg transition-transform ${
                        isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                      }`}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-[#e6d5b8] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#d4a373] rounded-sm" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#1a120b] mt-1.5 block font-bold">REEL A</span>
                  </div>

                  <div className="z-10 text-center font-mono text-xs text-[#d4a373] bg-[#1a120b] px-3 py-1.5 rounded-lg border border-[#8b5e34]/40 shadow">
                    <span className="text-[#e6d5b8] font-bold text-sm">{currentTimeStr} / {currentTrack.duration}</span>
                    <div className="w-20 h-2 bg-[#2c1e14] rounded-full mt-1.5 overflow-hidden border border-[#8b5e34]/30">
                      <div className="h-full bg-[#d4a373] transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {/* Right Reel */}
                  <div className="relative z-10 text-center">
                    <div 
                      onClick={() => playRatchetSound()}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#d4a373] bg-gradient-to-br from-[#8b5e34] to-[#1a120b] flex items-center justify-center relative cursor-pointer shadow-lg transition-transform ${
                        isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                      }`}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-[#e6d5b8] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#d4a373] rounded-sm" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#1a120b] mt-1.5 block font-bold">REEL B</span>
                  </div>

                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-[#1a120b] font-bold pt-1">
                  <span>A-SIDE: 45:00</span>
                  <span>RECORDED ON HIGHWAY STEREO</span>
                  <span>B-SIDE: 45:00</span>
                </div>

              </div>

              {/* Tape Player Controls */}
              <div className="mt-6 grid grid-cols-5 gap-2 text-center">
                <button 
                  onClick={() => { 
                    playRatchetSound(); 
                    setCurrentTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length); 
                    setIsPlaying(true);
                  }} 
                  className="p-3 rounded-xl bg-[#2c1e14] border border-[#8b5e34]/50 text-[#e6d5b8] text-xs font-mono hover:bg-[#8b5e34] hover:text-[#1a120b] transition font-semibold"
                >
                  ⏪ REW
                </button>
                <button 
                  onClick={handlePlayToggle} 
                  className="p-3 rounded-xl bg-[#8b5e34] border border-[#d4a373] text-[#1a120b] font-bold text-xs font-mono flex items-center justify-center space-x-1 hover:bg-[#d4a373] transition shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button 
                  onClick={() => { playClickSound(); setIsPlaying(false); }} 
                  className="p-3 rounded-xl bg-[#2c1e14] border border-[#8b5e34]/50 text-[#e6d5b8] text-xs font-mono hover:bg-[#8b5e34] hover:text-[#1a120b] transition font-semibold"
                >
                  ⏸ STOP
                </button>
                <button 
                  onClick={() => { 
                    playRatchetSound(); 
                    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length); 
                    setIsPlaying(true);
                  }} 
                  className="p-3 rounded-xl bg-[#2c1e14] border border-[#8b5e34]/50 text-[#e6d5b8] text-xs font-mono hover:bg-[#8b5e34] hover:text-[#1a120b] transition font-semibold"
                >
                  ⏩ FWD
                </button>
                <button 
                  onClick={() => { playRatchetSound(); setShowPencilModal(true); }} 
                  className="p-3 rounded-xl bg-[#1a120b] border border-[#d4a373]/50 text-[#d4a373] text-xs font-mono hover:bg-[#8b5e34] hover:text-[#1a120b] transition font-semibold"
                >
                  ✏️ PENCIL
                </button>
              </div>
            </div>

            {/* Pencil Overlay Modal */}
            {showPencilModal && (
              <div className="absolute inset-0 z-30 bg-[#1a120b]/90 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-2 border-[#d4a373]">
                <div className="text-6xl mb-4 animate-spin text-[#d4a373]">✏️</div>
                <h4 className="font-serif text-2xl text-[#d4a373] font-bold mb-2">Manually Rewinding Cassette Tape...</h4>
                <p className="text-xs font-mono text-[#e6d5b8]/90 max-w-sm mb-6 leading-relaxed">
                  Inserting an HB Natraj pencil into the spool gears saves Walkman battery on long train rides!
                </p>
                <button 
                  onClick={() => { playClickSound(); setShowPencilModal(false); }} 
                  className="px-6 py-2.5 rounded-xl bg-[#8b5e34] text-[#1a120b] font-bold text-xs font-mono hover:bg-[#d4a373] transition shadow-lg"
                >
                  DONE REWINDING
                </button>
              </div>
            )}

          </div>
        </section>

        {/* CULTURAL ARTIFACTS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          
          {/* Chai Glass */}
          <div className="rounded-2xl glass-card-natural p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#d4a373]">HIGHWAY DHABA SPECIAL</span>
                <span className="text-xs font-mono text-[#1a120b] bg-[#d4a373] px-2.5 py-0.5 rounded font-bold">₹10 / Glass</span>
              </div>
              <h3 className="font-serif text-2xl text-[#e6d5b8] font-bold mb-1">Cutting Chai</h3>
              <p className="text-xs text-[#e6d5b8]/70 mb-4">Fresh cardamom & ginger warmth served in glass at 3 AM on the highway.</p>
              
              <div 
                onClick={handleSipChai} 
                className="w-32 h-36 mx-auto my-3 cursor-pointer flex flex-col items-center justify-center bg-[#1a120b]/80 rounded-2xl border border-[#d4a373]/30 hover:border-[#d4a373] transition p-3 shadow-inner group"
              >
                <Coffee className="w-12 h-12 text-[#d4a373] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-[#d4a373]">Click to Sip!</span>
              </div>
            </div>
            <button 
              onClick={handleSipChai} 
              className="w-full py-2.5 rounded-xl bg-[#8b5e34] hover:bg-[#d4a373] hover:text-[#1a120b] text-[#e6d5b8] font-mono text-xs font-bold transition shadow-sm"
            >
              ☕ TAKE A CHAI SIP (SIPS: {chaiSips})
            </button>
          </div>

          {/* Train Window */}
          <div className="rounded-2xl glass-card-natural p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#d4a373]">SLEEPER KHIDKI</span>
                <span className="text-xs font-mono text-[#e6d5b8] bg-[#2c1e14] px-2.5 py-0.5 rounded border border-[#8b5e34]/40">SL-24 • WINDOW</span>
              </div>
              <h3 className="font-serif text-2xl text-[#e6d5b8] font-bold mb-1">Passing Landscapes</h3>
              <p className="text-xs text-[#e6d5b8]/70 mb-3">Cool wind, passing telephone posts, and endless horizon.</p>
              
              <div 
                className="h-36 rounded-xl border-2 border-[#8b5e34]/60 overflow-hidden relative bg-cover bg-center transition-all duration-700 shadow-md" 
                style={{ backgroundImage: `url('${getSceneryUrl()}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] font-mono">
              <button 
                onClick={() => { playClickSound(); setSceneryMode('sunset'); }} 
                className={`p-2 rounded-lg border text-center transition ${sceneryMode === 'sunset' ? 'bg-[#8b5e34] border-[#d4a373] text-[#1a120b] font-bold' : 'bg-[#1a120b] border-[#8b5e34]/40 text-[#e6d5b8]'}`}
              >
                🌅 Sunset
              </button>
              <button 
                onClick={() => { playClickSound(); setSceneryMode('monsoon'); }} 
                className={`p-2 rounded-lg border text-center transition ${sceneryMode === 'monsoon' ? 'bg-[#5c728a] border-[#a2b8d0] text-[#1a120b] font-bold' : 'bg-[#1a120b] border-[#8b5e34]/40 text-[#e6d5b8]'}`}
              >
                🌧️ Rain
              </button>
              <button 
                onClick={() => { playClickSound(); setSceneryMode('night'); }} 
                className={`p-2 rounded-lg border text-center transition ${sceneryMode === 'night' ? 'bg-[#3d3248] border-[#a28ad0] text-[#e6d5b8] font-bold' : 'bg-[#1a120b] border-[#8b5e34]/40 text-[#e6d5b8]'}`}
              >
                🌌 Night
              </button>
            </div>
          </div>

          {/* Radio Tuner & Horn */}
          <div className="rounded-2xl glass-card-natural p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#d4a373]">ANALOG FREQUENCY</span>
                <span className="text-xs font-mono text-[#d4a373] bg-[#1a120b] px-2.5 py-0.5 rounded border border-[#8b5e34]/40">FM STEREO</span>
              </div>
              <h3 className="font-serif text-2xl text-[#e6d5b8] font-bold mb-1">Radio Tuner</h3>
              <p className="text-xs text-[#e6d5b8]/70 mb-4">Tune into highway frequencies for retro nostalgia.</p>
              
              <div className="bg-[#1a120b] rounded-xl p-4 border border-[#8b5e34]/40 font-mono text-xs shadow-inner">
                <input 
                  type="range" min="88" max="108" step="0.5" value={radioFreq} 
                  onChange={(e) => setRadioFreq(e.target.value)} 
                  className="w-full accent-[#d4a373] cursor-pointer h-2 bg-[#2c1e14] rounded-lg"
                />
                <div className="mt-3 flex items-center justify-between text-[#e6d5b8] text-[11px]">
                  <span>FREQ: <strong className="text-[#d4a373] font-bold">{radioFreq} MHz</strong></span>
                  <span className="bg-[#8b5e34]/30 text-[#d4a373] px-2 py-0.5 rounded font-bold">
                    {radioFreq === "93.5" ? "CLEAR" : "SIGNAL OK"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button 
                  onClick={playHornSound} 
                  className="w-full py-2.5 rounded-xl bg-[#8b5e34]/60 border border-[#d4a373]/50 text-[#e6d5b8] text-xs font-bold font-mono hover:bg-[#8b5e34] hover:text-[#1a120b] transition shadow-sm"
                >
                  🎺 HORN OK PLEASE
                </button>
              </div>
            </div>
            <div className="mt-4 pt-2 text-center text-xs italic text-[#d4a373]/90 font-serif">
              "Buri Nazar Wale Tera Muh Kala"
            </div>
          </div>

        </section>

        {/* SOUVENIR TICKET STUB GENERATOR */}
        <section className="my-12 rounded-3xl glass-card-natural p-6 sm:p-9 shadow-2xl">
          <div className="flex items-center justify-between mb-6 border-b border-[#d4a373]/20 pb-4">
            <div>
              <span className="text-xs font-mono text-[#d4a373] uppercase tracking-widest block font-bold">SOUVENIR TICKET</span>
              <h2 className="text-3xl font-serif font-bold text-[#e6d5b8]">Personalized Journey Ticket</h2>
            </div>
            <button 
              onClick={randomizeTicket} 
              className="px-4 py-2 rounded-xl bg-[#8b5e34] text-[#1a120b] font-mono text-xs font-bold flex items-center space-x-1.5 hover:bg-[#d4a373] transition shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>RANDOMIZE</span>
            </button>
          </div>

          <div className="max-w-2xl mx-auto bg-[#e6d5b8] text-[#1a120b] p-6 sm:p-8 rounded-2xl border-2 border-dashed border-[#8b5e34] font-mono shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center border-b-2 border-[#8b5e34]/40 pb-3 mb-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1a120b]">INDIAN RAILWAYS & HIGHWAY TRANSIT</h4>
                <span className="text-xs text-[#8b5e34] font-bold">TICKET NO: #MSR-1998-2026</span>
              </div>
              <span className="bg-[#1a120b] text-[#e6d5b8] text-xs px-3 py-1 rounded font-bold shadow-sm">SL / WINDOW</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#8b5e34] block text-[10px] font-bold uppercase">PASSENGER NAME</span>
                <input 
                  type="text" 
                  value={ticketName} 
                  onChange={(e) => setTicketName(e.target.value)} 
                  className="w-full bg-[#d4a373]/20 border-b-2 border-[#1a120b] font-bold px-1 py-1 text-xs focus:outline-none" 
                />
              </div>
              <div>
                <span className="text-[#8b5e34] block text-[10px] font-bold uppercase">DESTINATION</span>
                <select 
                  value={ticketDest} 
                  onChange={(e) => setTicketDest(e.target.value)} 
                  className="w-full bg-[#d4a373]/20 border-b-2 border-[#1a120b] font-bold px-1 py-1 text-xs focus:outline-none"
                >
                  <option value="Sukoon (Peace)">Sukoon (Peace)</option>
                  <option value="Manali Pass">Manali Pass</option>
                  <option value="Banaras Ghats">Banaras Ghats</option>
                  <option value="Gokarna Beach">Gokarna Beach</option>
                  <option value="Darjeeling Hills">Darjeeling Hills</option>
                </select>
              </div>
              <div>
                <span className="text-[#8b5e34] block text-[10px] font-bold uppercase">SEAT</span>
                <span className="font-bold text-[#1a120b] block pt-1">S-4 / 24 (WINDOW)</span>
              </div>
              <div>
                <span className="text-[#8b5e34] block text-[10px] font-bold uppercase">FARE</span>
                <span className="font-bold text-[#1a120b] block pt-1">₹0.00 (Priceless)</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRACKLIST GRID */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-serif font-bold text-[#e6d5b8]">Musafir Playlist Tracks</h2>
            <span className="text-xs font-mono text-[#d4a373] bg-[#2c1e14] px-3 py-1 rounded-full border border-[#8b5e34]/30">
              {PLAYLIST.length} TIMELINE MELODIES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLAYLIST.map((track, i) => {
              const isActive = i === currentTrackIdx;
              return (
                <div 
                  key={track.id} 
                  onClick={() => handleSelectTrack(i)}
                  className={`rounded-2xl p-4 glass-card-natural transition-all duration-300 cursor-pointer flex items-center space-x-4 group ${
                    isActive 
                      ? 'border-[#d4a373] bg-[#2c1e14]/90 shadow-xl ring-2 ring-[#d4a373]/30 scale-[1.02]' 
                      : 'hover:border-[#d4a373]/60 hover:bg-[#2c1e14]/80'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#8b5e34]/40 shadow-sm">
                    <img src={track.thumb} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    {isActive && (
                      <div className="absolute inset-0 bg-[#1a120b]/60 backdrop-blur-[2px] flex items-center justify-center text-[#d4a373]">
                        <Play className="w-6 h-6 fill-current animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#d4a373] font-bold uppercase">TRACK 0{i+1}</span>
                      <span className="text-[10px] font-mono text-[#e6d5b8]/60">{track.duration}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#e6d5b8] truncate group-hover:text-[#d4a373] transition">
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#e6d5b8]/70 truncate">{track.artist} • {track.album}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* FIXED GLASSMORPHISM BOTTOM PLAYER */}
      <footer className="fixed bottom-0 inset-x-0 z-40 glass-player-natural py-3.5 px-4 sm:px-8 text-[#e6d5b8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Track Details */}
          <div className="flex items-center space-x-3.5 w-full md:w-1/3">
            <img src={currentTrack.thumb} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover border border-[#8b5e34] shadow-sm" />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-[#e6d5b8] truncate">{currentTrack.title}</h4>
              <p className="text-xs text-[#d4a373] truncate">{currentTrack.artist} • {currentTrack.album}</p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex flex-col items-center justify-center w-full md:w-2/5 space-y-1.5">
            <div className="flex items-center space-x-5">
              <button 
                onClick={() => {
                  playClickSound();
                  const prevIdx = (currentTrackIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
                  handleSelectTrack(prevIdx);
                }} 
                className="text-[#d4a373] hover:text-[#e6d5b8] transition"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePlayToggle} 
                className="w-10 h-10 rounded-full bg-[#8b5e34] text-[#1a120b] flex items-center justify-center font-bold shadow-lg hover:bg-[#d4a373] hover:scale-105 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
              </button>
              <button 
                onClick={() => {
                  playClickSound();
                  const nextIdx = (currentTrackIdx + 1) % PLAYLIST.length;
                  handleSelectTrack(nextIdx);
                }} 
                className="text-[#d4a373] hover:text-[#e6d5b8] transition"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex items-center space-x-2.5 text-[10px] font-mono text-[#d4a373]">
              <span>{currentTimeStr}</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => handleSeek(Number(e.target.value))} 
                className="w-full accent-[#d4a373] h-1.5 bg-[#2c1e14] rounded cursor-pointer" 
              />
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end space-x-3 w-full md:w-1/3 text-xs">
            <button onClick={handleToggleMute} className="text-[#d4a373] hover:text-[#e6d5b8] transition">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={isMuted ? 0 : volume} 
              onChange={(e) => handleVolumeChange(Number(e.target.value))} 
              className="w-20 accent-[#d4a373] h-1.5 bg-[#2c1e14] rounded cursor-pointer" 
            />
          </div>

        </div>
      </footer>

    </div>
  );
}

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
  startSeconds?: number;
  endSeconds?: number;
}

const PLAYLIST: Track[] = [

  // 90s / 2000s romantic additions
  { id: 0, title: "Pehli Pehli Baar Mohabbat Ki Hai", artist: "Kumar Sanu & Alka Yagnik", album: "Sirf Tum", duration: "5:32", ytId: "MPeq5g_KbsM", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
  { id: 1, title: "Mujhse Juda Hokar", artist: "Lata Mangeshkar & S.P. Balasubrahmanyam", album: "Hum Aapke Hain Koun", duration: "6:01", ytId: "Q8bKKn8gBVY", thumb: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80" },
  { id: 2, title: "Bahut Jatate Ho Pyar", artist: "Alka Yagnik & Mohammed Aziz", album: "Aadmi Khilona Hai", duration: "7:12", ytId: "xj4CaUo4cKA", thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80" },
  { id: 3, title: "Is Pyar Se Meri Taraf Na Dekho", artist: "Kumar Sanu & Alka Yagnik", album: "Chamatkar", duration: "5:18", ytId: "DLYp9GWowYQ", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
  { id: 4, title: "Aisi Deewangi", artist: "Alka Yagnik & Vinod Rathod", album: "Deewana", duration: "6:00", ytId: "GwpqME_Cmpc", thumb: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80" },
  { id: 5, title: "Tumse Milne Ko Dil Karta Hai", artist: "Kumar Sanu & Alka Yagnik", album: "Phool Aur Kaante", duration: "5:44", ytId: "5y_TCKNzAMI", thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
  { id: 6, title: "Hum Se Tum Dosti Kar Lo", artist: "Alka Yagnik & Udit Narayan", album: "Narsimha", duration: "5:02", ytId: "b3j7_Lv1u_o", thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80" },
  { id: 7, title: "Kate Nahi Kat Te", artist: "Kishore Kumar & Alisha Chinai", album: "Mr. India", duration: "6:36", ytId: "9FjuBvzF1E4", thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
  { id: 8, title: "Hum Tumhein Itna Pyar Karenge", artist: "Mohammed Aziz & Anuradha Paudwal", album: "Bees Saal Baad", duration: "7:07", ytId: "aKIXeGe0Z6Q", thumb: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" },
  { id: 9, title: "Tune Bechain Itna Zyada Kiya", artist: "Mohammed Aziz & Anuradha Paudwal", album: "Nagina", duration: "5:34", ytId: "zXPypGnGCe4", thumb: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80" },
  { id: 10, title: "Balma Tum Balma Ho Mere Khali", artist: "Kavita Krishnamurthy", album: "Nagina", duration: "5:00", ytId: "MVMbYaGuNLM", thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80" },
  { id: 11, title: "Dhoop Mein Nikla Na Karo", artist: "Kishore Kumar & Asha Bhosle", album: "Geraftaar", duration: "5:00", ytId: "US2lSjVZcwY", thumb: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80" },
  { id: 12, title: "Hum Lakh Chupaye Pyar Magar", artist: "Asha Bhosle & Kumar Sanu", album: "Jaan Tere Naam", duration: "5:06", ytId: "wuLJtA0uJro", thumb: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80" },
  { id: 13, title: "Kahin Mujhe Pyar Hua To Nahi Hai", artist: "Kumar Sanu & Alka Yagnik", album: "Rang", duration: "5:18", ytId: "w8dJy5mls2Y", thumb: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=400&q=80" },
  { id: 14, title: "Main Teri Rani Tu Raja", artist: "Alka Yagnik & Kumar Sanu", album: "Lootere", duration: "5:20", ytId: "ULBirvnFgBE", thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80" },
  { id: 15, title: "Love Tujhe Love Main Karta Hoon", artist: "Kumar Sanu & Alka Yagnik", album: "Barsaat", duration: "5:30", ytId: "wrlhJlCqXjs", thumb: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=400&q=80" },
  { id: 16, title: "Main Agar Saamne", artist: "Abhijeet & Alka Yagnik", album: "Raaz", duration: "5:42", ytId: "eAxK5tyahUM", thumb: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" },
  { id: 17, title: "Tumsa Koi Pyaara", artist: "Kumar Sanu & Alka Yagnik", album: "Khuddar", duration: "5:20", ytId: "3NWMK2MRqIk", thumb: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80" },
  { id: 18, title: "Woh Ho Tum", artist: "Sonu Nigam & Anuradha Paudwal", album: "Muskaan", duration: "6:45", ytId: "LCl2_jiPtpg", thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
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
  const [radioStations, setRadioStations] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<any | null>(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioLoading, setRadioLoading] = useState(false);
  const [radioError, setRadioError] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const trainAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const rainAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const liveRadioRef = useRef<HTMLAudioElement | null>(null);

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
          'loop': 0,
          'playsinline': 1,
          'rel': 0,
          'modestbranding': 1,
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
            } else if (event.data === window.YT.PlayerState.ENDED) {
              const nextIdx = (currentTrackIdx + 1) % PLAYLIST.length;
              setCurrentTrackIdx(nextIdx);
              setProgress(0);
              setCurrentTimeStr('0:00');
              loadTrackInPlayer(nextIdx, true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
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

  // Discover real live internet radio stations (Hindi/Bollywood, India)
  useEffect(() => {
    let cancelled = false;
    const loadStations = async () => {
      setRadioLoading(true);
      setRadioError("");
      const endpoints = [
        'https://de1.api.radio-browser.info/json/stations/search?countrycode=IN&language=hindi&is_https=true&hidebroken=true&order=votes&reverse=true&limit=12',
        'https://de1.api.radio-browser.info/json/stations/search?countrycode=IN&tag=bollywood&is_https=true&hidebroken=true&order=votes&reverse=true&limit=12'
      ];
      try {
        const results = await Promise.all(endpoints.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Radio directory unavailable');
          return res.json();
        }));
        const merged = [...results[0], ...results[1]];
        const unique = merged.filter((station, index, arr) =>
          station.stationuuid && index === arr.findIndex((s) => s.stationuuid === station.stationuuid)
        ).filter((station) => station.url_resolved && station.lastcheckok !== 0);
        if (!cancelled) {
          setRadioStations(unique.slice(0, 12));
          if (!unique.length) setRadioError("No live stations found right now.");
        }
      } catch (error) {
        if (!cancelled) setRadioError("Live radio directory is temporarily unavailable.");
      } finally {
        if (!cancelled) setRadioLoading(false);
      }
    };
    loadStations();
    return () => { cancelled = true; };
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

  const stopLiveRadio = () => {
    if (liveRadioRef.current) {
      liveRadioRef.current.pause();
      liveRadioRef.current.removeAttribute('src');
      liveRadioRef.current.load();
    }
    setRadioPlaying(false);
  };

  const playLiveRadio = async (station: any) => {
    if (!station?.url_resolved || !liveRadioRef.current) return;
    playClickSound();
    setRadioError("");
    setSelectedRadio(station);
    setRadioLoading(true);
    try {
      // Stop the YouTube player when switching to live radio.
      ytPlayerRef.current?.pauseVideo?.();
      setIsPlaying(false);
      const audio = liveRadioRef.current;
      audio.src = station.url_resolved;
      audio.volume = Math.max(0, Math.min(1, volume / 100));
      await audio.play();
      setRadioPlaying(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `LIVE • ${station.name}`,
          artist: station.country || 'Internet Radio',
          album: 'Musafir Mix Radio',
          artwork: [{ src: station.favicon || currentTrack.thumb, sizes: '400x400', type: 'image/jpeg' }]
        });
        try { navigator.mediaSession.playbackState = 'playing'; } catch {}
      }
    } catch (error) {
      setRadioPlaying(false);
      setRadioError("This station could not be played in this browser. Try another live station.");
    } finally {
      setRadioLoading(false);
    }
  };

  const loadTrackInPlayer = (idx: number, autoplay = true) => {
    const track = PLAYLIST[idx];
    if (!track || !ytPlayerRef.current) return;
    const payload: any = {
      videoId: track.ytId,
      startSeconds: track.startSeconds || 0,
    };
    if (track.endSeconds) payload.endSeconds = track.endSeconds;
    if (autoplay && typeof ytPlayerRef.current.loadVideoById === 'function') {
      ytPlayerRef.current.loadVideoById(payload);
    } else if (typeof ytPlayerRef.current.cueVideoById === 'function') {
      ytPlayerRef.current.cueVideoById(payload);
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

    loadTrackInPlayer(idx, true);
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
    if (liveRadioRef.current) liveRadioRef.current.volume = Math.max(0, Math.min(1, newVol / 100));
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

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    try {
      navigator.mediaSession.metadata = radioPlaying && selectedRadio
        ? new MediaMetadata({
            title: `LIVE • ${selectedRadio.name}`,
            artist: selectedRadio.country || 'Internet Radio',
            album: 'Musafir Mix Radio',
            artwork: [{ src: selectedRadio.favicon || currentTrack.thumb, sizes: '400x400', type: 'image/jpeg' }]
          })
        : new MediaMetadata({
            title: currentTrack.title,
            artist: currentTrack.artist,
            album: currentTrack.album,
            artwork: [{ src: currentTrack.thumb, sizes: '400x400', type: 'image/jpeg' }]
          });
      const setAction = (action: MediaSessionAction, handler: () => void) => {
        try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
      };
      if (radioPlaying) {
        setAction('play', () => liveRadioRef.current?.play());
        setAction('pause', () => liveRadioRef.current?.pause());
        setAction('nexttrack', () => {
          const idx = radioStations.findIndex((s) => s.stationuuid === selectedRadio?.stationuuid);
          const next = radioStations[(idx + 1) % Math.max(radioStations.length, 1)];
          if (next) playLiveRadio(next);
        });
        setAction('previoustrack', () => {
          const idx = radioStations.findIndex((s) => s.stationuuid === selectedRadio?.stationuuid);
          const prev = radioStations[(idx - 1 + radioStations.length) % Math.max(radioStations.length, 1)];
          if (prev) playLiveRadio(prev);
        });
      } else {
        setAction('play', () => { ytPlayerRef.current?.playVideo?.(); setIsPlaying(true); });
        setAction('pause', () => { ytPlayerRef.current?.pauseVideo?.(); setIsPlaying(false); });
        setAction('nexttrack', () => handleSelectTrack((currentTrackIdx + 1) % PLAYLIST.length));
        setAction('previoustrack', () => handleSelectTrack((currentTrackIdx - 1 + PLAYLIST.length) % PLAYLIST.length));
        setAction('seekbackward', () => { const t = ytPlayerRef.current?.getCurrentTime?.() || 0; ytPlayerRef.current?.seekTo?.(Math.max(0, t - 10), true); });
        setAction('seekforward', () => { const t = ytPlayerRef.current?.getCurrentTime?.() || 0; ytPlayerRef.current?.seekTo?.(t + 10, true); });
      }
      try { navigator.mediaSession.playbackState = radioPlaying || isPlaying ? 'playing' : 'paused'; } catch {}
    } catch {}
  }, [currentTrackIdx, radioPlaying, selectedRadio, radioStations, isPlaying]);

  useEffect(() => {
    const audio = liveRadioRef.current;
    if (!audio) return;
    const onPlay = () => { setRadioPlaying(true); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing'; };
    const onPause = () => { setRadioPlaying(false); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; };
    const onError = () => { setRadioPlaying(false); setRadioError('The live stream dropped. Try another station.'); };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => { audio.removeEventListener('play', onPlay); audio.removeEventListener('pause', onPause); audio.removeEventListener('error', onError); };
  }, []);

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
      <audio ref={liveRadioRef} preload="none" crossOrigin="anonymous" className="hidden" />

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
            <span>PLAYLIST: MUSAFIR MIX • 19 TRACKS</span>
            <a 
              href={`https://www.youtube.com/watch?v=${PLAYLIST[currentTrackIdx].ytId}`} 
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
                    handleSelectTrack((currentTrackIdx - 1 + PLAYLIST.length) % PLAYLIST.length);
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
                    handleSelectTrack((currentTrackIdx + 1) % PLAYLIST.length);
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

        {/* LIVE INTERNET RADIO */}
        <section className="my-12 rounded-3xl glass-card-natural p-6 sm:p-9 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-b border-[#d4a373]/20 pb-4">
            <div>
              <span className="text-xs font-mono text-[#d4a373] uppercase tracking-widest block font-bold">LIVE BROADCAST • INTERNET RADIO</span>
              <h2 className="text-3xl font-serif font-bold text-[#e6d5b8]">Musafir Live Radio</h2>
              <p className="text-sm text-[#e6d5b8]/70 mt-1">Real-time radio streams — the station decides what plays next.</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${radioPlaying ? 'bg-red-950/60 border-red-400/50 text-red-300' : 'bg-[#1a120b] border-[#8b5e34]/40 text-[#d4a373]'}`}>
                <span className={`w-2 h-2 rounded-full ${radioPlaying ? 'bg-red-400 animate-pulse' : 'bg-[#8b5e34]'}`} />
                {radioPlaying ? 'ON AIR' : 'OFF AIR'}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#1a120b] border border-[#8b5e34]/40 text-[#d4a373]">LIVE</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-5">
            <div className="rounded-2xl bg-[#1a120b] border border-[#8b5e34]/40 p-5 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2c1e14] border border-[#d4a373]/30 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-[#d4a373]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-[#d4a373]">NOW TUNED TO</p>
                    <h3 className="font-serif text-lg font-bold text-[#e6d5b8]">{selectedRadio?.name || 'Select a live station'}</h3>
                  </div>
                </div>
                {radioPlaying && <span className="text-[10px] font-mono text-red-300">● LIVE AUDIO</span>}
              </div>

              <div className="rounded-xl border border-[#8b5e34]/30 bg-[#2c1e14]/60 p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#d4a373]">
                  <span>{selectedRadio?.country || 'INDIA'} • {selectedRadio?.codec || 'LIVE STREAM'}</span>
                  <span>{selectedRadio?.bitrate ? `${selectedRadio.bitrate} kbps` : '24/7'}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((i) => (
                    <span key={i} className={`h-8 flex-1 rounded-sm ${radioPlaying ? 'bg-[#d4a373]/70 animate-pulse' : 'bg-[#8b5e34]/25'}`} style={{ animationDelay: `${i * 70}ms` }} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#e6d5b8]/60">Live radio has no fixed track list — whatever the station broadcasts is heard here.</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => selectedRadio && (radioPlaying ? liveRadioRef.current?.pause() : playLiveRadio(selectedRadio))} disabled={!selectedRadio || radioLoading} className="px-4 py-2.5 rounded-xl bg-[#8b5e34] text-[#1a120b] font-mono text-xs font-bold disabled:opacity-40">
                  {radioLoading ? 'CONNECTING…' : radioPlaying ? 'PAUSE LIVE' : 'PLAY LIVE'}
                </button>
                {radioPlaying && <button onClick={stopLiveRadio} className="px-4 py-2.5 rounded-xl bg-[#1a120b] border border-[#d4a373]/40 text-[#e6d5b8] font-mono text-xs font-bold">STOP</button>}
              </div>
              {radioError && <p className="mt-3 text-xs text-red-300">{radioError}</p>}
            </div>

            <div className="rounded-2xl bg-[#1a120b] border border-[#8b5e34]/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-xl font-bold text-[#e6d5b8]">Stations</h3>
                <span className="text-[10px] font-mono text-[#d4a373]">AUTO DISCOVERED</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {radioLoading && radioStations.length === 0 ? (
                  <div className="text-sm text-[#e6d5b8]/60 py-6 text-center">Finding live Hindi stations…</div>
                ) : radioStations.length ? radioStations.map((station) => {
                  const active = selectedRadio?.stationuuid === station.stationuuid;
                  return (
                    <button key={station.stationuuid} onClick={() => playLiveRadio(station)} className={`w-full text-left p-3 rounded-xl border transition ${active ? 'bg-[#8b5e34]/50 border-[#d4a373]' : 'bg-[#2c1e14]/60 border-[#8b5e34]/25 hover:border-[#d4a373]/60'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#e6d5b8] truncate">{station.name}</p>
                          <p className="text-[10px] font-mono text-[#d4a373]/80 truncate">{station.tags || 'Hindi / Music'} • {station.country || 'India'}</p>
                        </div>
                        <Play className={`w-4 h-4 shrink-0 ${active && radioPlaying ? 'text-red-300' : 'text-[#d4a373]'}`} />
                      </div>
                    </button>
                  );
                }) : (
                  <p className="text-sm text-[#e6d5b8]/60 py-6 text-center">No stations available right now.</p>
                )}
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-[#e6d5b8]/45">Station discovery uses the Radio Browser public directory; the audio remains the station's own live broadcast. Some streams may be unavailable due to browser or station restrictions.</p>
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

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const MusicPlayerContext = createContext();

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [musics, setMusics] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [albumId, setAlbumId] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line
  }, [currentTrackIndex, musics]);

  // Função auxiliar para fade in
  const fadeIn = (audio, duration = 1000) => {
    return new Promise((resolve) => {
      if (!audio) return resolve();
      audio.volume = 0;
      const step = 0.05;
      const interval = duration / (1 / step);
      const fade = setInterval(() => {
        if (audio.volume < 1) {
          audio.volume = Math.min(audio.volume + step, 1);
        } else {
          clearInterval(fade);
          resolve();
        }
      }, interval);
    });
  };

  // Função auxiliar para fade out
  const fadeOut = (audio, duration = 1000) => {
    return new Promise((resolve) => {
      if (!audio) return resolve();
      const step = 0.05;
      const interval = duration / (1 / step);
      const fade = setInterval(() => {
        if (audio.volume > 0) {
          audio.volume = Math.max(audio.volume - step, 0);
        } else {
          clearInterval(fade);
          resolve();
        }
      }, interval);
    });
  };

  const play = async () => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      await fadeIn(audio, 700); // fade in ao dar play
      audio.play();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    const audio = audioRef.current;
    if (audio) {
      await fadeOut(audio, 700); // fade out ao pausar
      audio.pause();
      setIsPlaying(false);
    }
  };

  const setTrackList = (tracks, index = 0, albumIdParam = null) => {
    setMusics(tracks);
    setCurrentTrackIndex(index);
    if (albumIdParam) setAlbumId(albumIdParam);
    setTimeout(() => play(), 0);
  };

  const next = async () => {
    const audio = audioRef.current;
    if (audio) {
      await fadeOut(audio, 700); // fade out antes de trocar
    }
    if (isShuffle) {
      setCurrentTrackIndex(Math.floor(Math.random() * musics.length));
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % musics.length);
    }
  };

  const previous = async () => {
    const audio = audioRef.current;
    if (audio) {
      await fadeOut(audio, 700); // fade out antes de trocar
    }
    setCurrentTrackIndex((prev) => (prev - 1 + musics.length) % musics.length);
  };

  const toggleShuffle = () => setIsShuffle((s) => !s);
  const toggleRepeat = () => setIsRepeat((r) => !r);

  const handleEnded = async () => {
    const audio = audioRef.current;
    if (audio) {
      await fadeOut(audio, 700); // fade out ao finalizar
    }
    if (isRepeat) {
      play();
    } else {
      next();
    }
  };

  useEffect(() => {
    if (musics.length > 0 && musics[currentTrackIndex] && musics[currentTrackIndex].previewUrl) {
      const audio = audioRef.current;
      audio.src = musics[currentTrackIndex].previewUrl;
      audio.volume = 0; // Garante que sempre começa com volume 0
      if (isPlaying) {
        // Dar play primeiro, depois fade in
        audio.play().then(() => {
          fadeIn(audio, 700);
        });
      }
    }
    // eslint-disable-next-line
  }, [currentTrackIndex, musics]);

  const value = {
    audioRef,
    musics,
    currentTrackIndex,
    isPlaying,
    isShuffle,
    isRepeat,
    currentTime,
    duration,
    play,
    pause,
    next,
    previous,
    toggleShuffle,
    toggleRepeat,
    setTrackList,
    setCurrentTime,
    albumId,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
} 
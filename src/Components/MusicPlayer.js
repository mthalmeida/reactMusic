import React, { useEffect, useState } from 'react';
import './MusicPlayer.css';
import { MdShuffle, MdSkipPrevious, MdPlayArrow, MdPause, MdSkipNext, MdRepeat, MdList, MdFavorite, MdMusicNote, MdLibraryMusic, MdFavoriteBorder } from 'react-icons/md';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { useHistory } from 'react-router-dom';
import { addSong, removeSong, getFavoriteSongs } from '../services/favoriteSongsAPI';
import { getUser } from '../services/userAPI';

export default function MusicPlayer({ fullControls }) {
  const {
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
    setCurrentTime,
    albumId,
  } = useMusicPlayer();
  const history = useHistory();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userName, setUserName] = useState('');

  const currentTrack = musics[currentTrackIndex];

  useEffect(() => {
    async function fetchUserAndFavorite() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name && currentTrack) {
        setUserName(user.name);
        const favs = await getFavoriteSongs(user.name);
        setIsFavorite(favs.some((s) => s.trackId === currentTrack.trackId));
      }
    }
    if (currentTrack) fetchUserAndFavorite();
  }, [currentTrack]);

  const handleToggleFavorite = async () => {
    if (!userName) return;
    if (isFavorite) {
      await removeSong(userName, currentTrack);
      setIsFavorite(false);
    } else {
      await addSong(userName, currentTrack);
      setIsFavorite(true);
    }
  };

  if (!musics || musics.length === 0) {
    return null;
  }

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    setCurrentTime(seekTime);
    const audio = document.querySelector('audio');
    if (audio) audio.currentTime = seekTime;
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleListClick = (e) => {
    e.stopPropagation();
    history.push('/player');
  };

  // Player compacto: apenas botões de controle
  if (!fullControls) {
    return (
      <div className="music-player compact" style={{cursor: 'pointer'}} onClick={() => history.push('/player')}>
        <div className="compact-music-icon">
          <img 
            src={currentTrack.artworkUrl100?.replace('100x100', '300x300') || currentTrack.artworkUrl100 || 'https://via.placeholder.com/300x300'} 
            alt={currentTrack.collectionName || 'Álbum'}
            className="album-cover-compact"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300';
            }}
          />
        </div>
        <div className="compact-track-info">
          <div className="compact-track-texts">
            <span className="track-name-compact">{currentTrack.trackName || 'Música'}</span>
            <span className="artist-name-compact">{currentTrack.artistName || 'Artista'}</span>
          </div>
        </div>
        <div className="compact-controls-icons">
          <button className="control-button play-pause" onClick={e => {e.stopPropagation(); isPlaying ? pause() : play();}}>
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </button>
        </div>
      </div>
    );
  }

  // Completo: todos os controles
  return (
    <div className="music-player full">
      <div className="player-header">
        <button className="back-button" onClick={() => {
          if (albumId) {
            history.push(`/album/${albumId}`);
          } else {
            history.goBack();
          }
        }}>
          <MdLibraryMusic size={36} />
        </button>
        <h1 className="player-title">
          {currentTrack.trackName || 'Música'} by {currentTrack.artistName || 'Artista'}
        </h1>
        <button className="favorite-button" onClick={handleToggleFavorite}>
          {isFavorite ? <MdFavorite color="white" /> : <MdFavoriteBorder color="white" />}
        </button>
      </div>
      <div className="player-content">
        <div className="album-cover">
          <img 
            src={currentTrack.artworkUrl100?.replace('100x100', '300x300') || currentTrack.artworkUrl100 || 'https://via.placeholder.com/300x300'} 
            alt={currentTrack.collectionName || 'Álbum'}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300';
            }}
          />
        </div>
        <div className="track-info">
          <h2 className="track-name">{currentTrack.trackName || 'Música'}</h2>
          <p className="artist-name">{currentTrack.artistName || 'Artista'}</p>
        </div>
        <div className="progress-container">
          <span className="time current-time">{formatTime(currentTime)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time total-time">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-controls">
        <button 
          className={`control-button shuffle ${isShuffle ? 'active' : ''}`}
          onClick={toggleShuffle}
        >
          <MdShuffle />
        </button>
        <button 
          className="control-button previous"
          onClick={previous}
        >
          <MdSkipPrevious />
        </button>
        <button 
          className="control-button play-pause"
          onClick={isPlaying ? pause : play}
        >
          {isPlaying ? <MdPause /> : <MdPlayArrow />}
        </button>
        <button 
          className="control-button next"
          onClick={next}
        >
          <MdSkipNext />
        </button>
        <button 
          className={`control-button repeat ${isRepeat ? 'active' : ''}`}
          onClick={toggleRepeat}
        >
          <MdRepeat />
        </button>
      </div>
    </div>
  );
}
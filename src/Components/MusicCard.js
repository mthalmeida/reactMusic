import React from 'react';
import PropTypes from 'prop-types';
import './MusicCard.css';
import { MdPlayArrow, MdPause, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

export default function MusicCard(props) {
  const {
    trackName = 'Música',
    previewUrl = '',
    trackId = 0,
    checked = false,
    synchronizationWithLoad,
    artworkUrl100 = '',
    artistName = '',
    onPlay,
  } = props;

  const {
    musics,
    currentTrackIndex,
    isPlaying,
    play,
    pause,
  } = useMusicPlayer();

  // Verifica se esta música é a que está tocando
  const isCurrent = musics && musics[currentTrackIndex] && musics[currentTrackIndex].trackId === trackId;

  const handlePlayPause = () => {
    if (isCurrent) {
      isPlaying ? pause() : play();
    } else if (onPlay) {
      onPlay(trackId);
    }
  };

  return (
    <div className="music-card">
      {artworkUrl100 && (
        <img
          className="music-card-image cardImg"
          src={artworkUrl100}
          alt={`Capa do álbum de ${trackName}`}
        />
      )}
      <div className="music-card-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="music-card-title">{ trackName }</p>
          <p className="music-card-artist">{ artistName }</p>
        </div>
        <div className="music-card-actions-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <button
            className="favorite-icon-btn"
            onClick={ () => synchronizationWithLoad(props) }
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label={checked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {checked ? <MdFavorite color="white" size={32} /> : <MdFavoriteBorder color="white" size={32} />}
          </button>
          <button
            className="music-card-play"
            onClick={handlePlayPause}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label={isCurrent && isPlaying ? 'Pausar música' : 'Tocar música'}
          >
            {isCurrent && isPlaying ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
          </button>
        </div>
      </div>
    </div>
  );
}

MusicCard.propTypes = {
  trackName: PropTypes.string,
  previewUrl: PropTypes.string,
  trackId: PropTypes.number,
  checked: PropTypes.bool,
  synchronizationWithLoad: PropTypes.func.isRequired,
  artworkUrl100: PropTypes.string,
  artistName: PropTypes.string,
  onPlay: PropTypes.func,
};

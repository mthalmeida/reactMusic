import React, { Component } from 'react';
import MusicCard from '../Components/MusicCard';
import { getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';
import './styles/favorites.css';
import { MusicPlayerProvider, useMusicPlayer } from '../contexts/MusicPlayerContext';

function FavoritesContent({ favoriteSongs, removeFavoriteSong }) {
  const { setTrackList } = useMusicPlayer();
  const handlePlay = (trackId) => {
    const index = favoriteSongs.findIndex((song) => song.trackId === trackId);
    if (index !== -1) {
      setTrackList(favoriteSongs, index);
    }
  };
  return (
    <div className="favorites-container">
      {favoriteSongs.map((song) => (
        <MusicCard
          key={song.trackId}
          {...song}
          checked={true}
          synchronizationWithLoad={removeFavoriteSong}
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
}

export default class Favorites extends Component {
  constructor() {
    super();
    this.state = { favoriteSongs: [], };
  }

  componentDidMount() { this.getFavoriteSongs(); }

  async getFavoriteSongs() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      const favoriteSongs = await getFavoriteSongs(user.name);
      this.setState({ favoriteSongs });
    }
  }

  removeFavoriteSong = async (song) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      await removeSong(user.name, song);
      this.getFavoriteSongs();
    }
  };

  render() {
    const { favoriteSongs } = this.state;
    return (
      <div data-testid="page-favorites">
        <div className="favorites-content">
          <h1 className="favorites-title">Músicas Favoritas</h1>
          {favoriteSongs.length === 0 ? (
            <div className="no-favorites">
              <div className="no-favorites-icon">💔</div>
              <p>Você ainda não tem músicas favoritas.</p>
              <p>Explore e adicione suas músicas preferidas!</p>
            </div>
          ) : (
            <FavoritesContent favoriteSongs={favoriteSongs} removeFavoriteSong={this.removeFavoriteSong} />
          )}
        </div>
      </div>
    );
  }
}

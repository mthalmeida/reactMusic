import React, { Component } from 'react';
import PropTypes from 'prop-types';
import musicsAPI from '../services/musicsAPI';
import MusicCard from '../Components/MusicCard';
import Loading from '../Components/Loading';
import { addSong, removeSong, getFavoriteSongs } from '../services/favoriteSongsAPI';
import './styles/album.css';
import { MusicPlayerProvider, useMusicPlayer } from '../contexts/MusicPlayerContext';

function AlbumPageWrapper(props) {
  const musicPlayer = useMusicPlayer();
  return <Album {...props} musicPlayer={musicPlayer} />;
}

class Album extends Component {
  constructor() {
    super();
    this.state = {
      musics: [],
      loading: true,
      album: {},
      favoriteSongs: [],
      isMobile: false,
    };
  }

  componentDidMount() {
    this.fetchAlbumData();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  }

  checkScreenSize = () => {
    const isMobile = window.innerWidth <= 768;
    this.setState({ isMobile });
  }

  fetchAlbumData = async () => {
    const { match } = this.props;
    const { id } = match.params;
    try {
      const results = await musicsAPI(id);
      const albumInfo = results[0];
      const musicTracks = results.slice(1).filter(track => 
        track.kind === 'song' && 
        track.trackName && 
        track.previewUrl && 
        track.trackId
      );
      this.setState({
        musics: musicTracks,
        album: albumInfo || {},
        loading: false,
      });
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) {
        const favoriteSongs = await getFavoriteSongs(user.name);
        this.setState({ favoriteSongs });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do álbum:', error);
      this.setState({ loading: false });
    }
  }

  checkTrue = (item) => {
    const { favoriteSongs } = this.state;
    return favoriteSongs.some((music) => music.trackId === item.trackId);
  }

  synchronizationWithLoad = async (item) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.name) return;
    const { favoriteSongs } = this.state;
    const isFavorite = favoriteSongs.some((music) => music.trackId === item.trackId);
    if (isFavorite) {
      await removeSong(user.name, item);
      const updatedFavorites = favoriteSongs.filter((music) => music.trackId !== item.trackId);
      this.setState({ favoriteSongs: updatedFavorites });
    } else {
      await addSong(user.name, item);
      this.setState({ favoriteSongs: [...favoriteSongs, item] });
    }
  }

  handlePlayTrack = (trackId) => {
    const { musics } = this.state;
    const { musicPlayer } = this.props;
    const index = musics.findIndex((m) => m.trackId === trackId);
    if (index !== -1 && musicPlayer) {
      // Adiciona artworkUrl100 do álbum se não houver na música
      const musicsWithArt = musics.map(m => ({ ...m, artworkUrl100: m.artworkUrl100 || this.state.album.artworkUrl100 }));
      musicPlayer.setTrackList(musicsWithArt, index);
    }
  }

  render() {
    const { musics, loading, album } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <div data-testid="page-album">
        <div className="album-info">
          <img
            className="album-cover-title"
            src={album.artworkUrl100?.replace('100x100', '300x300') || album.artworkUrl100 || 'https://via.placeholder.com/300x300'}
            alt={album.collectionName || 'Álbum'}
            style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', marginRight: '16px' }}
          />
          <div>
            <p className="artist-name" data-testid="artist-name">{album.artistName}</p>
            <p className="album-name" data-testid="album-name">{album.collectionName}</p>
          </div>
        </div>
        <div className="musics-container">
          {musics.map((item, idx) => (
            <MusicCard
              key={ item.trackId }
              { ...item }
              checked={ this.checkTrue(item) }
              synchronizationWithLoad={ this.synchronizationWithLoad }
              artworkUrl100={ item.artworkUrl100 || album.artworkUrl100 }
              onPlay={this.handlePlayTrack}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AlbumPageWrapper;

Album.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

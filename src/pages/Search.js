import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Loading from '../Components/Loading';
import './styles/search.css';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import getMusics from '../services/musicsAPI';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      search: '',
      showInformation: false,
      artista: false,
      album: [],
      isMobile: false,
      suggestions: [],
      showSuggestions: false,
      // Novos estados para sessões
      sessions: {
        emAlta: [],
        brasil: [],
        evangelicas: [],
        pop: [],
        rock: [],
        sertanejo: [],
        funk: [],
        flashback: [],
        hiphop: [],
        eletronica: [],
      },
      loadingSessions: true,
    };
    this.suggestionTimeout = null;
  }

  componentDidMount() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    this.fetchSessions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  }

  checkScreenSize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  }

  btnValidator = () => {
    const { search } = this.state;
    const magicNumber = 2;

    if (search.length >= magicNumber) {
      this.setState({ button: true });
    }
  };

  handleChange = async ({ target }) => {
    const { value } = target;
    this.setState({ search: value, showSuggestions: !!value });
    if (this.suggestionTimeout) clearTimeout(this.suggestionTimeout);
    if (value.length < 2) {
      this.setState({ suggestions: [], showSuggestions: false });
      return;
    }
    // Debounce para evitar muitas requisições
    this.suggestionTimeout = setTimeout(async () => {
      const response = await fetch(`/itunes/search?term=${encodeURIComponent(value)}&entity=musicArtist&limit=5`);
      const data = await response.json();
      const artists = data.results.map((item) => item.artistName);
      // Remove duplicados
      const uniqueArtists = [...new Set(artists)];
      this.setState({ suggestions: uniqueArtists, showSuggestions: true });
    }, 300);
  };

  handleSuggestionClick = (artist) => {
    this.setState({ search: artist, showSuggestions: false }, this.btnEvent);
  };

  btnEvent = () => {
    const { search } = this.state;
    searchAlbumsAPI(search).then((response) => this.setState({
      album: response,
      loading: false,
    }));
    this.setState({ search, loading: true, artista: search, showInformation: true, showSuggestions: false });
  };

  handlePlayClick = async (collectionId, artworkUrl100) => {
    // Busca as músicas do álbum
    const results = await getMusics(collectionId);
    const albumInfo = results[0];
    const musicTracks = results.slice(1).filter(track =>
      track.kind === 'song' &&
      track.trackName &&
      track.previewUrl &&
      track.trackId
    );
    // Adiciona artwork do álbum se não houver na música
    const musicsWithArt = musicTracks.map(m => ({ ...m, artworkUrl100: m.artworkUrl100 || artworkUrl100 || albumInfo.artworkUrl100 }));
    // Seta no contexto do player
    this.props.musicPlayer.setTrackList(musicsWithArt, 0, collectionId);
    // Redireciona para o player
    this.props.history.push('/player');
  };

  // Função para buscar álbuns para cada sessão
  fetchSessions = async () => {
    this.setState({ loadingSessions: true });
    // Função auxiliar para buscar álbuns
    const fetchAlbums = async (term, country = 'US') => {
      const url = `/itunes/search?term=${encodeURIComponent(term)}&entity=album`;
      const res = await fetch(url);
      const data = await res.json();
      return data.results || [];
    };
    // Busca paralela para cada categoria
    const [emAlta, brasil, evangelicas, pop, rock, sertanejo, funk, flashback, hiphop, eletronica] = await Promise.all([
      fetchAlbums('top'),
      fetchAlbums('top', 'BR'),
      fetchAlbums('gospel', 'BR'),
      fetchAlbums('pop'),
      fetchAlbums('rock'),
      fetchAlbums('sertanejo', 'BR'),
      fetchAlbums('funk', 'BR'),
      fetchAlbums('flashback'),
      fetchAlbums('hip hop'),
      fetchAlbums('electronic'),
    ]);
    this.setState({
      sessions: {
        emAlta,
        brasil,
        evangelicas,
        pop,
        rock,
        sertanejo,
        funk,
        flashback,
        hiphop,
        eletronica,
      },
      loadingSessions: false,
    });
  };

  render() {
    const {
      search,
      loading,
      album,
      artista,
      showInformation,
      isMobile,
      suggestions,
      showSuggestions,
      sessions,
      loadingSessions,
    } = this.state;

    if (loading) return <Loading />;
    // Se não há busca, mostrar sessões
    const showSessions = !search && !showInformation;
    return (
      <div data-testid="page-search">
        <div className="search">
          <div data-testid="page-login">
            <div className="input input-search-icon">
              <input
                value={ search }
                className="input-search"
                type="text"
                name="search"
                data-testid="search-artist-input"
                placeholder="Pesquise por nome da banda ou artista"
                onChange={ this.handleChange }
                autoComplete="off"
              />
              <span className="search-icon search-icon-right">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="none">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99c.41.41 1.09.41 1.5 0s.41-1.09 0-1.5l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="#222"/>
                </svg>
              </span>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((artist) => (
                    <li
                      key={artist}
                      className="suggestion-item"
                      onClick={() => this.handleSuggestionClick(artist)}
                    >
                      {artist}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* SESSÕES DE SUGESTÕES */}
        {showSessions && (
          <div className="cardResult1">
            <div>
              {loadingSessions ? <Loading /> : (
                <>
                  <SessionSection title="Em alta" albums={sessions.emAlta} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Populares no Brasil" albums={sessions.brasil} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Evangélicas" albums={sessions.evangelicas} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Pop" albums={sessions.pop} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Rock" albums={sessions.rock} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Sertanejo" albums={sessions.sertanejo} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Funk" albums={sessions.funk} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Flashback" albums={sessions.flashback} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Hip Hop" albums={sessions.hiphop} onPlay={this.handlePlayClick} isMobile={isMobile} />
                  <SessionSection title="Eletrônica" albums={sessions.eletronica} onPlay={this.handlePlayClick} isMobile={isMobile} />
                </>
              )}
            </div>
          </div>
        )}

        {/* RESULTADO DA BUSCA */}
        {!showSessions && (
          <div className="cardResult1">
            <div>
              {showInformation && (
                <h2 className="resulTitle">
                  { `Resultado de álbuns de: ${artista} `}
                </h2>
              )}
              { album.length === 0 ? (
                <div className="no-cards">
                  <p className="fa">Nenhum álbum foi encontrado</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {album.map((musics) => (
                    <div key={ musics.collectionId } className="cardResult2">
                      <img
                        className="cardImg"
                        src={ musics.artworkUrl100 }
                        alt={ musics.collectionName }
                      />
                      <div>
                        <p className="collection">{ musics.collectionName }</p>
                        <p className="artist">{ musics.artistName }</p>
                      </div>
                      <div className="information2">
                        {isMobile ? (
                          <button
                            className="information"
                            onClick={() => this.handlePlayClick(musics.collectionId, musics.artworkUrl100)}
                            type="button"
                          >
                            ▶
                          </button>
                        ) : (
                          <button
                            className="information"
                            onClick={() => this.handlePlayClick(musics.collectionId, musics.artworkUrl100)}
                            type="button"
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

// Componente auxiliar para exibir sessões
function SessionSection({ title, albums, onPlay, isMobile }) {
  if (!albums || albums.length === 0) return null;
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 className="resulTitle" style={{ fontSize: 22, marginBottom: 8, textAlign: 'left', color: '#fff' }}>{title}</h2>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 24,
        paddingBottom: 8,
        scrollbarWidth: 'thin',
      }} className="carousel-scroll">
        {albums.map((musics) => (
          <div
            key={ musics.collectionId }
            className="cardResult2"
            style={{ minWidth: 220, maxWidth: 240, flex: '0 0 auto', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => onPlay(musics.collectionId, musics.artworkUrl100)}
          >
            <img
              className="cardImg"
              src={ musics.artworkUrl100 }
              alt={ musics.collectionName }
            />
            <div style={{ width: '100%' }}>
              <p className="collection" style={{ marginBottom: 4 }}>{ musics.collectionName }</p>
              <p className="artist">{ musics.artistName }</p>
            </div>
            {/* Sem botão de play */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SearchWithPlayer(props) {
  const musicPlayer = useMusicPlayer();
  const { history } = props;
  return <Search {...props} musicPlayer={musicPlayer} history={history} />;
}

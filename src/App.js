import React from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import Search from './pages/Search';
import Album from './pages/Album';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Header from './Components/Header';
import './index.css';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import MusicPlayer from './Components/MusicPlayer';
import PrivateRoute from './Components/PrivateRoute';

// Wrapper para mostrar o player compacto apenas fora da página /player
function CompactMusicPlayerWrapper() {
  const location = useLocation();
  // Oculta o player compacto na rota /player
  if (location.pathname === '/player') return null;
  return <MusicPlayer />; // modo compacto
}

class App extends React.Component {
  state = { isMobile: window.innerWidth <= 600 };

  updateScreen = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateScreen);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScreen);
  }

  render() {
    if (!this.state.isMobile) {
      return (
        <div className="big-screen-block">
          <div className="big-screen-content">
            <h1>App disponível apenas para telas menores</h1>
            <p>Por favor, acesse em um dispositivo móvel ou reduza a largura da janela para até 600px.</p>
          </div>
        </div>
      );
    }
    return (
      <MusicPlayerProvider>
        <div className="App">
          <Route path="/">
            <CompactMusicPlayerWrapper />
          </Route>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/search" component={Search} />
            <PrivateRoute path="/album/:id" component={Album} />
            <PrivateRoute path="/favorites" component={Favorites} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute path="/profile/edit" component={ProfileEdit} />
            {/* Nova rota para o player */}
            <PrivateRoute path="/player" component={() => <MusicPlayer fullControls={true} />} />
            <Route path="*" component={NotFound} />
          </Switch>
          {/* Navbar inferior - não aparece na página de login e 404 */}
          <Route path={["/search", "/album", "/favorites", "/profile", "/player"]}>
            <Header />
          </Route>
        </div>
      </MusicPlayerProvider>
    );
  }
}

export default App;

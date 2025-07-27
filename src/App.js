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
  render() {
    return (
      <MusicPlayerProvider>
        <BrowserRouter>
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
            <Route path={['/search', '/album', '/favorites', '/profile', '/player']}>
              <Header />
            </Route>
          </div>
        </BrowserRouter>
      </MusicPlayerProvider>
    );
  }
}

export default App;

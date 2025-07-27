const FAVORITE_SONGS_KEY = 'favorite_songs_by_user';
const TIMEOUT = 500;
const SUCCESS_STATUS = 'OK';

if (!JSON.parse(localStorage.getItem(FAVORITE_SONGS_KEY))) {
  localStorage.setItem(FAVORITE_SONGS_KEY, JSON.stringify({}));
}
const readFavoriteSongs = (userName) => {
  const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_SONGS_KEY)) || {};
  return allFavorites[userName] || [];
};

const saveFavoriteSongs = (userName, favoriteSongs) => {
  const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_SONGS_KEY)) || {};
  allFavorites[userName] = favoriteSongs;
  localStorage.setItem(FAVORITE_SONGS_KEY, JSON.stringify(allFavorites));
};

// --------------------------------------------------------------------
// A função simulateRequest simula uma requisição para uma API externa
// Esse tipo de função que "chama outra função" é chamada de
// "currying function" https://javascript.info/currying-partials
// não se preocupe, estudaremos isso futuramente.
// --------------------------------------------------------------------

const simulateRequest = (response) => (callback) => {
  setTimeout(() => {
    callback(response);
  }, TIMEOUT);
};

export const getFavoriteSongs = (userName) => new Promise((resolve) => {
  const favoriteSongs = readFavoriteSongs(userName);
  simulateRequest(favoriteSongs)(resolve);
});

export const addSong = (userName, song) => new Promise((resolve) => {
  if (song) {
    const favoriteSongs = readFavoriteSongs(userName);
    saveFavoriteSongs(userName, [...favoriteSongs, song]);
  }
  simulateRequest(SUCCESS_STATUS)(resolve);
});

export const removeSong = (userName, song) => new Promise((resolve) => {
  const favoriteSongs = readFavoriteSongs(userName);
  saveFavoriteSongs(userName, favoriteSongs.filter((s) => s.trackId !== song.trackId));
  simulateRequest(SUCCESS_STATUS)(resolve);
});

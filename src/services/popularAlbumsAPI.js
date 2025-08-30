const getPopularAlbums = async (limit = 20) => {
  try {
    // Lista de artistas populares conhecidos para buscar álbuns populares
    const popularArtists = [
      'Taylor Swift', 'Ed Sheeran', 'Ariana Grande', 'Drake', 'Billie Eilish',
      'The Weeknd', 'Post Malone', 'Dua Lipa', 'Harry Styles', 'Olivia Rodrigo',
      'Bad Bunny', 'SZA', 'Lana Del Rey', 'Kendrick Lamar', 'Bruno Mars'
    ];
    
    const allAlbums = [];
    
    // Busca álbuns de artistas populares
    for (const artist of popularArtists) {
      try {
        const response = await fetch(`/itunes/search?term=${encodeURIComponent(artist)}&entity=album&limit=2`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          allAlbums.push(...data.results);
        }
      } catch (termError) {
        console.warn(`Erro ao buscar álbuns de "${artist}":`, termError);
      }
    }
    
    // Remove duplicados baseado no collectionId e filtra álbuns válidos
    const uniqueAlbums = allAlbums
      .filter((album, index, self) => 
        index === self.findIndex(a => a.collectionId === album.collectionId)
      )
      .filter(album => 
        album.artworkUrl100 && 
        album.collectionName && 
        album.artistName &&
        album.collectionId &&
        album.trackCount > 0 // Garante que é um álbum com músicas
      )
      .slice(0, limit)
      .map(({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }) => ({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }));

    return uniqueAlbums;
  } catch (error) {
    console.error('Erro ao buscar álbuns populares:', error);
    return [];
  }
};

// Função para buscar álbuns populares por gênero
const getPopularAlbumsByGenre = async (genre, limit = 10) => {
  try {
    const response = await fetch(`/itunes/search?term=${encodeURIComponent(genre)}&entity=album&limit=${limit}&attribute=albumTerm`);
    const data = await response.json();
    
    const albums = data.results
      .filter(album => 
        album.artworkUrl100 && 
        album.collectionName && 
        album.artistName &&
        album.collectionId
      )
      .map(({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }) => ({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }));

    return albums;
  } catch (error) {
    console.error(`Erro ao buscar álbuns populares de ${genre}:`, error);
    return [];
  }
};

// Função para buscar álbuns mais vendidos/em alta
const getTopSellingAlbums = async (limit = 20) => {
  try {
    // Usa termos que geralmente retornam álbuns populares
    const terms = ['bestseller', 'chart', 'hit', 'popular'];
    const allAlbums = [];
    
    for (const term of terms) {
      const response = await fetch(`/itunes/search?term=${term}&entity=album&limit=${Math.ceil(limit / terms.length)}&attribute=albumTerm`);
      const data = await response.json();
      
      if (data.results) {
        allAlbums.push(...data.results);
      }
    }
    
    // Remove duplicados baseado no collectionId
    const uniqueAlbums = allAlbums.filter((album, index, self) => 
      index === self.findIndex(a => a.collectionId === album.collectionId)
    );
    
    const topAlbums = uniqueAlbums
      .filter(album => 
        album.artworkUrl100 && 
        album.collectionName && 
        album.artistName &&
        album.collectionId
      )
      .slice(0, limit)
      .map(({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }) => ({
        artistId,
        artistName,
        collectionId,
        collectionName,
        collectionPrice,
        artworkUrl100,
        releaseDate,
        trackCount,
      }));

    return topAlbums;
  } catch (error) {
    console.error('Erro ao buscar álbuns mais vendidos:', error);
    return [];
  }
};

export { getPopularAlbums, getPopularAlbumsByGenre, getTopSellingAlbums };
export default getPopularAlbums;

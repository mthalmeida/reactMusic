const searchAlbumsAPI = async (artist) => {
  const artistNameURL = encodeURI(artist).replaceAll('%20', '+');

  // Usa attribute=allArtistTerm para buscar especificamente pelo artista
  const getAlbumsAPI = `/itunes/search?entity=album&term=${artistNameURL}&attribute=allArtistTerm`;

  const APIResponse = await fetch(getAlbumsAPI);
  const { results } = await APIResponse.json();

  // Função para verificar se o nome do artista corresponde à busca
  const isArtistMatch = (albumArtistName, searchTerm) => {
    const artistLower = albumArtistName.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Verifica se o nome do artista contém o termo de busca
    // ou se o termo de busca contém o nome do artista (para nomes parciais)
    return artistLower.includes(searchLower) || searchLower.includes(artistLower);
  };

  // Filtra apenas os álbuns do artista pesquisado
  const artistNameLower = artist.toLowerCase();
  const filteredResults = results.filter(album => 
    album.artistName && 
    isArtistMatch(album.artistName, artist)
  );

  // Remove duplicados baseado no collectionId
  const uniqueResults = filteredResults.filter((album, index, self) => 
    index === self.findIndex(a => a.collectionId === album.collectionId)
  );

  const response = uniqueResults.map(
    ({
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
    }),
  );
  return response;
};

export default searchAlbumsAPI;

const getMusics = async (id) => {
  const request = await fetch(`/itunes/lookup?id=${id}&entity=song`);
  const requestJson = await request.json();
  return requestJson.results;
};

export default getMusics;

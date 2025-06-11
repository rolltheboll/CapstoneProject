const axios = require('axios');

const geocodeAddress = async (address) => {
  const encoded = encodeURIComponent(address);
  const token = process.env.MAPBOX_TOKEN;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}`;

  const res = await axios.get(url);
  const [longitude, latitude] = res.data.features[0].center;

  return { lat: latitude, lng: longitude };
};

module.exports = geocodeAddress;

const axios = require('axios');

const baseHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
};

module.exports = async function (req, res) {
  try {
    const lat = req.query.lat || '12.9351929';
    const lng = req.query.lng || '77.62448069999999';

    const requestHeaders = {
      ...baseHeaders,
      'Referer': 'https://www.swiggy.com/',
      'Origin': 'https://www.swiggy.com',
    };

    const response = await axios.get(
      `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`,
      { headers: requestHeaders }
    );

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
};

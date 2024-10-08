const axios = require('axios');

const baseHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
};

function extractFromCookies(cookies, key) {
  const cookie = cookies.find(c => c.startsWith(`${key}=`));
  return cookie ? cookie.split(`${key}=`)[1].split(';')[0] : null;
}

async function getSwiggySession(retryCount = 0) {
  try {
    const initialResponse = await axios.get('https://www.swiggy.com', { headers: baseHeaders });
    const cookies = initialResponse.headers['set-cookie'];

    const deviceId = extractFromCookies(cookies, '_device_id');

    if (!deviceId) {
      console.error('Failed to retrieve Device ID');
      return null;
    }

    return {
      deviceId,
      cookies,
    };
  } catch (error) {
    console.error(`Error fetching Swiggy session on attempt ${retryCount + 1}:`, error.message);
    if (retryCount < 3) {
      return getSwiggySession(retryCount + 1);
    }
    return null;
  }
}

module.exports = async function (req, res) {
  try {
    const resId = req.query.resId;

    const session = await getSwiggySession();

    if (!session) {
      return res.status(500).send('Failed to retrieve Device ID');
    }

    const { deviceId, cookies } = session;

    const swiggyHeaders = {
      ...baseHeaders,
      'X-Device-Id': deviceId,
      'Referer': 'https://www.swiggy.com/',
      'Origin': 'https://www.swiggy.com',
      'Cookie': cookies.join('; '),
    };

    const menuResponse = await axios.get(
      `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9351929&lng=77.62448069999999&restaurantId=${resId}`,
      { headers: swiggyHeaders }
    );

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(menuResponse.data);
  } catch (error) {
    console.error('Error fetching menu:', error.message);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

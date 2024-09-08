const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Add CORS middleware
app.use(cors());

const CDN_URL = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/';
const MENU_URL = 'https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9351929&lng=77.62448069999999&restaurantId=';
const RESTAURANT_LIST = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING';

app.get('/api/cdn/:path', async (req, res) => {
  try {
    const response = await axios.get(`${CDN_URL}${req.params.path}`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching CDN data:', error.message); // Log the error
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.get('/api/menu', async (req, res) => {
  const { restaurantId } = req.query;
  if (!restaurantId) {
    return res.status(400).send('Restaurant ID is required');
  }

  try {
    const response = await axios.get(MENU_URL + restaurantId);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching menu data:', error.message); // Log the error
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.get('/api/restaurant-list', async (req, res) => {
  try {
    const response = await axios.get(RESTAURANT_LIST);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching restaurant list data:', error.message); // Log the error
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Use 'node-fetch' for Node.js

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// For Restaurant API
app.get('/api/restaurants', async (req, res) => {
    const url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).send('An error occurred');
    }
});

// For Menu API
app.get('/api/menu', async (req, res) => {
    const url = "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9351929&lng=77.62448069999999&restaurantId=";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('An error occurred');
    }
});

// For CDN Image
app.get("/api/cdn-image/:imageId", (req, res) => {
    const imageUrl = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/${req.params.imageId}`;
    res.redirect(imageUrl);
});

app.get('/', (req, res) => {
    res.json({ "test": "Welcome to FoodieCo! - See Live Web URL for this Server - https://foodie-co.netlify.app" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

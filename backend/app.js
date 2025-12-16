import { sendEmail } from './services/emailService.js';
import express from 'express';

const app = express();
app.use(express.json());

let occupancyCache = {}
let lastCacheUpdate = null;
const CACHE_DURATION = 2 * 60 * 1000;

/**
 * CARPARK ROUTES
 */
// Fetch all carparks
app.get('/api/carparks', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PARKING_API_URL}/carpark`, {
      headers: {
        'Authorization': `apikey ${process.env.PARKING_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch carparks' });
  }
});

// Fetch Carpark Occupancy
app.get('/api/carparks/occupancy', async (req, res) => {
  try {
    const now = Date.now();

    // Check if cache is fresh
    if (lastCacheUpdate && (now - lastCacheUpdate) < CACHE_DURATION) {
      return res.json(occupancyCache);
    }
    console.log('Cache expired fetching updated data');
    // Cache expired or empty, refresh it
    const response = await fetch(`${process.env.PARKING_API_URL}/carpark`, {
      headers: {
        'Authorization': `apikey ${process.env.PARKING_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const carparks = await response.json();

    // Fetch data in batches and cache them
    const BATCH_SIZE = 5
    const DELAY = 1000
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < Object.keys(carparks).length; i += BATCH_SIZE) {
      const batch = Object.keys(carparks).slice(i, i + BATCH_SIZE);

      const responses = await Promise.all(
        batch.map(id => fetch(`${process.env.PARKING_API_URL}/carpark?facility=${id}`, {
          headers: {
            'Authorization': `apikey ${process.env.PARKING_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).catch(err => null))
      );

      // Add to cache
      responses.forEach(data => {
        if (data && data.facility_id && data.occupancy && data.occupancy.total !== undefined) {
          const spots = parseInt(data.spots) || 0;
          const total = parseInt(data.occupancy.total) || 0;
          const diff = spots - total
          occupancyCache[data.facility_id] = {'available': diff < 0 ? 0 : diff, 'total': total, 'spots': spots};
        }
      });

      // Delay between batches
      if (i + BATCH_SIZE < Object.keys(carparks).length) {
        await delay(DELAY);
      }
    }

    lastCacheUpdate = Date.now();
    res.json(occupancyCache);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch carpark occupancy' })
  }
})

// Fetch carpark by ID
app.get('/api/carparks/:id', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PARKING_API_URL}/carpark?facility=${req.params.id}`, {
      headers: {
        'Authorization': `apikey ${process.env.PARKING_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }); 
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch carpark' });
  }
});


/**
 * Email Api
 */
app.post('/api/feedback', async (req, res) => {
  const { name, subject, message } = req.body;

  try {
    await sendEmail(name, subject, message);
    res.json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
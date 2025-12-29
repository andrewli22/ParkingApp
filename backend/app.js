import { sendEmail } from './services/emailService.js';
import express from 'express';

const app = express();
app.use(express.json());

let occupancyCache = {}
let lastCacheUpdate = null;
const CACHE_DURATION = 2 * 60 * 1000;
let isRefreshing = false; // Prevent concurrent cache refreshes

// Extract cache refresh logic into reusable function
async function refreshOccupancyCache() {
  if (isRefreshing) {
    console.log('Cache refresh already in progress, skipping...');
    return occupancyCache;
  }

  try {
    isRefreshing = true;
    console.log('Refreshing occupancy cache...');

    const response = await fetch(`${process.env.PARKING_API_URL}/carpark`, {
      headers: {
        'Authorization': `apikey ${process.env.PARKING_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const carparks = await response.json();

    const BATCH_SIZE = 5;
    const DELAY = 800;
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

      responses.forEach(data => {
        if (data && data.facility_id && data.occupancy && data.occupancy.total !== undefined) {
          const spots = parseInt(data.spots) || 0;
          const total = parseInt(data.occupancy.total) || 0;
          // FIX: Remove 90 so its just spots - total
          // const diff = spots - total - 90;
          const diff = spots - total;
          occupancyCache[data.facility_id] = {
            'available': diff < 0 ? 0 : diff,
            'total': total,
            'spots': spots
          };
        }
      });

      if (i + BATCH_SIZE < Object.keys(carparks).length) {
        await delay(DELAY);
      }
    }

    lastCacheUpdate = Date.now();
    console.log(`Cache refreshed successfully. ${Object.keys(occupancyCache).length} carparks cached.`);
    return occupancyCache;
  } catch (error) {
    console.error('Error refreshing cache:', error);
    throw error;
  } finally {
    isRefreshing = false;
  }
}

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

    console.log('Cache expired, fetching updated data...');
    const data = await refreshOccupancyCache();
    res.json(data);

  } catch (error) {
    console.error('Error in /api/carparks/occupancy:', error);
    res.status(500).json({ error: 'Failed to fetch carpark occupancy' });
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
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);

  // Pre-warm cache on startup
  console.log('Pre-warming occupancy cache...');
  try {
    await refreshOccupancyCache();
    console.log('Initial cache warmed successfully!');
  } catch (error) {
    console.error('Failed to warm initial cache:', error);
  }

  // Set up background refresh every 2 minutes
  setInterval(async () => {
    console.log('Background cache refresh triggered...');
    try {
      await refreshOccupancyCache();
    } catch (error) {
      console.error('Background cache refresh failed:', error);
    }
  }, CACHE_DURATION);
});
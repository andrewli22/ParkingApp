const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(express.json());

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
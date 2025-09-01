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

/**
 * SENDGRID - EMAIL SERVER
 */
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Feedback route - Email
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Sending feedback email - backend');
    console.log(req.body);
    // Basic validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const msg = {
      to: 'parkingappproject55@gmail.com',
      from: 'parkingappproject55@gmail.com',
      subject: `New Feedback from Parking App - ${name || 'Anonymous'}`,
      html: `
        <h3>New Feedback Received</h3>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Sent from Parking App Feedback Form</small></p>
      `
    };

    await sgMail.send(msg);
    res.json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Send feedback error:', error);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
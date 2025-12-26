const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

// Allow larger payloads (audio base64 can be big)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('Musik.ai backend is running 🎶');
});

// Song recognition route
app.post('/recognize', async (req, res) => {
  try {
    const { audioUrl } = req.body; // base64 audio string from frontend

    if (!audioUrl) {
      return res.status(400).json({ error: 'No audio provided' });
    }

    const response = await axios.post('https://api.audd.io/', {
      api_token: process.env.AUDD_API_KEY,
      audio: audioUrl, // send base64 audio
      return: 'apple_music,spotify',
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Recognition failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

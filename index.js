require('dotenv').config();
const express = require('express');
const Replicate = require('replicate');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const replicate = new Replicate({
  auth: process.env.AI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);

    const output = await replicate.run(
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      {
        input: {
          prompt: message,
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1
        }
      }
    );

    console.log('Replicate API response:', output);

    if (Array.isArray(output) && output.length > 0) {
      res.json({ response: output.join('') });
    } else {
      res.status(500).json({ error: 'Unexpected response format from Replicate API' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











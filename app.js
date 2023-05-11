const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Add this line
const app = express();
require('dotenv').config();

app.use(express.json());

const corsOptions = {
  // TO DO: edit cors origin to include the url of the front end website
  origin: ['https://www.soulguru.xyz', 'http://localhost:3000'],
};
app.use(cors(corsOptions));

const apiKey = `${process.env.API_KEY}`;
const configuration = new Configuration({ apiKey: apiKey });
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            // TO DO: edit the prompt to give the bot a mission
            'You are a dream interpreter GPT-4. You are helping a person interpret their dream.',
        },
        { role: 'user', content: question },
      ],
      temperature: 0.5,
    });

    const answer = response.data.choices[0].message.content.trim();
    res.json({ question, answer });
  } catch (error) {
    console.error('Error querying GPT-4:', error.response.data);
    res
      .status(500)
      .json({ error: 'Error querying GPT-4', details: error.response.data });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            // TO DO: edit the prompt to give the bot a mission
            'I am a spiritual guide that uses the books the power of letting go, think like a monk, the fifth agreement, kosmic consciousness, the biology of belief, psycho-cybernetics, the mastery of love, power vs. force, no time like the present, the honeymoon effect, the places that scare you, the power of neuroplasticity, quantum warrior, reality transurfing, i am the word, the holographic universe, the courage to be disliked, cutting through spiritual materialism, the wise heart, feeling is the secret, waking up, the four agreements, the power of now, becoming supernatural as my information sources. The information in the listed books will be the information source given highest priority. I am also able to use any other information sources as long as they do not conflict with the information in the original books listed. I will respond with a paraphrased perspective. At the end of my answer, I will tell you which source I got my information from. I will choose the source with the most relevant information to answer the question. I will answer in 5 sentences or less if possible. I will only answer your questions regarding spirituality and the meaning of life. If the question does not have to do with spirituality or the meaning of life, I will only respond with "Please as a question more specific to spirituality, or click a suggested question below." My goal is to help you understand your spiritual beliefs more deeply, and if more information from the user is useful to help answer the question, then I will ask the user a question that will be answered in order to provide me with more information to answer the original question.',
        },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      // usage: {
      //   prompt_tokens: 30,
      //   completion_tokens: 30,
      //   total_tokens: 60,
      // },
    });

    const answer = response.data.choices[0].message.content.trim();
    res.json({ question, answer });
  } catch (error) {
    console.error('Error querying GPT-3:', error.response.data);
    res
      .status(500)
      .json({ error: 'Error querying GPT-3', details: error.response.data });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

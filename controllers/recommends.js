const { OpenAI } = require('openai');
const User = require('../models/user');

const { API_KEY } = process.env;
const { OPENAI_API_KEY } = process.env;
const { GPT_MODEL } = process.env;
const { PROMPT } = process.env;
const openai = new OpenAI();
openai.api_key = OPENAI_API_KEY;
const URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
let user = null;
let movieList = null;

async function getMovieData(titles) {
  return Promise.all(titles.map(async (title) => {
    const response = await fetch(`${URL}&t=${title}`);
    return response.json();
  }));
}

function formatString(str, params) {
  return str.replace(/\{(\w+)\}/g, (m, n) => params[n]);
}

async function index(req, res) {
  user = await User.findById(req.user.id).populate({
    path: 'thumbsUp.0.movies.$*',
    select: 'title -_id',
  });
  const userMovies = Array.from(user.thumbsUp[0].movies.values());
  const movieTitles = userMovies.map((movie) => movie.title).join(', ');

  const message = formatString(PROMPT, { movieTitles });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message },
    ],
    model: GPT_MODEL,
  });

  const answer = completion.choices[0].message.content;
  const titles = JSON.parse(answer);

  movieList = await getMovieData(titles);
  res.render('movies/index', { title: 'To Watch', movieList });
}

module.exports = {
  index,
};

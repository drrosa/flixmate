const { OpenAI } = require('openai');
const User = require('../models/user');
const Recommendation = require('../models/recommendation');

const { API_KEY } = process.env;
const { OPENAI_API_KEY } = process.env;
const { GPT_MODEL } = process.env;
const { PROMPT } = process.env;
const URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
let user = null;
let movieList = null;

async function index(req, res) {
  user = await User.findById(req.user.id).populate({
    path: 'thumbsUp.0.movies.$*',
    select: 'title -_id',
  });
  const imdbIDs = Array.from(user.toWatch[0].movies.keys());
  movieList = await Promise.all(imdbIDs.map(async (imdbID) => {
    const response = await fetch(`${URL}&i=${imdbID}`);
    const recommendation = await Recommendation.findById(user.toWatch[0].movies.get(imdbID));
    const movieData = await response.json();
    movieData.isLiked = recommendation.liked;
    return movieData;
  }));
  res.render('movies/index', { title: 'To Watch', movieList });
}

function show(req, res) {
  const movie = movieList[req.params.id];
  res.render('movies/show', { title: 'Movie Details', movie });
}

async function getMovieData(titles) {
  return Promise.all(titles.map(async (title) => {
    const response = await fetch(`${URL}&t=${title}`);
    return response.json();
  }));
}

function formatString(str, params) {
  return str.replace(/\{(\w+)\}/g, (m, n) => params[n]);
}

async function searchMovies() {
  const userMovies = Array.from(user.thumbsUp[0].movies.values());
  const movieTitles = userMovies.map((movie) => movie.title).join(', ');
  const toWatchList = movieList.map((movie) => movie.Title).join(', ');

  const message = formatString(PROMPT, { movieTitles, toWatchList });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message },
    ],
    model: GPT_MODEL,
  });

  let recommendations = completion.choices[0].message.content;
  try {
    recommendations = JSON.parse(recommendations);
  } catch (error) {
    console.log('JSON parse error!');
    console.log(recommendations);
    recommendations = null;
  }
  return recommendations;
}

async function create(req, res) {
  const titles = await searchMovies();
  if (!titles) { res.redirect('/recommends'); return; }
  const recommendations = await getMovieData(titles);
  const { movies } = user.toWatch[0];
  let needsSaving = false;

  await Promise.all(recommendations.map(async (data) => {
    const movie = await Recommendation.create({ imdbID: data.imdbID, title: data.Title });
    if (!movies.has(data.imdbID)) {
      movies.set(data.imdbID, movie.id);
      needsSaving = true;
    } else {
      console.log('MOVIE ALREADY EXISTS!');
    }
  }));

  if (needsSaving) {
    await user.save();
  }
  res.redirect('/recommends');
}

async function toggleLike(req, res) {
  const { imdbID } = movieList[req.params.id];
  const recommendation = await Recommendation.findById(user.toWatch[0].movies.get(imdbID));
  recommendation.liked = !recommendation.liked;
  await recommendation.save();
  res.redirect('/recommends');
}

module.exports = {
  index,
  show,
  create,
  toggleLike,
};

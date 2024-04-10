// Constants
const URL = '/movies/search/?t=';

// State

// Cached Element References
const input = document.querySelector('input[type="text"]');
const movieInfo = document.getElementById('movie-info');

// Functions
function render(data) {
  movieInfo.innerHTML = `
        <form action="/movies" method="POST">
          <button type="submit">Add Movie</button>
        </form>
        <img src="${data.Poster} alt="${data.Title}" />
        <h3>${data.Title} (${data.Year})</h3>
    `;
}

async function handleGetData(event) {
  event.preventDefault();
  const searchTerm = input.value;
  if (!searchTerm) return;
  try {
    const response = await fetch(URL + searchTerm);
    const data = await response.json();
    if (data.Response === 'False') {
      alert(data.Error);
    } else {
      render(data);
    }
    input.value = '';
  } catch (error) {
    alert('Sorry, something went wrong');
    console.log(error);
  }
}

// Event Listeners
document.querySelector('form').addEventListener('submit', handleGetData);

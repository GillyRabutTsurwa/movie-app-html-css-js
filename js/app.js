const URLS = (function () {
  const urls = {
    moviePoster: `http://image.tmdb.org/t/p/w1280//`,
    popularMovies: `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`,
    moviesInTheatres: `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22`,
    popularKidsMovies: `https://api.themoviedb.org/3/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc`,
    bestDramas: `https://api.themoviedb.org/3/discover/movie?with_genres=18&primary_release_year=2020`,
    bestComedies: `https://api.themoviedb.org/3/discover/movie?with_genres=35&primary_release_year=2020`,
    APIKey: `1492825cc81665d339ec95c2a3e57bed`,
  };
  return urls;
})();

const ELEMENTS = (function () {
  const elements = {
    container: document.querySelector(".container"),
    img: document.getElementById("img"),
    movieTitle: document.getElementById("movieTitle"),
    movieSelect: document.getElementById("movieSelect"),
    // ELEMENTS FOR DROPDOWN
    selected: document.querySelector(".selected"),
    optionsContainer: document.querySelector(".options-container"),
    optionsList: document.querySelectorAll(".option"),
  };
  return elements;
})();

async function fetchMovies(movieCategoryURL) {
  try {
    // const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1492825cc81665d339ec95c2a3e57bed`);
    // const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22&api_key=1492825cc81665d339ec95c2a3e57bed`);

    // const response = await fetch(`${URLS.popularMovies}&api_key=${URLS.APIKey}`);

    const response = await fetch(`${movieCategoryURL}&api_key=${URLS.APIKey}`);

    const data = await response.json();
    console.log(response);
    console.log(data);
    const movies = data.results;
    console.log(movies);

    //NOTEIMPORTANT: On fait pas l'horreur ici. Faut les supprimer.
    const moviesMinusHorror = movies.filter((currentMovie) => {
      return !currentMovie.genre_ids.includes(27);
    });

    const lesFilms = moviesMinusHorror.map((currentMovie) => {
      const movieMarkup = `
        <div class="movie">
            <div class="movie__img">
                <img src="${URLS.moviePoster}${currentMovie.poster_path}" id="img">
            </div>
            <div class="movie__info">
                <h2 id="movieTitle" class="movie__info--title">
                ${currentMovie.title}
                </h2>
                <span class="movie__info--rating">${currentMovie.vote_average}</span>
            </div>
			<div class="movie__overview">
				<h3 class="movie__overview--title">About Movie</h3>
                <p class="movie__overview--text">
                    ${currentMovie.overview}
                </p>
            </div>
        </div>
        `;

      return movieMarkup;
    });

    // console.log(lesFilms.join(""));
    ELEMENTS.container.innerHTML = lesFilms.join("");
  } catch (error) {
    console.log(error);
  }
}

//NEW:
ELEMENTS.selected.addEventListener("click", () => {
  ELEMENTS.optionsContainer.classList.toggle("active");
});

const objEntriesOptionMatch = Object.entries(URLS);
console.log(objEntriesOptionMatch);

ELEMENTS.optionsList.forEach((currentOption) => {
  currentOption.addEventListener("click", () => {
    ELEMENTS.selected.innerHTML = currentOption.querySelector("label").innerHTML;
    ELEMENTS.optionsContainer.classList.remove("active");
    console.log(currentOption.firstElementChild);

    //TESTING:
    let movieURLKeyAndValue = objEntriesOptionMatch.find((currentArray) => {
      return currentArray.includes(currentOption.firstElementChild.id);
    });
    console.log(movieURLKeyAndValue);

    const objValueIndex = 1;
    fetchMovies(movieURLKeyAndValue[objValueIndex]);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  // so that when the window is opened, we are starting by showing the most popular movies (something instead of showing nothing and leaving all that blank space, which looks ugly)
  fetchMovies(URLS.popularMovies);
});

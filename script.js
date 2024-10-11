//burger menu
const burgerMenu = document.getElementById("burger-menu");
const menu = document.getElementById("menu");
const searchForm = document.querySelector(".searchForm");
const myNavDiv = document.querySelector(".myNavDiv");
const sections = document.querySelectorAll("section");

burgerMenu.addEventListener("click", () => {
  menu.classList.toggle("open");
  searchForm.classList.toggle("open");
  myNavDiv.classList.toggle("open");
  document.body.classList.toggle("open");
});

//darkMode/lightMode
function toggleDarkMode() {
  const body = document.body;
  const lightMode = document.querySelector(".lightMode");
  const modeIcon = document.getElementById("mode-icon");
  const header = document.querySelector("header");
  const section1 = document.querySelector(".firstSection");
  const section2 = document.querySelector(".secondSection");
  const footer = document.querySelector("footer");
  const firstSectionDiv = document.querySelector(".firstSectionDiv");
  const links = document.querySelectorAll("a");
  const h3tags = document.querySelectorAll("h3");
  const h4tags = document.querySelectorAll("h4");
  const movieCards = document.querySelectorAll(".movie-card");
  const movieCardsPar = document.querySelectorAll(".movie-card p");
  const inputSpans = document.querySelectorAll(".inputSpan");
  const searchInput = document.querySelector(".search-input");
  const burgerMenuLines = document.querySelectorAll(".burger-menu-line");

  // Toggle dark mode
  body.classList.toggle("light-mode");
  lightMode.classList.toggle("btn-warning");
  lightMode.classList.toggle("btn-outline-warning");
  header.classList.toggle("lightBackground");
  section1.classList.toggle("lightBackground");
  section2.classList.toggle("lightBackground");
  footer.classList.toggle("lightBackground");
  firstSectionDiv.classList.toggle("lightImg");
  searchInput.classList.toggle("bg-secondary");
  searchInput.classList.toggle("bg-dark-subtle");

  links.forEach((link) => {
    link.classList.toggle("blackText");
  });
  h3tags.forEach((h3tag) => {
    h3tag.classList.toggle("blackText");
  });
  h4tags.forEach((h4tag) => {
    h4tag.classList.toggle("blackText");
  });
  movieCards.forEach((movieCard) => {
    movieCard.classList.toggle("darkCard");
  });
  movieCardsPar.forEach((movieCardp) => {
    movieCardp.classList.toggle("blackText");
  });
  inputSpans.forEach((inputSpan) => {
    inputSpan.classList.toggle("bg-secondary");
    inputSpan.classList.toggle("bg-dark-subtle");
  });
  burgerMenuLines.forEach((burgerMenuLine) => {
    burgerMenuLine.classList.toggle("blackBurgerMenu");
  });

  // Toggle icon between sun and moon
  if (body.classList.contains("light-mode")) {
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
    modeIcon.textContent = "Dark Mode";
  } else {
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
    modeIcon.textContent = "Light Mode";
  }
}

function toggleLoadMode() {
  const h4tags = document.querySelectorAll("h4");
  const movieCards = document.querySelectorAll(".movie-card");
  const movieCardsPar = document.querySelectorAll(".movie-card p");
  if (document.body.classList.contains("light-mode")) {
    h4tags.forEach((h4tag) => {
      h4tag.classList.add("blackText");
    });
    movieCards.forEach((movieCard) => {
      movieCard.classList.add("darkCard");
    });
    movieCardsPar.forEach((movieCardp) => {
      movieCardp.classList.add("blackText");
    });
  } else {
    h4tags.forEach((h4tag) => {
      h4tag.classList.remove("blackText");
    });
    movieCards.forEach((movieCard) => {
      movieCard.classList.remove("darkCard");
    });
    movieCardsPar.forEach((movieCardp) => {
      movieCardp.classList.remove("blackText");
    });
  }
}

//search
const apiKey = "a0a3c5ee";
const baseUrl = "http://www.omdbapi.com/";
const searchInput = document.getElementById("search");
const movieList = document.getElementById("movieList");

let debounceTimer;

const fetchMovieData = async (searchTerm) => {
  try {
    const response = await fetch(
      `${baseUrl}?apikey=${apiKey}&s=${searchTerm}*`
    );
    const data = await response.json();

    if (data.Response === "True") {
      displayMovieList(data.Search);
    } else {
      displayNoResults();
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
    displayError();
  }
};

const displayMovieList = (movies) => {
  movieList.innerHTML = "";
  movieList.classList.add("popup");
  movies.forEach((movie) => {
    const { imdbID, Title, Poster } = movie;
    const movieItem = document.createElement("li");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
          <img src="${
            Poster !== "N/A" ? Poster : "default_poster_url"
          }" alt="${Title}" class="movie-img">
          <span class="movie-title">${Title}</span>
        `;
    movieItem.addEventListener("click", () => {
      openMovieDetails(imdbID);
    });
    movieList.appendChild(movieItem);
  });
};

// Function to fetch and display movie details
const openMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      `${baseUrl}?apikey=${apiKey}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    if (data.Response === "True") {
      const newTab = window.open("movie_details.html", "_blank");

      newTab.onload = function () {
        newTab.document.getElementById("backgroundposter").src =
          data.Poster !== "N/A" ? data.Poster : "default_poster_url";
        newTab.document.getElementById("title").innerText = data.Title;
        newTab.document.getElementById("poster").src =
          data.Poster !== "N/A" ? data.Poster : "default_poster_url";
        newTab.document.getElementById("year").innerText = data.Released;
        newTab.document.getElementById("genre").innerText = data.Genre;
        newTab.document.getElementById("plot").innerText = data.Plot;

        const starRatingElement = newTab.document.getElementById("starRating");
        const starRating = data.imdbRating;
        const totalStars = 5;
        const filledStars = Math.round((starRating / 10) * totalStars);
        starRatingElement.innerHTML = "";
        for (let i = 0; i < totalStars; i++) {
          const star = document.createElement("span");
          star.className = "star";
          if (i < filledStars) {
            star.innerHTML = "&#9733;";
          } else {
            star.innerHTML = "&#9734;";
          }
          starRatingElement.appendChild(star);
        }
      };
    } else {
      console.error("Error fetching movie details:", data.Error);
      alert("Error: Failed to fetch movie details. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    alert("Error: Failed to fetch movie details. Please try again later.");
  }
};

const displayNoResults = () => {
  movieList.innerHTML = "<li class='movie-item'>No results found</li>";
};

const displayError = () => {
  movieList.innerHTML =
    "<li class='movie-item'>An error occurred. Please try again later.</li>";
};

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  if (searchTerm) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchMovieData(searchTerm), 300);
  } else {
    movieList.innerHTML = "";
    displayNoResults();
  }
});
document.body.addEventListener("click", (event) => {
  const isClickInsidePopup = movieList.contains(event.target);
  if (!isClickInsidePopup) {
    movieList.innerHTML = "";
  }
});

// top rated movies
document.addEventListener("DOMContentLoaded", function () {
  const moviesContainer = document.getElementById("moviesContainer");
  const moreBtn = document.getElementById("moreBtn");
  let page = 1;

  moreBtn.addEventListener("click", loadMovies);

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + " ...";
  }

  function generateStarRating(rating) {
    const roundedRating = Math.round(parseFloat(rating) / 2);
    let stars = "";
    for (let i = 0; i < roundedRating; i++) {
      stars += "&#9733;";
    }
    for (let i = roundedRating; i < 5; i++) {
      stars += "&#9734;";
    }
    return stars;
  }

  async function loadMovies() {
    try {
      const url = `${baseUrl}?apikey=${apiKey}&s=movie&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();

      const movies = data.Search;
      if (!movies || movies.length === 0) {
        console.log("No more movies to load");
        loadMoreBtn.disabled = true;
        return;
      }

      const requests = movies.slice(2, 6).map((movie) => {
        return fetch(`${baseUrl}?apikey=${apiKey}&i=${movie.imdbID}&plot=full`);
      });

      const responses = await Promise.all(requests);
      const movieDetails = await Promise.all(
        responses.map((res) => res.json())
      );

      movieDetails.forEach((movie) => {
        const plot = truncateText(movie.Plot, 120);
        const rating = generateStarRating(movie.imdbRating);
        const movieCardItem = document.createElement("div");
        movieCardItem.classList.add("movieCardItem");
        movieCardItem.classList.add("movie-card");
        movieCardItem.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <p class="imdbRating">${movie.imdbRating / 2}<p>
                    <h4>${movie.Title}</h4>
                    <h6 class="rating">${rating}</h6>
                    <p class="movie-cardp">${movie.Released}</p>
                    <p class="movie-cardp">${plot}</p>
                `;
        movieCardItem.addEventListener("click", () => {
          openMovieDetails(movie.imdbID);
        });
        moviesContainer.appendChild(movieCardItem);
      });
      page++;
    } catch (error) {
      console.error("Error loading movies:", error);
    }
    toggleLoadMode();
  }

  loadMovies();
});

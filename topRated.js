const apiKey = "a0a3c5ee";
const baseUrl = "http://www.omdbapi.com/";
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
                    <p class="rating">${rating}</p>
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
  }

  loadMovies();
});

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

let movies = [];
let reviews = [];
let users = [];
let moviesInfos = [];

const responsiveSearchButton = document.getElementById("responsive-search");
const headerLinksDiv = document.getElementById("header-links");
const responsiveSearchSection = document.getElementById(
  "responsive-search-section"
);
const responsiveBackButton = document.getElementById("responsive-back-button");

const homepageElement = document.getElementById("homepage3-poster");

let searchValue = "";

const searchBarElement = document.getElementById("searchbar");
const searchButtonElement = document.getElementById("searchbutton");

// DATA LOADING - movies and reviews from JSON files, moviesInfos from OMDB Api (or LocalStorage)

async function loadData() {
  const movieResponse = await fetch("data/movies.json");
  const movieJSON = await movieResponse.json();
  movies = movieJSON.movies;

  const reviewResponse = await fetch("data/reviews.json");
  const reviewJSON = await reviewResponse.json();
  reviews = reviewJSON.reviews;

  const userResponse = await fetch("data/users.json");
  const userJSON = await userResponse.json();
  users = userJSON.users;

  if (localStorage.moviesInfos) {
    moviesInfos = JSON.parse(localStorage.moviesInfos);
  } else {
    moviesInfos = [];

    for (let movie of movies) {
      const infoResponse = await fetch(
        `http://www.omdbapi.com/?t=${movie.title}&apikey=1d35b601`
      );
      const movieInfo = await infoResponse.json();

      moviesInfos.push({
        movieId: movie.id,
        info: movieInfo,
      });
    }
    localStorage.moviesInfos = JSON.stringify(moviesInfos);
  }

  return true;
}

//SEARCH BAR/BUTTON - Event listeners
searchBarElement.addEventListener("change", function (e) {
  console.log(searchBarElement.value);
  searchValue = this.value;
  e.preventDefault();
  window.location.href = `browse.html?value=${searchValue}`;
});

searchButtonElement.addEventListener("click", function (e) {
  console.log(searchBarElement.value);
  searchValue = searchBarElement.value;
  e.preventDefault();
  window.location.href = `browse.html?value=${searchValue}`;
});

// PRACTICAL FUNCTIONS
function getMovieById(id) {
  return movies.find((movie) => movie.id === id);
}

function getReviewById(id) {
  return reviews.find((review) => review.id === id);
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function getReviewByMovie(movie) {
  return reviews.find((review) => review.movieId === movie.id);
}

function getAllReviewsOf(movie) {
  let movieReviews = [];
  for (let review of reviews) {
    if (review.movieId === movie.id) {
      movieReviews.push(review);
    }
  }
  return movieReviews;
}

// GET MOVIE INFO - if no info available, returns empties for just the "searcheable" properties
function getMovieInfo(id) {
  for (let moviesInfo of moviesInfos) {
    if (moviesInfo.movieId === id) {
      return moviesInfo.info;
    }
  }
  return {
    Plot: "No info available",
    Released: "-",
    Director: "-",
    Actors: "-",
    Runtime: "-",
  };
}

// STAR SCORE - rounds score and displays it as empty (☆) or full (★) stars [ex. SCORE: 3.5 - RETURNS: ★★★★☆]
function starScore(value) {
  let stars = ["☆", "☆", "☆", "☆", "☆"];
  let score = Math.round(value);

  for (let i = 0; i < score; i++) {
    stars[i] = "★";
  }
  return stars;
}

responsiveSearchButton.addEventListener("click", function () {
  headerLinksDiv.style.display = "none";
  responsiveSearchButton.style.display = "none";

  responsiveSearchSection.style.display = "flex";
});

responsiveBackButton.addEventListener("click", function () {
  responsiveSearchSection.style.display = "none";

  headerLinksDiv.style.display = "flex";
  responsiveSearchButton.style.display = "flex";
});

function removeButton(x) {
  if (x.matches) {
    responsiveSearchButton.style.display = "none";
    responsiveSearchSection.style.display = "none";
    headerLinksDiv.style.display = "flex";
  } else {
    responsiveSearchButton.style.display = "flex";
  }
}

var x = window.matchMedia("(min-width: 469px)");

removeButton(x);

x.addEventListener("change", function () {
  removeButton(x);
});

loadData();


// CALCULATE SCORE - calculates average score based on all reviews for a movie
function calculateScore(movie) {
  let allReviews = getAllReviewsOf(movie);
  let totalScore = 0;
  for (let allReview of allReviews) {
    totalScore = totalScore + allReview.score;
  }
  if (allReviews.length === 0) {
    totalScore = 0;
  } else {
    totalScore = totalScore / allReviews.length;
  }
  return totalScore;
}

// UPDATE SCORE - updates the movie score in the movies array
function updateScore(movies) {
  for (let movie of movies) {
    movie.score = calculateScore(movie);
  }
}

// HOME PAGE - recent reviews rendering
function homepage() {
  const lastReviews = getLastReviews(3);
  for (let lastReview of lastReviews) {
    const posterElement = createHomeReview(lastReview);
    homepageElement.appendChild(posterElement);
  }
}

// HOME REVIEW - creates a recent review, Includes: Poster, MovieTitle, Score and ReviewText
function createHomeReview(review) {
  const movie = getMovieById(review.movieId);
  const movieLinkElement = document.createElement("a");
  movieLinkElement.classList.add("link");
  movieLinkElement.href = "detail.html?movie=" + movie.id;

  const movieElement = document.createElement("article");
  movieElement.classList.add("movie");
  movieLinkElement.appendChild(movieElement);

  const imageElement = document.createElement("img");
  imageElement.classList.add("poster", "padding");
  imageElement.src = movie.posterImg;
  movieElement.appendChild(imageElement);

  const titleElement = document.createElement("h5");
  titleElement.classList.add("text", "titlereview");
  titleElement.innerText = movie.title;
  movieElement.appendChild(titleElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(review.score).join(" ");
  movieElement.appendChild(scoreElement);

  const reviewElement = document.createElement("p");
  reviewElement.classList.add("text", "reviewtext");
  reviewElement.innerText = review.text;
  movieElement.appendChild(reviewElement);

  return movieLinkElement;
}

// GET LAST REVIEWS - gets the last reviews added to the review array (most recent)
function getLastReviews(n) {
  let lastReviews = [];
  for (let i = reviews.length - n; i < reviews.length; i++) {
    lastReviews.push(reviews[i]);
  }
  return lastReviews;
}

loadData().then(() => {
  homepage();
});

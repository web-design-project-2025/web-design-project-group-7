let movies = [];
let reviews = [];
let users = [];

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

  return true;
}

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
  let reviews = getAllReviewsOf(movie);
  let totalScore = 0;
  for (let review of reviews) {
    totalScore = totalScore + review.score;
  }
  if (reviews.length === 0) {
    totalScore = 0;
  } else {
    totalScore = totalScore / reviews.length;
  }
  return totalScore;
}

function updateMoviesScore(movies) {
  for (let movie of movies) {
    movie.score = calculateScore(movie);
  }
}

function homepage() {
  const lastReviews = getLastReviews(3);
  for (let lastReview of lastReviews) {
    const posterElement = poster(lastReview);
    homepageElement.appendChild(posterElement);
  }
}

function poster(review) {
  const movie = getMovieById(review.movieId);
  console.log(movie);
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

function getLastReviews(n) {
  let lastReviews = [];
  for (let i = reviews.length - n; i <= reviews.length; i++) {
    lastReviews.push(reviews[i]);
  }
  return lastReviews;
}

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

loadData();
updateMoviesScore(movies);

loadData().then(() => {
  homepage();
});

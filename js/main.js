let movies = [];
let reviews = [];
let users = [];

const responsiveSearchButton = document.getElementById("responsive-search");
const headerLinksDiv = document.getElementById("header-links");
const responsiveSearchSection = document.getElementById(
  "responsive-search-section"
);
const responsiveBackButton = document.getElementById("responsive-back-button");

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

  renderContent();
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

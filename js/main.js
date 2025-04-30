let movies = [];
let reviews = [];
let users = [];

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

let shrek = {
  id: 1,
  title: "Shrek",
  posterImg: "posters/shrek_1.webp",
  genre: "Animation, Comedy, Adventure",
  score: 4.1,
};

function calculateScore(movie) {
  let reviews = getAllReviewsOf(movie);
  let totalScore = 0;
  for (let review of reviews) {
    totalScore = totalScore + review.score;
  }
  return totalScore / reviews.length;
}

function updateMoviesScore(movies) {
  for (let movie of movies) {
    movie.score = calculateScore(movie);
  }
}

loadData();

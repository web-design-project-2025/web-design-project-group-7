let movies = [];
let reviews = [];
let users = [];

const contentElement = document.getElementById("content");
const homepageElement = document.getElementById("homepage3-poster");

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

 // renderContent();
  homepage();
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

function starScore(value) {
  let stars = ["☆", "☆", "☆", "☆", "☆"];
  let score = Math.round(value);

  for (let i = 0; i < score; i++) {
    stars[i] = "★";
  }
  return stars;
}

function createMovieElement(movie) {
  const movieLinkElement = document.createElement("a");
  movieLinkElement.classList.add("link");

  const movieElement = document.createElement("article");
  movieElement.classList.add("movie");
  movieLinkElement.appendChild(movieElement);

  const imageElement = document.createElement("img");
  imageElement.classList.add("padding");
  imageElement.src = movie.posterImg;
  movieElement.appendChild(imageElement);

  const infoElement = document.createElement("div");
  infoElement.classList.add("padding", "info");
  movieElement.appendChild(infoElement);

  const titleElement = document.createElement("h4");
  titleElement.classList.add("text");
  titleElement.innerText = movie.title;
  infoElement.appendChild(titleElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(movie.score).join(" ");
  infoElement.appendChild(scoreElement);

  return movieLinkElement;
}

function renderContent() {
  contentElement.innerHTML = ""; //empty everything

  for (let movie of movies) {
    const movieElement = createMovieElement(movie);
    contentElement.appendChild(movieElement);
  }
}

function homepage () {
  const lastReviews = getLastReviews(3);
  for(let lastReview of lastReviews) {
      const posterElement = poster(lastReview);
      homepageElement.appendChild(posterElement);
  }

}

function poster (review) {
  const movie=getMovieById (review.movieId); 
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
  titleElement.classList.add("text");
  titleElement.innerText = movie.title;
  movieElement.appendChild(titleElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(review.score).join(" ");
  movieElement.appendChild(scoreElement);
  
  const reviewElement = document.createElement("p");
  reviewElement.classList.add("text");
  reviewElement.innerText = review.text;
  movieElement.appendChild(reviewElement);

  return movieLinkElement
}

function getLastReviews(n) {
  let lastReviews = [];
  for(let i=reviews.length-n; i<=reviews.length; i++) {
    lastReviews.push(reviews[i]);
  }
  return lastReviews;
}

loadData();

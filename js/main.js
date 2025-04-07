let movies = [];
let reviews = [];
let users = [];

async function loadData() {
  const movieResponse = await fetch("data/movies.json");
  const movieJSON = await movieResponse.json();
  movies = movieJSON.movies;
  console.log(movies);

  const reviewResponse = await fetch("data/reviews.json");
  const reviewJSON = await reviewResponse.json();
  reviews = reviewJSON.reviews;
  console.log(reviews);

  const userResponse = await fetch("data/users.json");
  const userJSON = await userResponse.json();
  users = userJSON.users;
  console.log(users);
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

loadData();

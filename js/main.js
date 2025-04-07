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
}

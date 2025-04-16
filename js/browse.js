const contentElement = document.getElementById("content");

function createMovieElement(movie) {
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

  const infoElement = document.createElement("div");
  infoElement.classList.add("info");
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

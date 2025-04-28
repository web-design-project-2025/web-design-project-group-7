const contentElement = document.getElementById("d-content");

async function loadMovieInfo(title) {
  //https://stackoverflow.com/questions/50983150/how-to-pass-a-variable-with-url-on-javascript-fetch-method
  fetch(`http://www.omdbapi.com/?t=${title}&apikey=1d35b601`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

function renderContent() {
  //https://stackoverflow.com/questions/55372998/open-same-page-with-different-content
  //https://www.sitepoint.com/get-url-parameters-with-javascript/

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie");
  /* console.log(movieId + 2); */
  const movie = getMovieById(Number(movieId));

  loadMovieInfo(movie.title);

  contentElement.innerHTML = "";

  const detailElement = createDetailElement(movie);
  contentElement.appendChild(detailElement);

  const movieReviews = getAllReviewsOf(movie);
  for (let movieReview of movieReviews) {
    const reviewElement = createReviewElement(movieReview);
    contentElement.appendChild(reviewElement);
  }
}

function createDetailElement(movie) {
  const detailElement = document.createElement("section");
  detailElement.classList.add("d-movie");

  const imageElement = document.createElement("img");
  imageElement.classList.add("poster");
  imageElement.src = movie.posterImg;
  detailElement.appendChild(imageElement);

  const infoElement = document.createElement("div");
  infoElement.classList.add("info");
  detailElement.appendChild(infoElement);

  const titleElement = document.createElement("h4");
  titleElement.classList.add("text");
  titleElement.innerText = movie.title;
  infoElement.appendChild(titleElement);

  const releaseElement = document.createElement("h6");
  releaseElement.classList.add("text", "stars");
  releaseElement.innerText = movie.release;
  infoElement.appendChild(releaseElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(movie.score).join(" ");
  infoElement.appendChild(scoreElement);

  const reviewByElement = document.createElement("p");
  reviewByElement.classList.add("text", "reviewed-by");
  reviewByElement.innerText =
    "reviewed by " + getUserById(getReviewByMovie(movie).userId).name;
  infoElement.appendChild(reviewByElement);

  return detailElement;
}

function createReviewElement(review) {
  const reviewElement = document.createElement("article");
  /* detailElement.classList.add("d-movie"); */

  const textElement = document.createElement("p");
  textElement.innerText = review.text;
  reviewElement.appendChild(textElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(review.score).join(" ");
  reviewElement.appendChild(scoreElement);

  return reviewElement;
}

const contentElement = document.getElementById("d-content");
let movieInfo = "";

async function loadMovieInfo(title) {
  //https://stackoverflow.com/questions/50983150/how-to-pass-a-variable-with-url-on-javascript-fetch-method
  /* fetch(`http://www.omdbapi.com/?t=${title}&apikey=1d35b601`)
    .then((response) => response.json())
    .then((data) => console.log(data)); */

  const infoResponse = await fetch(
    `http://www.omdbapi.com/?t=${title}&apikey=1d35b601`
  );
  movieInfo = await infoResponse.json();
}

async function renderContent() {
  //https://stackoverflow.com/questions/55372998/open-same-page-with-different-content
  //https://www.sitepoint.com/get-url-parameters-with-javascript/

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie");
  /* console.log(movieId + 2); */
  const movie = getMovieById(Number(movieId));
  console.log(movie);

  await loadMovieInfo(movie.title);

  contentElement.innerHTML = "";

  const backImageElement = createbackgroundImgElement(movie);
  contentElement.appendChild(backImageElement);

  const detailElement = document.createElement("div");
  detailElement.classList.add("d-stuff");

  const detailInfoElement = createDetailInfoElement(movie, movieInfo);
  detailElement.appendChild(detailInfoElement);

  const reviewTitleElement = createRecentReviewsHeader();
  detailElement.appendChild(reviewTitleElement);

  const movieReviews = getAllReviewsOf(movie);
  for (let movieReview of movieReviews) {
    const reviewElement = createReviewElement(movieReview);
    detailElement.appendChild(reviewElement);
  }

  contentElement.appendChild(detailElement);
}

function createbackgroundImgElement(movie) {
  const backImageElement = document.createElement("div");
  backImageElement.classList.add("bg-img-container");
  backImageElement.style.background = "#0000FF";

  const gradientElement = document.createElement("div");
  gradientElement.classList.add("bg-gradient");
  backImageElement.appendChild(gradientElement);

  const imgElement = document.createElement("img");
  imgElement.classList.add("bg-img");
  imgElement.src = movie.posterImg;
  backImageElement.appendChild(imgElement);

  return backImageElement;
}

function createDetailInfoElement(movie, info) {
  const detailElement = document.createElement("section");
  detailElement.classList.add("d-movie");

  const infoElement = document.createElement("div");
  infoElement.classList.add("info");
  detailElement.appendChild(infoElement);

  const titleElement = document.createElement("h1");
  titleElement.classList.add("d-title");
  titleElement.innerText = movie.title;
  infoElement.appendChild(titleElement);

  const scoreElement = document.createElement("section");
  scoreElement.classList.add("score-container");

  const starsElement = document.createElement("p");
  starsElement.classList.add("title-stars");
  starsElement.innerText = starScore(movie.score).join(" ");
  scoreElement.appendChild(starsElement);

  const basedOnElement = document.createElement("p");
  basedOnElement.classList.add("title-basedOn", "transparent-white-italic");
  basedOnElement.innerText = "based on";
  scoreElement.appendChild(basedOnElement);

  const numberElement = document.createElement("p");
  numberElement.classList.add("title-number");
  numberElement.innerText = movie.reviews + " reviews";
  scoreElement.appendChild(numberElement);

  infoElement.appendChild(scoreElement);

  const plotElement = document.createElement("p");
  plotElement.classList.add("plot");
  plotElement.innerText = info.Plot;
  infoElement.appendChild(plotElement);

  //list with recurring info fields
  const infoUlElement = document.createElement("ul");
  infoUlElement.classList.add("ul-info");

  const titles = ["Released", "Director", "Actors", "Runtime"];
  for (let title of titles) {
    const item = createInfoListElement(title, movieInfo);
    infoUlElement.appendChild(item);
  }

  infoElement.appendChild(infoUlElement);

  const imageElement = document.createElement("img");
  imageElement.classList.add("poster");
  imageElement.src = movie.posterImg;
  detailElement.appendChild(imageElement);

  return detailElement;
}

function createReviewElement(review) {
  const reviewElement = document.createElement("article");
  /* detailElement.classList.add("d-movie"); */

  const titleContainerElement = document.createElement("div");
  titleContainerElement.classList.add("review-title-container");

  const titleElement = document.createElement("h4");
  titleElement.classList.add("review-title");
  titleElement.innerText = review.title;
  titleContainerElement.appendChild(titleElement);

  const nameElement = document.createElement("p");
  nameElement.classList.add("review-name", "transparent-white-italic");
  nameElement.innerText = "by " + getUserById(review.userId).name;
  titleContainerElement.appendChild(nameElement);

  reviewElement.appendChild(titleContainerElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("small-stars");
  scoreElement.innerText = starScore(review.score).join(" ");
  reviewElement.appendChild(scoreElement);

  const textElement = document.createElement("p");
  textElement.classList.add("review-text");
  textElement.innerText = review.text;
  reviewElement.appendChild(textElement);

  return reviewElement;
}

function createRecentReviewsHeader() {
  const reviewTitleContainerElement = document.createElement("div");
  reviewTitleContainerElement.classList.add("review-header-container");

  const reviewTitleElement = document.createElement("h3");
  reviewTitleElement.innerText = "Recent Reviews";
  reviewTitleContainerElement.appendChild(reviewTitleElement);

  const addReviewButtonElement = document.createElement("button");
  addReviewButtonElement.innerHTML =
    '<img class="button-icon" src="img/plus-circle.svg" alt="plus icon">Add Review';
  addReviewButtonElement.classList.add("add-review-button");
  reviewTitleContainerElement.appendChild(addReviewButtonElement);

  return reviewTitleContainerElement;
}

//creates li element with title and value or input-ed field (year, director...)
function createInfoListElement(keyword, info) {
  const itemElement = document.createElement("li");
  itemElement.classList.add("list-items");
  const titleElement = document.createElement("h6");
  titleElement.classList.add("list-title");
  titleElement.innerText = keyword + ":";
  itemElement.appendChild(titleElement);

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("list-description");
  descriptionElement.innerText = info[keyword];
  itemElement.appendChild(descriptionElement);

  return itemElement;
}

loadData().then(() => {
  renderContent();
});

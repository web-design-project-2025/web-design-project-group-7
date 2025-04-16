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

/* function to open rating overlays */
function downArrowOverlay(arrowId, overlayId) {
  const arrowElement = document.getElementById(arrowId);
  const overlayElement = document.getElementById(overlayId);

  arrowElement.addEventListener("click", function (e) {
    arrowElement.style.transform = "scaleY(-1)";
    overlayElement.style.display = "block";

    /*  https://www.30secondsofcode.org/js/s/listen-click-outside-event/ 
    const onClickOutside = (element, callback) => {
      document.addEventListener("click", (e) => {
        if (!element.contains(e.target)) callback();
      });
    };
    onClickOutside(overlayElement, () => console.log("Hello")); */
  });
}

downArrowOverlay("title-arrow", "title-overlay");
downArrowOverlay("rating-arrow", "rating-overlay");

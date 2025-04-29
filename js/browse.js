const contentElement = document.getElementById("content");

let page = 1;
const numberPerPage = 12;

const firstPagElement = document.getElementById("first-pag");
const previousPagElement = document.getElementById("previous-pag");
const nextPagElement = document.getElementById("next-pag");
const lastPagElement = document.getElementById("last-pag");

function changePage(newPage) {
  page = newPage;
  renderContent();
  window.scrollTo({ top: 0 });
}

firstPagElement.addEventListener("click", function (e) {
  changePage(1);
});
previousPagElement.addEventListener("click", function (e) {
  if (page > 1) {
    changePage(page - 1);
  }
});
lastPagElement.addEventListener("click", function (e) {
  changePage(Math.ceil(movies.length / numberPerPage));
});
nextPagElement.addEventListener("click", function (e) {
  if (page < Math.ceil(movies.length / numberPerPage)) {
    changePage(page + 1);
  }
  window.scrollTo({ top: 0 });
});

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

  const titleElement = document.createElement("h5");
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
  for (let i = (page - 1) * numberPerPage; i < page * numberPerPage; i++) {
    const movieElement = createMovieElement(movies[i]);
    contentElement.appendChild(movieElement);
  }
}

/* function to open rating overlays */
function downArrowOverlay(arrowId, overlayId) {
  const arrowElement = document.getElementById(arrowId);
  const overlayElement = document.getElementById(overlayId);
  let isOpen = false;

  arrowElement.addEventListener("click", function (e) {
    if (!isOpen) {
      arrowElement.style.transform = "scaleY(-1)";
      overlayElement.style.display = "block";
      isOpen = true;
    } else {
      arrowElement.style.transform = "scaleY(1)";
      overlayElement.style.display = "none";
      isOpen = false;
    }

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

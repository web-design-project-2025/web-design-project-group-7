const contentElement = document.getElementById("content");

let page = 1;
const numberPerPage = 12;
let filter = "Show";

const firstPagElement = document.getElementById("first-pag");
const previousPagElement = document.getElementById("previous-pag");
const nextPagElement = document.getElementById("next-pag");
const lastPagElement = document.getElementById("last-pag");

//const filterDramaElement = document.getElementById("filter-drama");
//const filterHorrorElement = document.getElementById("filter-horror");
const filterListElement = document.getElementById("filter-list");

function changePage(newPage) {
  page = newPage;
  renderContent();
  window.scrollTo({ top: 0 });
}

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

function filterBy(genre, movie) {
  const filterGeneres = movie.genre.split(", ");
  if (filterGeneres.includes(genre)) {
    const movieElement = createMovieElement(movie);
    contentElement.appendChild(movieElement);
  }
}

function renderContent() {
  contentElement.innerHTML = ""; //empty everything

  const start = (page - 1) * numberPerPage;
  const end = page * numberPerPage;
  for (let i = start; i < end; i++) {
    let movie = movies[i];
    filterBy(filter, movie);
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

async function filterOverlayTitles() {
  let genres = [];
  await loadData();
  for (let movie of movies) {
    let nowGenre = movie.genre;
    const genreArray = nowGenre.split(", ");
    //console.log("first array" + genreArray);

    for (let i = 0; i < genreArray.length; i++) {
      if (genres.includes(genreArray[i]) === false) {
        genres.push(genreArray[i]);
        //console.log("first loop" + genres);
      }
    }
  }
  genres.sort();
  const showInd = genres.indexOf("Show");
  //console.log("sort" + genres);
  //console.log(showInd);
  genres.splice(showInd, 1);
  genres.unshift("Show");
  //console.log("unshift" + genres);

  for (let genre of genres) {
    const filterLiElement = document.createElement("li");
    filterLiElement.classList.add("filter-name");
    filterLiElement.innerText = genre;

    filterLiElement.addEventListener("click", function (e) {
      filter = genre;
      closeOverlay("genre-arrow", "genre-overlay");
      page = 1;
      renderContent();
    });
    filterListElement.appendChild(filterLiElement);
  }
}

function closeOverlay(arrowId, overlayId) {
  const arrowElement = document.getElementById(arrowId);
  const overlayElement = document.getElementById(overlayId);
  arrowElement.style.transform = "scaleY(1)";
  overlayElement.style.display = "none";
}

function loadBrowsePage() {
  renderContent();
  filterOverlayTitles();
  downArrowOverlay("title-arrow", "title-overlay");
  downArrowOverlay("rating-arrow", "rating-overlay");
  downArrowOverlay("genre-arrow", "genre-overlay");

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
}

loadData().then(() => {
  loadBrowsePage();
});

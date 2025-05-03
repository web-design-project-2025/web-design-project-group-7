const contentElement = document.getElementById("content");

const urlParams = new URLSearchParams(window.location.search);
searchValue = urlParams.get("value");

let page = 1;
const numberPerPage = 12;
let filter = "Show All";

let openOverlay = "none";

const firstPagElement = document.getElementById("first-pag");
const previousPagElement = document.getElementById("previous-pag");
const nextPagElement = document.getElementById("next-pag");
const lastPagElement = document.getElementById("last-pag");
const pageNumberElement = document.getElementById("page-number");

//const filterDramaElement = document.getElementById("filter-drama");
//const filterHorrorElement = document.getElementById("filter-horror");
const filterListElement = document.getElementById("filter-list");

const sortAzElement = document.getElementById("sort-a-z");
const sortZaElement = document.getElementById("sort-z-a");
const sortNewElement = document.getElementById("sort-new");
const sortOldElement = document.getElementById("sort-old");
const sortHighElement = document.getElementById("sort-high");
const sortLowElement = document.getElementById("sort-low");

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

  const posterContainerElement = document.createElement("div");
  posterContainerElement.classList.add("poster-container");
  movieElement.appendChild(posterContainerElement);

  const imageElement = document.createElement("img");
  imageElement.classList.add("movie-img");
  imageElement.src = movie.posterImg;
  posterContainerElement.appendChild(imageElement);

  const lastVisitedElement = document.createElement("div");
  lastVisitedElement.classList.add("visited");
  posterContainerElement.appendChild(lastVisitedElement);

  const lastTextElement = document.createElement("p");
  lastTextElement.classList.add("visited-text");
  lastTextElement.innerText = "You Were Here";
  lastVisitedElement.appendChild(lastTextElement);

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

  updateMoviesScore(movies);
  if (searchValue) {
    movies = searchTitle(movies, searchValue);
    const filtersContainerElement =
      document.getElementById("filters-container");
    const resultTitleElement = document.getElementById(
      "result-title-container"
    );
    filtersContainerElement.style.display = "none";

    const resultsElement = document.createElement("p");
    resultsElement.innerText = "Showing results for: '" + searchValue + "'";
    resultTitleElement.appendChild(resultsElement);
  }
  for (let i = (page - 1) * numberPerPage; i < page * numberPerPage; i++) {
    let movie = movies[i];
    filterBy(filter, movie);
  }
  pageNumberElement.innerText =
    "Page " + page + " of " + Math.ceil(movies.length / numberPerPage);
}

function closeOtherOverlays(overlayId) {
  if (overlayId === "title-overlay") {
    closeOverlay("rating-arrow", "rating-overlay");
    closeOverlay("genre-arrow", "genre-overlay");
    closeOverlay("posted-arrow", "posted-overlay");
  }
  if (overlayId === "genre-overlay") {
    closeOverlay("title-arrow", "title-overlay");
    closeOverlay("rating-arrow", "rating-overlay");
    closeOverlay("posted-arrow", "posted-overlay");
  }
  if (overlayId === "rating-overlay") {
    closeOverlay("title-arrow", "title-overlay");
    closeOverlay("genre-arrow", "genre-overlay");
    closeOverlay("posted-arrow", "posted-overlay");
  }
  if (overlayId === "posted-overlay") {
    closeOverlay("rating-arrow", "rating-overlay");
    closeOverlay("genre-arrow", "genre-overlay");
    closeOverlay("title-arrow", "title-overlay");
  }
}

/* function to open rating overlays */
function downArrowOverlay(wordId, arrowId, overlayId) {
  const wordElement = document.getElementById(wordId);
  const arrowElement = document.getElementById(arrowId);
  const overlayElement = document.getElementById(overlayId);

  wordElement.addEventListener("click", function (e) {
    if (openOverlay === overlayId) {
      arrowElement.style.transform = "scaleY(1)";
      overlayElement.style.display = "none";
      openOverlay = "none";
    } else {
      closeOtherOverlays(overlayId);
      arrowElement.style.transform = "scaleY(-1)";
      overlayElement.style.display = "block";
      openOverlay = overlayId;
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
  const showInd = genres.indexOf("Show All");
  //console.log("sort" + genres);
  //console.log(showInd);
  genres.splice(showInd, 1);
  genres.unshift("Show All");
  //console.log("unshift" + genres);

  for (let genre of genres) {
    const filterLiElement = document.createElement("li");
    filterLiElement.classList.add("filter-name");
    filterLiElement.innerText = genre;
    if (genre === "Show All") {
      filterLiElement.classList.add("filter-show-all");
    }

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

function searchTitle(movies, text) {
  let searchResults = [];
  for (let movie of movies) {
    const title = movie.title.toLowerCase();
    if (title.includes(text)) {
      searchResults.push(movie);
    }
  }
  return searchResults;
}

function loadBrowsePage() {
  updateMoviesScore(movies);
  console.log(updateMoviesScore(movies));
  renderContent();
  filterOverlayTitles();
  downArrowOverlay("title-word", "title-arrow", "title-overlay");
  downArrowOverlay("posted-word", "posted-arrow", "posted-overlay");
  downArrowOverlay("rating-word", "rating-arrow", "rating-overlay");
  downArrowOverlay("genre-word", "genre-arrow", "genre-overlay");

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

  sortAzElement.addEventListener("click", function (e) {
    movies.sort(function (a, b) {
      return compareStrings(a.title, b.title);
    });

    closeOverlay("title-arrow", "title-overlay");
    page = 1;
    renderContent();
  });

  sortZaElement.addEventListener("click", function (e) {
    movies.sort(function (a, b) {
      return compareStrings(a.title, b.title);
    });
    movies.reverse();

    closeOverlay("title-arrow", "title-overlay");
    page = 1;
    renderContent();
  });

  sortNewElement.addEventListener("click", function (e) {
    movies.sort(function (a, b) {
      return b.id - a.id;
    });

    closeOverlay("posted-arrow", "posted-overlay");
    page = 1;
    renderContent();
  });

  sortOldElement.addEventListener("click", function (e) {
    movies.sort(function (a, b) {
      return a.id - b.id;
    });

    closeOverlay("posted-arrow", "posted-overlay");
    page = 1;
    renderContent();
  });

  sortHighElement.addEventListener("click", function (e) {
    //updateMoviesScore(movies);
    movies.sort(function (a, b) {
      return b.score - a.score;
    });
    closeOverlay("rating-arrow", "rating-overlay");
    page = 1;
    renderContent();
  });

  sortLowElement.addEventListener("click", function (e) {
    //updateMoviesScore(movies);
    movies.sort(function (a, b) {
      return a.score - b.score;
    });

    closeOverlay("rating-arrow", "rating-overlay");
    page = 1;
    renderContent();
  });
}

//the following "compareStrings(a, b)" function is from: https://stackoverflow.com/questions/19259233/sorting-json-by-specific-element-alphabetically
function compareStrings(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

loadData().then(() => {
  loadBrowsePage();
});

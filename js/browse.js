const urlParams = new URLSearchParams(window.location.search);
searchValue = urlParams.get("value");

let page = 1;
const numberPerPage = 12;
let filter = "Show All";
let openOverlay = "none";

const contentElement = document.getElementById("content");
const firstPagElement = document.getElementById("first-pag");
const previousPagElement = document.getElementById("previous-pag");
const nextPagElement = document.getElementById("next-pag");
const lastPagElement = document.getElementById("last-pag");
const pageNumberElement = document.getElementById("page-number");
const filterListElement = document.getElementById("filter-list");

const sortAzElement = document.getElementById("sort-a-z");
const sortZaElement = document.getElementById("sort-z-a");
const sortNewElement = document.getElementById("sort-new");
const sortOldElement = document.getElementById("sort-old");
const sortHighElement = document.getElementById("sort-high");
const sortLowElement = document.getElementById("sort-low");

// PRACTICAL FUNCTIONS
function changePage(newPage) {
  page = newPage;
  renderContent();
  window.scrollTo({ top: 0 });
}

// FILTER BY - creates the movieElements only for movies that match the applied filter
function filterBy(genre, movie) {
  const filterGeneres = movie.genre.split(", ");
  if (filterGeneres.includes(genre)) {
    const movieElement = createMovieElement(movie);
    contentElement.appendChild(movieElement);
  }
}

// COMPARE STRING
/* the following "compareStrings(a, b)" function is from:
https://stackoverflow.com/questions/19259233/sorting-json-by-specific-element-alphabetically */
function compareStrings(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// OVERLAY FUNCTIONS - various open and close overlays functions + eventListeners for items inside overlays
function closeOverlay(arrowId, overlayId) {
  const arrowElement = document.getElementById(arrowId);
  const overlayElement = document.getElementById(overlayId);
  arrowElement.style.transform = "scaleY(1)";
  overlayElement.style.display = "none";
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

// OPEN SORTING OVERLAYS
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
  });
}

// GENRES FILTER FUNCTION
/* This function: - creates an array that includes every movie.genre, without duplicates
                  - orders them in aphabetical order, keeping ""Show All" at the top
                  - displays the genres in the genre filter overlay*/
function filterOverlayTitles() {
  let genres = [];
  for (let movie of movies) {
    let nowGenre = movie.genre;
    const genreArray = nowGenre.split(", ");

    for (let i = 0; i < genreArray.length; i++) {
      if (genres.includes(genreArray[i]) === false) {
        genres.push(genreArray[i]);
      }
    }
  }
  genres.sort();
  const showInd = genres.indexOf("Show All");
  genres.splice(showInd, 1);
  genres.unshift("Show All");
  filterListElement.innerHTML = "";

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

// SEARCH FUNCTION - (Title, Actors, Director, Release date)
function searchTitle(movies, text) {
  let searchResults = [];
  for (let movie of movies) {
    const info = getMovieInfo(movie.id);
    const searchable = (
      movie.title +
      info.Actors +
      info.Director +
      info.Released
    ).toLowerCase();
    if (searchable.includes(text)) {
      searchResults.push(movie);
    }
  }
  return searchResults;
}

// MOVIE ELEMENT - creates movie element for browse page
/* Includes: - Poster 
                 - LastVisited (movie.id saved in LocalStorage, default-display:none, unless id is the saved one)
                 - Info: Title and Score */
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
  lastVisitedElement.style.display = "none";
  posterContainerElement.appendChild(lastVisitedElement);

  const lastTextElement = document.createElement("p");
  lastTextElement.classList.add("visited-text");
  lastTextElement.innerText = "You Were Here";
  lastVisitedElement.appendChild(lastTextElement);

  if (movie.id == localStorage.visited) {
    lastVisitedElement.style.display = "block";
  }

  const infoElement = document.createElement("div");
  infoElement.classList.add("info");
  movieElement.appendChild(infoElement);

  const titleElement = document.createElement("h5");
  titleElement.classList.add("text", "title");
  titleElement.innerText = movie.title;
  infoElement.appendChild(titleElement);

  const scoreElement = document.createElement("p");
  scoreElement.classList.add("text");
  scoreElement.innerText = starScore(movie.score).join(" ");
  infoElement.appendChild(scoreElement);

  return movieLinkElement;
}

// BROWSE PAGE - rendering of movie grid, 12 elements per page (+ search results text)
function renderContent() {
  contentElement.innerHTML = ""; //empty everything

  updateScore(movies);

  // The page is used for displaying the search results when the search bar is used
  if (searchValue) {
    const searchMovies = searchTitle(movies, searchValue);

    const resultTitleElement = document.getElementById(
      "result-title-container"
    );
    resultTitleElement.innerHTML = "";
    const resultsElement = document.createElement("p");
    resultsElement.classList.add("search-results");
    resultsElement.innerText = "Showing results for: '" + searchValue + "'";
    resultTitleElement.appendChild(resultsElement);
    if (searchMovies.length > 0) {
      movies = searchMovies;
      filterOverlayTitles();
    } else {
      const noResultsElement = document.createElement("section");
      noResultsElement.classList.add("no-res-container");
      const noResultsHeaderElement = document.createElement("h3");
      noResultsHeaderElement.innerText = "OH NO! WE ARE REAL LOSERS!";
      noResultsHeaderElement.classList.add("no-res-header");
      noResultsElement.appendChild(noResultsHeaderElement);
      const noResultsTextElement = document.createElement("P");
      noResultsTextElement.innerText = "We could find what you are looking for";
      noResultsTextElement.classList.add("no-res-text");
      noResultsElement.appendChild(noResultsTextElement);
      const sadLogo = document.createElement("img");
      sadLogo.src = "img/logo.svg";
      sadLogo.classList.add("no-res-logo");
      noResultsElement.appendChild(sadLogo);
      resultTitleElement.appendChild(noResultsElement);

      movies = searchMovies;
      filterOverlayTitles();
    }
  }

  // Pagination
  for (let i = (page - 1) * numberPerPage; i < page * numberPerPage; i++) {
    let movie = movies[i];
    filterBy(filter, movie); // This creates movieElements
  }
  pageNumberElement.innerText =
    "Page " + page + " of " + Math.ceil(movies.length / numberPerPage);
}

function loadBrowsePage() {
  updateScore(movies);
  filterOverlayTitles();

  // EVENT LISTENERS
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
    movies.sort(function (a, b) {
      return b.score - a.score;
    });
    closeOverlay("rating-arrow", "rating-overlay");
    page = 1;
    renderContent();
  });

  sortLowElement.addEventListener("click", function (e) {
    movies.sort(function (a, b) {
      return a.score - b.score;
    });

    closeOverlay("rating-arrow", "rating-overlay");
    page = 1;
    renderContent();
  });
  renderContent();
}

loadData().then(() => {
  loadBrowsePage();
});

/* okay */

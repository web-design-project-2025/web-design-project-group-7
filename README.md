### web-design-project-group-7

web-design-project-group-7 created by GitHub Classroom

# MOVIE REVIEW WEBSITE - Local Movie Club

The idea behind this Website was to develop a space for the memebers of a small movie club to share their toughts on the limited list of movies the club watches and reviews.  
Responsive website, that allows users to browse movies, find detailed information about each movie and read and write reviews.

**Languages:** HTML, CSS and JavaScript

## Basic Structure:

_index.html_ = Homepage  
_browse.html_ = Browse all movies  
_detail.html_ = Movie detail page  
_new-review.html_ = Form to add new review  
_about-us.html_ = About us page **_(editorial page)_**

**data/**

- _movies.json_ = list of movies on the website
- _reviews.json_ = list of reviews for the movies on the website

**js/**

- _main.js_ Shared logic (data loading and practical functions) + home page dinamic rendering
- _browse.js_ Browse page (including search feature)
- _detail.js_ Detail page

**css/** stylesheets for corrsponding hml pages  
**img/** posters, icons and other images

## Branching Strategy

This project implements a variation of the _GitLab Flow_ strategy. The default branch is named **_"production,"_** all feature development branches originate from there. The **_"main"_** branch is the one with the finalised code, ready for deployment.

## Features

- **LOADING DATA**: gathering of information from local JSON files (movies.json, reviews.json) and the OMDb API [http://www.omdbapi.com/] for additional movie info.
- **BROWSE MOVIES**: displayed with pagination, sorting functions (by Title, When Added to the website, Score), and filtering (by Genre)
- **SEARCH FUNCTIONALITY**: the search bar is present at the top of every page. Search results are displayed in the browse page and can be filtered/sorted. Search results include Title, Actors, Release Date and Director (as available on OMDb API).
- **WebStorage API USAGE**: movie informations gathered from OMDb are stored locally, to avoid repeated calls of the API. LocalStorage is also used to save recently visited movies.
- **STAR RATINGS**: several functions calculate and update movie score based on its reviews. Said score is then displayed visually with full and empty star char.
- **MOVIE DETAILS**: gathered from both local json files and public API and displayed in the detail page, along with recently visited movies from localStorage.
- **REVIEW SUBMISSIONS**: users can leave a review using a form. Given the small size of our target group we opted for a "Type your name" field in the form, rather than implementing user login or profiles
- **RESPONSIVE DESIGN**: curated layouts for varying screen sizes.

_All key JavaScript functions are commented inline for clarity.  
All sources for code snippets borrowed or adapted from online resouces are credited inline_

## Authors:

- Lisa Eriksson
- Tindra Jedensjö
- Rebecca Cuomo

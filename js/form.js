const starOneElement = document.getElementById("star-1");
const starTwoElement = document.getElementById("star-2");
const starThreeElement = document.getElementById("star-3");
const starFourElement = document.getElementById("star-4");
const starFiveElement = document.getElementById("star-5");

let stars = [
  starOneElement,
  starTwoElement,
  starThreeElement,
  starFourElement,
  starFiveElement,
];

stars.forEach(function (star) {
  star.addEventListener("click", function (e) {
    resetStars(stars);
    this.checked = true;
    const score = stars.indexOf(this);
    console.log(score);
    setStarScore(stars, score);
  });
});

function resetStars(stars) {
  stars.forEach(function (s) {
    s.checked = false;
  });
}

function setStarScore(stars, score) {
  for (let i = 0; i <= score; i++) {
    stars[i].checked = "true";
  }
}

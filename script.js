"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//smooth scrolling to section/////
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  //preventing any extra funcitonalities other than links
  if (e.target.classList.contains("nav__link")) {
    //stored the link
    const id = e.target.getAttribute("href");
    //went to the element with the link as href
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //activate tab
  clicked.classList.add("operations__tab--active");

  //activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

const handleHover = function (e) {
  if (e.target.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

/////sticky header////
//when mouse is hovering
nav.addEventListener("mouseover", handleHover.bind(0.5));
//when mouse has left
nav.addEventListener("mouseout", handleHover.bind(1));

//for smooth scrolling we use observer intersection API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

//callback fn
const stickyNav = function (entries) {
  //since we have only one entry we will use first value
  const [entry] = entries;
  //if entry is not intersecting add sticky class if it is remove it
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

//observing header
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //viewport is root
  threshold: 0, //when we leave or enter the header
  rootMargin: `-${navHeight}px`, //instead of hardcoding value we calculate value of height acc to viewport
});
headerObserver.observe(header);

//smooth scrolling of sections////////
const allSections = document.querySelectorAll(".section");
//callback fn
const revealSection = function (entries, observer) {
  const [entry] = entries;

  //if section is not intersecting end fn
  if (!entry.isIntersecting) return;
  //else remove hidden class
  entry.target.classList.remove("section--hidden");
  //stop observing after section has been observed
  observer.unobserve(entry.target);
};
//observer function
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
//running observer for each section
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//lazy loading images//////
//selecting images with data src attribute
const imgTargets = document.querySelectorAll("img[data-src]");
//callback function
const loadImg = function (entries, observer) {
  const [entry] = entries;
  //if not intersecting return
  if (!entry.isIntersecting) return;
  //applying datasrc value to src
  entry.target.src = entry.target.dataset.src;
  //when image loads remove blurry class
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  //finally stop observing
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//slider////
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");
  //number for current slide and max slide
  let curSlide = 0;
  let maxSlide = slides.length;

  //creating dot function
  const createDots = function () {
    //adding dots according to the slide number
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    //selecting dots and removing active clasx
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    //selecting dots and assigining slide number to data attr of dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };
  //using transform property to slide sliders to the left
  const goToSlide = function (slide) {
    slides.forEach(
      //for ith slide it will be 100 x i so fitll be 0, 100, 200 and so on
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide in right arrow
  const nextSlide = function () {
    //for last slide
    if (curSlide === maxSlide - 1) {
      //go back to first
      curSlide = 0;
    } else {
      //go to next
      curSlide++;
    }
    //moving to next slide and activating dot
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  //next slide in left arrow
  const prevSlide = function () {
    //if first then go to last
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      //go to previous
      curSlide--;
    }
    //go to next and activate its dot
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    //initialization of page
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  //for keyboard keys
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  //clicking on dots to go on respective slides
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

window.addEventListener("load", function() {
const loader = document.getElementById("loader");
   const main = document.getElementById("main-content");
   const logo = document.querySelector(".logo-wrapper .logo");

   // Animasi fade in/out logo
   logo.classList.add("fade-in");
   setTimeout(() => {
     logo.classList.remove("fade-in");
     logo.classList.add("fade-out");
   }, 1500);

   // Sembunyikan loader, tampilkan konten
   setTimeout(() => {
     loader.style.opacity = "0";
     loader.style.transition = "opacity 0.6s ease";
     setTimeout(() => {
       loader.style.display = "none";
       main.style.display = "block";
     }, 600);
   }, 2200);
 });

// =======================
// CAROUSEL FIXED VERSION
// =======================

// Track asli kamu → ID projectCarousel
// =======================
// PROJECT CAROUSEL - FINAL
// =======================
const carousel = document.getElementById("projectCarousel");
const viewport = document.querySelector(".project-carousel-viewport");

// Ambil semua card original
let cards = Array.from(document.querySelectorAll(".project-carousel-card"));
const totalOriginal = cards.length;

let currentIndex = 0;          // index logical (0..totalOriginal-1)
let isTransitioning = false;
let isDragging = false;
let startX = 0;
let startTranslateX = 0;

// =======================
// CLONE DEPAN & BELAKANG
// =======================
cards.forEach((card) => {
  const cloneFront = card.cloneNode(true);
  const cloneBack = card.cloneNode(true);
  carousel.appendChild(cloneFront);                     // clone di belakang
  carousel.insertBefore(cloneBack, carousel.firstChild); // clone di depan
});

// Update list cards (sekarang: clone belakang + original + clone depan)
cards = Array.from(document.querySelectorAll(".project-carousel-card"));

// =======================
// FUNGSI BANTU: LEBAR CARD
// =======================
function getCardWidth() {
  const card = cards[0];
  const rect = card.getBoundingClientRect();
  const style = window.getComputedStyle(card);
  const marginLeft = parseFloat(style.marginLeft) || 0;
  const marginRight = parseFloat(style.marginRight) || 0;
  return rect.width + marginLeft + marginRight;
}

let cardWidth = getCardWidth();

// =======================
// INDICATORS
// =======================
const indicators = document.getElementById("projectCarouselIndicators");
indicators.innerHTML = ""; // bersihin kalau ada sisa

for (let i = 0; i < totalOriginal; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  indicators.appendChild(dot);
}
const dots = Array.from(indicators.querySelectorAll(".dot"));

function updateIndicators() {
  const activeIndex =
    ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
}

// =======================
// ACTIVE CARD (TENGAH)
// =======================
function updateActiveCards() {
  cards.forEach((card) => card.classList.remove("active"));

  const physicalIndex = currentIndex + totalOriginal; // block original di tengah
  if (cards[physicalIndex]) {
    cards[physicalIndex].classList.add("active");
  }
}

// =======================
// HITUNG TRANSLATE UNTUK INDEX
// =======================
function getTranslateForIndex(index) {
  const viewportWidth = viewport.getBoundingClientRect().width;
  cardWidth = getCardWidth(); // selalu refresh biar responsive valid

  const physicalIndex = index + totalOriginal; // index real di DOM
  const translateX =
    -(physicalIndex * cardWidth) + (viewportWidth - cardWidth) / 2;

  return translateX;
}

// =======================
// SNAP KE INDEX (ANIMATED / INSTANT)
// =======================
function snapToIndex(animate = true) {
  const translateX = getTranslateForIndex(currentIndex);

  if (animate) {
    isTransitioning = true;
    carousel.style.transition = "transform 0.45s ease";
  } else {
    isTransitioning = false;
    carousel.style.transition = "none";
  }

  carousel.style.transform = `translateX(${translateX}px)`;
  updateActiveCards();
  updateIndicators();
}

// =======================
// INFINITE LOOP HANDLING
// =======================
carousel.addEventListener("transitionend", () => {
  if (!isTransitioning) return;
  isTransitioning = false;

  if (currentIndex >= totalOriginal) {
    currentIndex = currentIndex % totalOriginal;
    snapToIndex(false); // lompat tanpa animasi
  } else if (currentIndex < 0) {
    currentIndex =
      ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;
    snapToIndex(false);
  }
});

// =======================
// UPDATE SLIDE (NEXT/PREV)
// =======================
function updateCarousel(step) {
  if (isTransitioning) return;
  if (typeof step === "number") {
    currentIndex += step;
  }
  snapToIndex(true);
}

// =======================
// DRAG / SWIPE HANDLING
// =======================
carousel.addEventListener("pointerdown", (e) => {
  if (isTransitioning) return;

  isDragging = true;
  startX = e.clientX;

  // ambil posisi translateX terakhir
  const matrix = window.getComputedStyle(carousel).transform;
  if (matrix && matrix !== "none") {
    const values = matrix.match(/matrix.*\((.+)\)/);
    startTranslateX = values ? parseFloat(values[1].split(",")[4]) : 0;
  } else {
    startTranslateX = getTranslateForIndex(currentIndex);
  }

  carousel.style.transition = "none";
});

window.addEventListener("pointermove", (e) => {
  if (!isDragging) return;

  const delta = e.clientX - startX;
  const moveX = startTranslateX + delta;

  carousel.style.transform = `translateX(${moveX}px)`;
});

window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;

  const delta = e.clientX - startX;

  // threshold beda untuk desktop & mobile
  const threshold = window.innerWidth > 1024 ? 60 : 100;

  if (delta < -threshold) {
    // geser kiri → next card
    updateCarousel(1);
  } else if (delta > threshold) {
    // geser kanan → prev card
    updateCarousel(-1);
  } else {
    // kurang dari threshold → balik ke posisi semula
    snapToIndex(true);
  }
});

// =======================
// RESIZE → RECALC & CENTER
// =======================
window.addEventListener("resize", () => {
  cardWidth = getCardWidth();
  snapToIndex(false);
});

// =======================
// INIT
// =======================
snapToIndex(false);
updateIndicators();
updateActiveCards();






// MARQUEE EFFECT JAVASCRIPT SECTION
function pulseDot(dot) {
  let scale = 1;
  let growing = true;

  setInterval(() => {
    if (growing) {
      scale += 0.05;
      if (scale >= 1.35) growing = false;
    } else {
      scale -= 0.05;
      if (scale <= 1) growing = true;
    }
    dot.style.transform = `scale(${scale})`;
  }, 60);
}

// Ambil semua .marquee-dot
document.querySelectorAll(".marquee-dot").forEach(dot => {
  pulseDot(dot);
});
// END OF MARQUEE EFFECT JAVASCRIPT SECTION

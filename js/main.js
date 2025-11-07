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
// GRID SLIDE PROJECT
// =======================
const carousel = document.getElementById("carousel");
let cards = Array.from(document.querySelectorAll(".card"));
const totalOriginal = cards.length;
let cardWidth = cards[0].offsetWidth + 30;
let currentIndex = 0;

// Clone depan & belakang untuk looping halus
cards.forEach((card) => {
  const cloneFront = card.cloneNode(true);
  const cloneBack = card.cloneNode(true);
  carousel.appendChild(cloneFront);
  carousel.insertBefore(cloneBack, carousel.firstChild);
});
cards = Array.from(document.querySelectorAll(".card"));

// Indikator
const indicators = document.getElementById("indicators");
for (let i = 0; i < totalOriginal; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  indicators.appendChild(dot);
}
const dots = document.querySelectorAll(".dot");

function updateIndicators() {
  const activeIndex =
    ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
}

function updateActiveCards() {
  cards.forEach((card, index) => {
    card.classList.remove("active", "side");
    if (index === currentIndex + totalOriginal) card.classList.add("active");
    else if (
      index === currentIndex + totalOriginal - 1 ||
      index === currentIndex + totalOriginal + 1
    )
      card.classList.add("side");
  });
}

function centerCarousel() {
  const container = document.querySelector(".carousel-container");
  const centerOffset = (container.offsetWidth - cardWidth) / 2;
  const translateX =
    -currentIndex * cardWidth - totalOriginal * cardWidth + centerOffset;
  carousel.style.transform = `translateX(${translateX}px)`; 
}

function updateCarousel() {
  carousel.style.transition = "transform 0.5s ease";
  centerCarousel();
  updateActiveCards();
  updateIndicators();
}

// Jalankan pertama kali
updateCarousel();

// Drag support
let isDragging = false;
let startX = 0;

carousel.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
  carousel.style.transition = "none";
});

window.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const delta = e.clientX - startX;
  const container = document.querySelector(".carousel-container");
  const centerOffset = (container.offsetWidth - cardWidth) / 2;
  const translateX =
    -currentIndex * cardWidth - totalOriginal * cardWidth + centerOffset + delta;
  carousel.style.transform = `translateX(${translateX}px)`; // ✅ FIXED
});

window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  const delta = e.clientX - startX;
  if (delta < -100) currentIndex++;
  else if (delta > 100) currentIndex--;
  updateCarousel();
  isDragging = false;
});

window.addEventListener("resize", () => {
  cardWidth = cards[0].offsetWidth + 30;
  centerCarousel();
});

updateIndicators();
updateActiveCards();

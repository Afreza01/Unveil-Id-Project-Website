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
// GRID SLIDE PROJECT - INFINITE LOOP VERSION
// =======================
const carousel = document.getElementById("carousel");
let cards = Array.from(document.querySelectorAll(".card"));
const totalOriginal = cards.length;
let cardWidth = cards[0].offsetWidth + 30;
let currentIndex = 0;
let isTransitioning = false; // ✅ TAMBAH: flag untuk prevent multiple transitions

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

// ✅ TAMBAH: Function untuk handle infinite loop reset
function handleInfiniteLoop() {
  // Jika melewati batas kanan (clone depan)
  if (currentIndex >= totalOriginal) {
    setTimeout(() => {
      carousel.style.transition = "none"; // Matikan transition
      currentIndex = currentIndex % totalOriginal; // Reset ke posisi asli
      centerCarousel();
      updateActiveCards();
      
      // Nyalakan kembali transition setelah reset
      setTimeout(() => {
        carousel.style.transition = "transform 0.5s ease";
        isTransitioning = false;
      }, 50);
    }, 500); // Tunggu sampai transition selesai (0.5s)
  }
  // Jika melewati batas kiri (clone belakang)
  else if (currentIndex < 0) {
    setTimeout(() => {
      carousel.style.transition = "none";
      currentIndex = totalOriginal + (currentIndex % totalOriginal);
      centerCarousel();
      updateActiveCards();
      
      setTimeout(() => {
        carousel.style.transition = "transform 0.5s ease";
        isTransitioning = false;
      }, 50);
    }, 500);
  } else {
    isTransitioning = false;
  }
}

function updateCarousel() {
  if (isTransitioning) return; // ✅ Prevent multiple transitions
  isTransitioning = true;
  
  carousel.style.transition = "transform 0.5s ease";
  centerCarousel();
  updateActiveCards();
  updateIndicators();
  
  handleInfiniteLoop(); // ✅ TAMBAH: Handle infinite loop
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
  carousel.style.transform = `translateX(${translateX}px)`;
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

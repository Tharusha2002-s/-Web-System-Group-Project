const navToggle = document.querySelector(".mobile-nav-toggle");
const navContainer = document.querySelector(".nav-container");

navToggle.addEventListener("click", () => {
 // Check the data-visible attribute
 const isVisible = navContainer.getAttribute("data-visible") === "true";

  if (isVisible) {
    // If visible, hide it
    navContainer.setAttribute("data-visible", "false");
    navToggle.setAttribute("aria-expanded", "false");
  }
  else {
    // If hidden, show it
    navContainer.setAttribute("data-visible", "true");
    navToggle.setAttribute("aria-expanded", "true");
  }
});
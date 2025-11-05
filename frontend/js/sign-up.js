// Hamburger menu toggle
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// Form submission handler
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    interest: document.getElementById("interest").value,
    source: document.querySelector('input[name="source"]:checked')?.value,
    message: document.getElementById("message").value,
    terms: document.getElementById("terms").checked,
  };

  console.log("Form submitted:", formData);
  alert("Thank you for signing up! Your account has been created.");
  this.reset();
});

// Newsletter form handler
document
  .querySelector(".newsletter-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for subscribing!");
    this.reset();
  });

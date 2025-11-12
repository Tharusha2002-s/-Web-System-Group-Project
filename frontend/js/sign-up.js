<<<<<<< HEAD
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

=======
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
>>>>>>> 36b26308e2b7cac98d50cada15def16f2ef79ce2
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
<<<<<<< HEAD

=======
>>>>>>> 36b26308e2b7cac98d50cada15def16f2ef79ce2
  console.log("Form submitted:", formData);
  alert("Thank you for signing up! Your account has been created.");
  this.reset();
});
<<<<<<< HEAD

document
  .querySelector(".newsletter-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for subscribing!");
    this.reset();
  });
=======
>>>>>>> 36b26308e2b7cac98d50cada15def16f2ef79ce2

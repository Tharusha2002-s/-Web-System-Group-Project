document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    topic: document.getElementById("topic").value,
    role: document.querySelector('input[name="role"]:checked')?.value,
    message: document.getElementById("message").value,
    terms: document.getElementById("terms").checked,
  };
  console.log("Form submitted:", formData);
  alert("Login successful! Welcome back.");
  this.reset();
});

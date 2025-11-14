// Mobile menu toggle
const navLinks = document.querySelector(".nav-links");

// Form validation
const registerForm = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  interest: "",
  terms: false,
};

// Handle form input changes
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      if (e.target.type === "checkbox") {
        registerForm[e.target.name] = e.target.checked;
      } else {
        registerForm[e.target.name] = e.target.value;
      }
    });
  });

  // Register button click
  document
    .querySelector(".register-btn")
    .addEventListener("click", handleRegister);

  // Social login buttons
  document
    .querySelector(".social-btn.google")
    .addEventListener("click", () => handleSocialLogin("Google"));
  document
    .querySelectorAll(".social-btn:not(.google)")[0]
    .addEventListener("click", () => handleSocialLogin("Facebook"));

  // Sign in button
  document.querySelector(".signin-btn").addEventListener("click", handleSignIn);

  // Newsletter subscription
  document
    .querySelector(".newsletter-form button")
    .addEventListener("click", handleNewsletterSubscribe);

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// Form validation function
function validateForm() {
  const errors = [];

  if (!registerForm.firstname || registerForm.firstname.trim() === "") {
    errors.push("First name is required");
  }

  if (!registerForm.lastname || registerForm.lastname.trim() === "") {
    errors.push("Last name is required");
  }

  if (!registerForm.email || !isValidEmail(registerForm.email)) {
    errors.push("Valid email is required");
  }

  if (!registerForm.phone || registerForm.phone.trim() === "") {
    errors.push("Phone number is required");
  }

  if (!registerForm.interest || registerForm.interest === "Choose option") {
    errors.push("Please select your interest");
  }

  if (!registerForm.terms) {
    errors.push("You must agree to terms and conditions");
  }

  return errors;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

// Handle registration
function handleRegister(e) {
  e.preventDefault();

  const errors = validateForm();

  if (errors.length > 0) {
    showNotification(errors.join("\n"), "error");
    return;
  }

  // Simulate API call
  showNotification("Processing registration...", "info");

  setTimeout(() => {
    showNotification("Registration successful! Welcome aboard!", "success");
    resetForm();
  }, 1500);
}

// Handle social login
function handleSocialLogin(provider) {
  showNotification(`Connecting with ${provider}...`, "info");

  setTimeout(() => {
    showNotification(`${provider} authentication successful!`, "success");
  }, 1000);
}

// Handle sign in
function handleSignIn(e) {
  e.preventDefault();
  showNotification("Redirecting to sign in page...", "info");
}

// Handle newsletter subscription
function handleNewsletterSubscribe(e) {
  e.preventDefault();
  const emailInput = document.querySelector(".newsletter-form input");
  const email = emailInput.value;

  if (!email || !isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  showNotification("Thank you for subscribing!", "success");
  emailInput.value = "";
}

// Reset form
function resetForm() {
  document
    .querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"]'
    )
    .forEach((input) => {
      input.value = "";
    });
  document.querySelector("select").selectedIndex = 0;
  document.querySelector('input[type="checkbox"]').checked = false;

  for (let key in registerForm) {
    registerForm[key] = key === "terms" ? false : "";
  }
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add("show"), 10);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add input focus effects
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });
});

// Form field real-time validation
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  emailInput.addEventListener("blur", function () {
    if (this.value && !isValidEmail(this.value)) {
      this.style.borderColor = "#ff4444";
    } else {
      this.style.borderColor = "#ddd";
    }
  });

  phoneInput.addEventListener("blur", function () {
    if (this.value && !isValidPhone(this.value)) {
      this.style.borderColor = "#ff4444";
    } else {
      this.style.borderColor = "#ddd";
    }
  });
});

/* FAQ Questions and Answers Section */

const faqs = [
  {
    category: "booking",
    question: "How do I book a vehicle?",
    answer:
      "You can book a vehicle through our website. Simply select your pickup location, dates, choose your vehicle, and complete the reservation with your payment information.",
  },
  {
    category: "booking",
    question: "Can I modify or cancel my reservation?",
    answer:
      "Yes, you can modify or cancel your reservation up to 24 hours before your pickup time without any charges. Cancellations within 24 hours may incur a fee depending on your booking type.",
  },
  {
    category: "booking",
    question: "How early should I book my rental?",
    answer:
      "We recommend booking at least 2-3 days in advance, especially during peak seasons and holidays. However, last-minute bookings are also available subject to vehicle availability.",
  },
  {
    category: "pricing",
    question: "What is included in the rental price?",
    answer:
      "The base rental price includes the vehicle, unlimited mileage, basic insurance, and 24/7 roadside assistance. Additional options like GPS, child seats, and additional drivers can be added for extra fees.",
  },
  {
    category: "pricing",
    question: "Are there any hidden fees?",
    answer:
      "We believe in transparent pricing. All fees are clearly listed during booking. Additional charges may apply for fuel, late returns, additional drivers, toll charges, or if you decline to refuel the vehicle.",
  },
  {
    category: "pricing",
    question: "Do you offer long-term rental discounts?",
    answer:
      "Yes! We offer attractive discounts for rentals longer than 7 days. The longer you rent, the more you save. Contact us for special rates on monthly rentals.",
  },
  {
    category: "requirements",
    question: "What do I need to rent a vehicle?",
    answer:
      "You need a valid driver's license (held for at least 1 year), a credit or debit card in your name, proof of identity (passport or national ID), and you must be at least 21 years old.",
  },
  {
    category: "requirements",
    question: "What is the minimum age to rent?",
    answer:
      "The minimum age is 21 years. Drivers under 25 may be subject to a young driver surcharge. Some luxury or specialized vehicles may require the driver to be 25 or older.",
  },
  {
    category: "requirements",
    question: "Can I rent with a foreign driver's license?",
    answer:
      "Yes, foreign licenses are accepted. If your license is not in English, you must also present an International Driving Permit (IDP) along with your original license.",
  },
  {
    category: "insurance",
    question: "What insurance options are available?",
    answer:
      "We offer several insurance options including Collision Damage Waiver (CDW), Theft Protection (TP), Personal Accident Insurance (PAI), and Supplemental Liability Insurance (SLI). Basic coverage is included in all rentals.",
  },
  {
    category: "insurance",
    question: "Is my personal car insurance valid for rentals?",
    answer:
      "This depends on your insurance policy. We recommend checking with your insurance provider before declining our coverage options. Many personal policies do not cover rental vehicles or have limited coverage.",
  },
  {
    category: "policies",
    question: "What is your fuel policy?",
    answer:
      'We operate on a "Full to Full" policy. You receive the vehicle with a full tank and should return it full. If not returned full, refueling charges will apply at a higher rate than local gas stations.',
  },
  {
    category: "policies",
    question: "Can I drive the vehicle across state lines or borders?",
    answer:
      "Domestic travel is generally permitted. For cross-border travel, you must inform us in advance and obtain proper authorization. Additional insurance may be required and some restrictions apply.",
  },
  {
    category: "policies",
    question: "What happens if I return the vehicle late?",
    answer:
      "A grace period of 30 minutes is provided. Beyond that, you will be charged for an additional day. If you know you'll be late, please contact us to extend your reservation and avoid extra charges.",
  },
  {
    category: "policies",
    question: "What should I do in case of an accident?",
    answer:
      "First, ensure everyone's safety and call emergency services if needed. Then contact our 24/7 hotline immediately. Do not leave the scene and collect information from all parties involved. We will guide you through the process.",
  },
];

/* FAQ Questions and Answers Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Document Object Modals (DOM) Section */

const faqContainer = document.getElementById("faqContainer");
const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".category-btn");
const noResults = document.getElementById("noResults");

/* Document Object Modals (DOM) Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Global Variables Section */

let currentCategory = "all";
let verificationData = { email: "", code: "", verified: false, isAdmin: false };

/* Global Variables Section */

/* ----------------------------------------------------------------------------------------- */

/* FAQ Function Rendering Section */

function renderFAQs(faqsToRender) {
  faqContainer.innerHTML = "";
  if (faqsToRender.length === 0) {
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";
  faqsToRender.forEach((faq, index) => {
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";
    faqItem.innerHTML = `<div class="faq-question"><span>${faq.question}</span><span class="icon">+</span></div><div class="faq-answer">${faq.answer}</div>`;
    faqItem.querySelector(".faq-question").addEventListener("click", () => {
      faqItem.classList.toggle("active");
    });
    faqContainer.appendChild(faqItem);
  });
}

/* FAQ Function Rendering Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* FAQ Function Filtering Section */

function filterFAQs() {
  let filtered = faqs;
  if (currentCategory !== "all") {
    filtered = filtered.filter((faq) => faq.category === currentCategory);
  }
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm)
    );
  }
  renderFAQs(filtered);
}

/* FAQ Function Filtering Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Category Button Event Listeners Section */

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    filterFAQs();
  });
});

/* Category Button Event Listeners Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Search Input Event Listener Section */ 

searchInput.addEventListener("input", filterFAQs);

/* Search Input Event Listener Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Modal Functions Section */

function openModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    forgot: "forgotModal",
    verifyCode: "verifyCodeModal",
    resetPassword: "resetPasswordModal",
    success: "successModal",
  };
  if (modals[type])
    document.getElementById(modals[type]).classList.add("active");
}
function closeModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    forgot: "forgotModal",
    verifyCode: "verifyCodeModal",
    resetPassword: "resetPasswordModal",
    success: "successModal",
  };
  if (modals[type])
    document.getElementById(modals[type]).classList.remove("active");
}
function switchModal(type) {
  closeModal("signin");
  closeModal("signup");
  closeModal("forgot");
  closeModal("verifyCode");
  closeModal("resetPassword");
  closeModal("success");
  openModal(type);
}

/* Modal Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Authentication Functions Section */

function handleSignIn() {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  const userName = email.split("@")[0];
  showUserProfile(userName);
  closeModal("signin");
  document.getElementById("signinEmail").value = "";
  document.getElementById("signinPassword").value = "";
}
function handleSignUp() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  const userName = email.split("@")[0];
  showUserProfile(userName);
  closeModal("signup");
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
}

/* Authentication Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Password Reset Functions Section */

function sendVerificationCode() {
  const email = document.getElementById("forgotEmail").value;
  if (!email) {
    alert("Please enter your email address");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.email = email;
  verificationData.code = code;
  verificationData.verified = false;
  alert(
    `Verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );
  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgot");
  openModal("verifyCode");
}
function resendCode() {
  if (!verificationData.email) {
    alert("No email found. Please start over.");
    switchModal("forgot");
    return;
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.code = code;
  alert(
    `New verification code sent to ${verificationData.email}\n\nFor demo purposes, your code is: ${code}`
  );
}
function verifyCode() {
  const enteredCode = document.getElementById("verificationCode").value;
  if (!enteredCode) {
    alert("Please enter the verification code");
    return;
  }
  if (enteredCode !== verificationData.code) {
    alert("Invalid verification code. Please try again.");
    return;
  }
  verificationData.verified = true;
  document.getElementById("verificationCode").value = "";
  closeModal("verifyCode");
  openModal("resetPassword");
}
function resetPassword() {
  if (!verificationData.verified) {
    alert("Please verify your email first");
    switchModal("forgot");
    return;
  }
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (!newPassword || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    alert(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }
  document.getElementById("forgotEmail").value = "";
  document.getElementById("verificationCode").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
  closeModal("resetPassword");
  openModal("success");
}
function handleSuccessComplete() {
  closeModal("success");
  verificationData = { email: "", code: "", verified: false, isAdmin: false };
  openModal("signin");
}

/* Password Reset Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* User Profile Functions Section */

function showUserProfile(name) {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userProfile").classList.add("active");
  document.getElementById("userName").textContent = name;
  document.getElementById("userInitial").textContent = name
    .charAt(0)
    .toUpperCase();
}
function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show");
}
function logout() {
  document.getElementById("authButtons").style.display = "flex";
  document.getElementById("userProfile").classList.remove("active");
  document.getElementById("profileDropdown").classList.remove("show");
  alert("Logged out successfully");
}

/* User Profile Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Navigation Functions Section */

function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("mobile-active");
}

/* Navigation Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Footer Functions Section */

function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  event.target.reset();
}

/* Footer Functions Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Event Listeners Section */

document.addEventListener("DOMContentLoaded", () => {
  const userProfile = document.getElementById("userProfile");
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        toggleDropdown();
      }
    });
  }
});
document.addEventListener("click", (e) => {
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown && !e.target.closest(".user-profile")) {
    profileDropdown.classList.remove("show");
  }
});
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});

/* Event Listeners Section Ends */

/* ----------------------------------------------------------------------------------------- */

/* Initialize FAQ Query Section */

renderFAQs(faqs);

/* Initialize FAQ Query Section Ends */

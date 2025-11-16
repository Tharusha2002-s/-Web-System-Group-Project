// ======================================== MODAL FUNCTIONS ========================================
function openModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    success: "successModal",
  };
  if (modals[type])
    document.getElementById(modals[type]).classList.add("active");
}
function closeModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    success: "successModal",
  };
  if (modals[type])
    document.getElementById(modals[type]).classList.remove("active");
}
function switchModal(type) {
  closeModal("signin");
  closeModal("signup");
  closeModal("success");
  openModal(type);
}

// ======================================== AUTHENTICATION FUNCTIONS ========================================
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
}

// ======================================== USER PROFILE FUNCTIONS ========================================
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

// ======================================== NAVIGATION FUNCTIONS ========================================
function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("mobile-active");
}

// ======================================== FOOTER FUNCTIONS ========================================
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  event.target.reset();
}

// ======================================== EVENT LISTENERS ========================================
document.addEventListener("click", (e) => {
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown && !e.target.closest(".user-profile"))
    profileDropdown.classList.remove("show");
});
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});
document.getElementById("userProfile").addEventListener("click", (e) => {
  if (!e.target.closest(".profile-dropdown")) toggleDropdown();
});

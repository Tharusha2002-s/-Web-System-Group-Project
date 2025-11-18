/* Global Variables Section */

// Store verification data for password reset flow
let verificationData = {
  email: "",
  code: "",
  verified: false,
  isAdmin: false,
};

// Check if on admin page and open admin modal
window.addEventListener("load", () => {
  if (window.location.pathname.includes("/admin/")) {
    openModal("admin");
  }
});

/* Content Loaded Event Section */

document.addEventListener("DOMContentLoaded", () => {
  // Add hover animation to all buttons
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (!btn.style.transform || btn.style.transform === "scale(1)") {
        btn.style.transform = "scale(1.05)";
      }
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });

  // Add click listener for user profile dropdown
  const userProfile = document.getElementById("userProfile");
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        toggleDropdown();
      }
    });
  }
});

/* Modal Function Section */

/**
 * Open a specific modal by type
 * @param {string} type - Modal type identifier
 */
function openModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    admin: "adminModal",
    forgot: "forgotModal",
    forgotAdmin: "forgotAdminModal",
    verifyCode: "verifyCodeModal",
    resetPassword: "resetPasswordModal",
    success: "successModal",
  };
  if (modals[type]) {
    document.getElementById(modals[type]).classList.add("active");
  }
}

/**
 * Close a specific modal by type
 * @param {string} type - Modal type identifier
 */
function closeModal(type) {
  const modals = {
    signin: "signinModal",
    signup: "signupModal",
    admin: "adminModal",
    forgot: "forgotModal",
    forgotAdmin: "forgotAdminModal",
    verifyCode: "verifyCodeModal",
    resetPassword: "resetPasswordModal",
    success: "successModal",
  };
  if (modals[type]) {
    document.getElementById(modals[type]).classList.remove("active");
  }
}

/**
 * @param {string} type - Modal type to open
 */
function switchModal(type) {
  closeModal("signin");
  closeModal("signup");
  closeModal("admin");
  closeModal("forgot");
  closeModal("forgotAdmin");
  closeModal("verifyCode");
  closeModal("resetPassword");
  closeModal("success");
  openModal(type);
}

/* Authentication Functions Section */

/**
 * Handle user sign in
 * Validates input and shows user profile
 */
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

  // Clear form fields
  document.getElementById("signinEmail").value = "";
  document.getElementById("signinPassword").value = "";
}

/**
 * Handle user sign up
 * Validates input and shows user profile
 */
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

  // Clear form fields
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
}

/**
 * Handle admin login
 * Validates admin credentials and shows profile
 */
function handleAdminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  showUserProfile(username, true);
  closeModal("admin");

  // Clear form fields
  document.getElementById("adminUsername").value = "";
  document.getElementById("adminPassword").value = "";
}

/* Password Reset Functions Section */

/**
 * Send verification code to user email
 * Generates random 6-digit code
 */
function sendVerificationCode() {
  const email = document.getElementById("forgotEmail").value;

  if (!email) {
    alert("Please enter your email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.email = email;
  verificationData.code = code;
  verificationData.verified = false;
  verificationData.isAdmin = false;

  console.log("Verification code sent to", email, "- Code:", code);
  alert(
    `Verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgot");
  openModal("verifyCode");
}

/**
 * Send verification code to admin email
 * Generates random 6-digit code for admin
 */
function sendAdminVerificationCode() {
  const email = document.getElementById("forgotAdminEmail").value;

  if (!email) {
    alert("Please enter your admin email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.email = email;
  verificationData.code = code;
  verificationData.verified = false;
  verificationData.isAdmin = true;

  console.log("Admin verification code sent to", email, "- Code:", code);
  alert(
    `Admin verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgotAdmin");
  openModal("verifyCode");
}

/**
 * Resend verification code
 * Generates new code for existing email
 */
function resendCode() {
  if (!verificationData.email) {
    alert("No email found. Please start over.");
    switchModal(verificationData.isAdmin ? "forgotAdmin" : "forgot");
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.code = code;

  console.log(
    "New verification code sent to",
    verificationData.email,
    "- Code:",
    code
  );
  alert(
    `New verification code sent to ${verificationData.email}\n\nFor demo purposes, your code is: ${code}`
  );
}

/**
 * Verify the entered code
 * Compares user input with generated code
 */
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

/**
 * Reset user password
 * Validates new password and confirms match
 */
function resetPassword() {
  if (!verificationData.verified) {
    alert("Please verify your email first");
    switchModal(verificationData.isAdmin ? "forgotAdmin" : "forgot");
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

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    alert(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }

  console.log("Password reset successful for", verificationData.email);

  // Clear all form fields
  document.getElementById("forgotEmail").value = "";
  document.getElementById("forgotAdminEmail").value = "";
  document.getElementById("verificationCode").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  closeModal("resetPassword");
  openModal("success");
}

/**
 * Handle completion of password reset success
 * Redirects to appropriate login modal
 */
function handleSuccessComplete() {
  closeModal("success");
  const wasAdmin = verificationData.isAdmin;

  // Reset verification data
  verificationData = {
    email: "",
    code: "",
    verified: false,
    isAdmin: false,
  };

  // Open appropriate login modal
  if (wasAdmin) {
    openModal("admin");
  } else {
    openModal("signin");
  }
}

/* User Profile Function Section */

/**
 * Display user profile in navigation
 * @param {string} name - User's name
 * @param {boolean} isAdmin - Whether user is admin
 */
function showUserProfile(name, isAdmin = false) {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userProfile").classList.add("active");
  document.getElementById("userName").textContent = name;
  document.getElementById("userInitial").textContent = name
    .charAt(0)
    .toUpperCase();
}

/**
 * Toggle user profile dropdown menu
 */
function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

/**
 * Log out current user
 * Resets UI to show auth buttons
 */
function logout() {
  document.getElementById("authButtons").style.display = "flex";
  document.getElementById("userProfile").classList.remove("active");
  document.getElementById("profileDropdown").classList.remove("show");
  alert("Logged out successfully");
}

/* Mobile Menu Functions Section */

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("mobile-active");
}

/* Newsletter Function Section */

/**
 * Handle newsletter subscription
 * @param {Event} event - Form submission event
 */
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  event.target.reset();
}

/* Event Listeners Section */

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown && !e.target.closest(".user-profile")) {
    profileDropdown.classList.remove("show");
  }
});

// Close modal when clicking outside of it
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});

// Handle Enter key press in modals
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (document.getElementById("signinModal").classList.contains("active")) {
      handleSignIn();
    } else if (
      document.getElementById("signupModal").classList.contains("active")
    ) {
      handleSignUp();
    } else if (
      document.getElementById("adminModal").classList.contains("active")
    ) {
      handleAdminLogin();
    } else if (
      document.getElementById("forgotModal").classList.contains("active")
    ) {
      sendVerificationCode();
    } else if (
      document.getElementById("forgotAdminModal").classList.contains("active")
    ) {
      sendAdminVerificationCode();
    } else if (
      document.getElementById("verifyCodeModal").classList.contains("active")
    ) {
      verifyCode();
    } else if (
      document.getElementById("resetPasswordModal").classList.contains("active")
    ) {
      resetPassword();
    }
  }
});

/* Global data */
let verificationData = {
  email: "",
  code: "",
  verified: false,
  isAdmin: false,
};

window.addEventListener("load", () => {
  if (window.location.pathname.includes("/admin/")) {
    openModal("admin");
  }
});

document.addEventListener("DOMContentLoaded", () => {
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
});

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

function handleSignIn() {
  const email = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  const userName = email.split("@")[0];
  alert("Sign in successful for: " + userName);
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
  alert("Sign up successful for: " + userName);
  closeModal("signup");

  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
}

function handleAdminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  alert("Admin login successful for: " + username);
  closeModal("admin");

  document.getElementById("adminUsername").value = "";
  document.getElementById("adminPassword").value = "";
}

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
  verificationData.isAdmin = false;

  console.log("Verification code sent to", email, "- Code:", code);
  alert(
    `Verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgot");
  openModal("verifyCode");
}

function sendAdminVerificationCode() {
  const email = document.getElementById("forgotAdminEmail").value;

  if (!email) {
    alert("Please enter your admin email address");
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
  verificationData.isAdmin = true;

  console.log("Admin verification code sent to", email, "- Code:", code);
  alert(
    `Admin verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgotAdmin");
  openModal("verifyCode");
}

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

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    alert(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }

  console.log("Password reset successful for", verificationData.email);

  document.getElementById("forgotEmail").value = "";
  document.getElementById("forgotAdminEmail").value = "";
  document.getElementById("verificationCode").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  closeModal("resetPassword");
  openModal("success");
}

function handleSuccessComplete() {
  closeModal("success");
  const wasAdmin = verificationData.isAdmin;

  verificationData = {
    email: "",
    code: "",
    verified: false,
    isAdmin: false,
  };

  if (wasAdmin) {
    openModal("admin");
  } else {
    openModal("signin");
  }
}

function showUserProfile(name, isAdmin = false) {
  const userProfile = document.getElementById("userProfile");
  if (userProfile) {
    document.getElementById("authButtons").style.display = "none";
    userProfile.classList.add("active");
    document.getElementById("userName").textContent = name;
    document.getElementById("userInitial").textContent = name
      .charAt(0)
      .toUpperCase();
  }
}

function toggleDropdown() {
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown) {
    profileDropdown.classList.toggle("show");
  }
}

function logout() {
  const authButtons = document.getElementById("authButtons");
  const userProfile = document.getElementById("userProfile");
  const profileDropdown = document.getElementById("profileDropdown");

  if (authButtons) authButtons.style.display = "flex";
  if (userProfile) userProfile.classList.remove("active");
  if (profileDropdown) profileDropdown.classList.remove("show");

  alert("Logged out successfully");
}

document.addEventListener("click", (e) => {
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown && !e.target.closest(".user-profile")) {
    profileDropdown.classList.remove("show");
  }
});

function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("mobile-active");
  }
}

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});

function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  event.target.reset();
}

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

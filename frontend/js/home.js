/* Global Variables Section */

// Store verification data for password reset flow
let verificationData = {
  email: "",
  code: "",
  verified: false,
  isAdmin: false,
};

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Modal type to ID mapping (defined once)
const MODAL_TYPES = {
  signin: "signinModal",
  signup: "signupModal",
  admin: "adminModal",
  forgot: "forgotModal",
  forgotAdmin: "forgotAdminModal",
  verifyCode: "verifyCodeModal",
  resetPassword: "resetPasswordModal",
  success: "successModal",
};

// Cache DOM elements to avoid repeated lookups
let cachedElements = {};

function getCachedElement(id) {
  if (!cachedElements[id]) {
    cachedElements[id] = document.getElementById(id);
  }
  return cachedElements[id];
}

/* Global Variables Section Ends */

/* ----------------------------------------------------------------------- */

/* Page Load Event Section */

window.addEventListener("load", () => {
  console.log('🚀 Page loaded, checking authentication...');
  
  // Check authentication status
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  
  if (userRole && userName) {
    console.log(`✅ User is authenticated: ${userName} (${userRole})`);
    showUserProfile(userName, userRole === 'admin');
  } else {
    console.log('ℹ️ No user authentication found');
    // Ensure logout buttons are hidden
    hideLogoutButtons();
  }
  
  // Test server connection
  testServerConnection();
});

/* Page Load Event Section Ends */

/* ----------------------------------------------------------------------- */

/* Server Connection Test */

async function testServerConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Server connection test:', data);
    return true;
  } catch (error) {
    console.error('❌ Server connection failed:', error);
    console.log('💡 Please make sure the backend server is running on port 5000');
    return false;
  }
}

/* ----------------------------------------------------------------------- */

/* Tab Switching Function */

function switchTab(tab) {
  console.log('🔄 Switching to tab:', tab);
  
  // Update tab buttons
  const tabs = document.querySelectorAll('.modal-tab');
  tabs.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Activate the clicked tab
  if (tab === 'user') {
    document.getElementById('userTab').classList.add('active');
  } else {
    document.getElementById('adminTab').classList.add('active');
  }
  
  // Update tab content
  document.getElementById('user-tab').classList.remove('active');
  document.getElementById('admin-tab').classList.remove('active');
  document.getElementById(`${tab}-tab`).classList.add('active');
}

/* Tab Switching Function Ends */

/* ----------------------------------------------------------------------- */

/* Modal Function Section */

function openModal(type) {
  console.log('📦 Opening modal:', type);
  const modalId = MODAL_TYPES[type];
  if (modalId) {
    getCachedElement(modalId)?.classList.add("active");
  }
}

function closeModal(type) {
  console.log('📦 Closing modal:', type);
  const modalId = MODAL_TYPES[type];
  if (modalId) {
    getCachedElement(modalId)?.classList.remove("active");
  }
}

function switchModal(type) {
  console.log('🔄 Switching modal to:', type);
  // Close all modals using the defined types
  Object.keys(MODAL_TYPES).forEach(modalType => closeModal(modalType));
  openModal(type);
}

/* Modal Function Section Ends */

/* ----------------------------------------------------------------------- */

/* Authentication Functions Section */

async function handleUserSignIn() {
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value;

  if (!email || !password) {
    alert("❌ Please fill in all fields");
    return;
  }

  console.log('🔐 Attempting user sign in:', email);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('📥 Login response:', data);

    if (response.ok && data.success) {
      console.log('✅ User signed in successfully:', data.user);
      
      // Store user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.firstName + ' ' + data.user.lastName);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', 'user');
      
      // Update UI
      showUserProfile(data.user.firstName + ' ' + data.user.lastName, false);
      closeModal("signin");
      
      // Clear form fields
      document.getElementById("signinEmail").value = "";
      document.getElementById("signinPassword").value = "";
      
      // Show success and redirect
      alert('✅ Login successful! Welcome ' + data.user.firstName);
      window.location.href = "../pages/Home.html";
    } else {
      console.error('❌ Login failed:', data.message);
      alert(data.message || "❌ Sign in failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("❌ Sign in error:", error);
    alert("❌ Cannot connect to server. Please make sure the backend is running on port 5000.");
  }
}

async function handleAdminSignIn() {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (!email || !password) {
    alert("❌ Please fill in all fields");
    return;
  }

  console.log('🔐 Attempting admin sign in:', email);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('📥 Admin login response:', data);

    if (response.ok && data.success) {
      console.log('✅ Admin signed in successfully:', data.user);
      
      // Store admin info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isAdmin', 'true');
      
      // Update UI
      showUserProfile(data.user.name, true);
      closeModal("signin");
      
      // Clear form fields
      document.getElementById("adminEmail").value = "";
      document.getElementById("adminPassword").value = "";
      
      // Show success and redirect to admin dashboard
      alert('✅ Admin login successful! Redirecting to dashboard...');
      window.location.href = "admin/Dashboard.html";
    } else {
      console.error('❌ Admin login failed:', data.message);
      alert(data.message || "❌ Admin sign in failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("❌ Admin sign in error:", error);
    alert("❌ Cannot connect to server. Please make sure the backend is running on port 5000.");
  }
}

async function handleSignUp() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const fullName = document.getElementById("signupName").value.trim();

  if (!email || !password || !fullName) {
    alert("❌ Please fill in all fields");
    return;
  }

  // Split full name into first and last name
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  console.log('👤 Attempting user sign up:', email);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        firstName,
        lastName,
        email, 
        password,
        phone: '0000000000', // Default phone number
        dateOfBirth: '1990-01-01' // Default date of birth
      }),
    });

    const data = await response.json();
    console.log('📥 Registration response:', data);

    if (response.ok && data.success) {
      console.log('✅ User signed up successfully:', data.user);
      
      // Store user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.firstName + ' ' + data.user.lastName);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', 'user');
      
      // Update UI
      showUserProfile(data.user.firstName + ' ' + data.user.lastName, false);
      closeModal("signup");
      
      // Clear form fields
      document.getElementById("signupEmail").value = "";
      document.getElementById("signupPassword").value = "";
      document.getElementById("signupName").value = "";
      
      // Show success and redirect
      alert('✅ Registration successful! Welcome ' + data.user.firstName);
      window.location.href = "../pages/Home.html";
    } else {
      console.error('❌ Registration failed:', data.message);
      alert(data.message || "❌ Sign up failed. Please try again.");
    }
  } catch (error) {
    console.error("❌ Sign up error:", error);
    alert("❌ Cannot connect to server. Please make sure the backend is running on port 5000.");
  }
}

/* Authentication Functions Section Ends */

/* ----------------------------------------------------------------------- */

/* Logout Functions Section */

/**
 * Show logout confirmation modal
 */
function confirmLogout() {
    console.log('🔄 Showing logout confirmation');
    document.getElementById('logoutConfirmationModal').classList.add('active');
}

/**
 * Close logout confirmation modal
 */
function closeConfirmationModal() {
    console.log('📦 Closing confirmation modal');
    document.getElementById('logoutConfirmationModal').classList.remove('active');
}

/**
 * Perform the actual logout
 */
function performLogout() {
    console.log('🚪 Performing logout');
    
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    
    // Update UI
    hideLogoutButtons();
    
    // Close confirmation modal
    closeConfirmationModal();
    
    // Show success message
    alert("✅ Logged out successfully");
    
    // Refresh the page to reset state
    window.location.reload();
}

/**
 * Hide all logout buttons and show auth buttons
 */
function hideLogoutButtons() {
    document.getElementById("authButtons").style.display = "flex";
    document.getElementById("userProfile").classList.remove("active");
    document.getElementById("profileDropdown").classList.remove("show");
    const desktopBtn = document.getElementById("desktopLogoutBtn");
    const mobileContainer = document.getElementById("mobileLogoutContainer");
    if (desktopBtn) desktopBtn.style.display = "none";
    if (mobileContainer) mobileContainer.style.display = "none";
}

/**
 * View user profile
 */
function viewProfile() {
    alert('📋 Profile page would open here');
    // You can redirect to profile page: window.location.href = "../pages/profile.html";
}

/**
 * View settings
 */
function viewSettings() {
    alert('⚙️ Settings page would open here');
    // You can redirect to settings page: window.location.href = "../pages/settings.html";
}

/* Logout Functions Section Ends */

/* ----------------------------------------------------------------------- */

/* User Profile Function Section */

/**
 * Display user profile in navigation
 * @param {string} name - User's name
 * @param {boolean} isAdmin - Whether user is admin
 */
function showUserProfile(name, isAdmin = false) {
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("userProfile").classList.add("active");
    
    const userNameEl = document.getElementById("userName");
    const userInitialEl = document.getElementById("userInitial");
    
    if (userNameEl) userNameEl.textContent = name;
    if (userInitialEl) userInitialEl.textContent = name.charAt(0).toUpperCase();
    
    // Show logout buttons
    const desktopBtn = document.getElementById("desktopLogoutBtn");
    const mobileContainer = document.getElementById("mobileLogoutContainer");
    if (desktopBtn) desktopBtn.style.display = "block";
    if (mobileContainer) mobileContainer.style.display = "block";
    
    console.log('👤 User profile shown:', name, isAdmin ? '(Admin)' : '(User)');
}

/**
 * Toggle user profile dropdown menu
 */
function toggleDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

/**
 * Log out current user (legacy function - now uses confirmation)
 */
function logout() {
    confirmLogout(); // Now shows confirmation instead of immediate logout
}

/* User Profile Function Section Ends */

/* ----------------------------------------------------------------------- */

/* Password Reset Functions Section */

function sendVerificationCode() {
  const email = document.getElementById("forgotEmail").value;

  if (!email) {
    alert("❌ Please enter your email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("❌ Please enter a valid email address");
    return;
  }

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.email = email;
  verificationData.code = code;
  verificationData.verified = false;
  verificationData.isAdmin = false;

  console.log("📧 Verification code sent to", email, "- Code:", code);
  alert(
    `📧 Verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgot");
  openModal("verifyCode");
}

function sendAdminVerificationCode() {
  const email = document.getElementById("forgotAdminEmail").value;

  if (!email) {
    alert("❌ Please enter your admin email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("❌ Please enter a valid email address");
    return;
  }

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.email = email;
  verificationData.code = code;
  verificationData.verified = false;
  verificationData.isAdmin = true;

  console.log("📧 Admin verification code sent to", email, "- Code:", code);
  alert(
    `📧 Admin verification code sent to ${email}\n\nFor demo purposes, your code is: ${code}`
  );

  document.getElementById("sentToEmail").textContent = email;
  closeModal("forgotAdmin");
  openModal("verifyCode");
}

function resendCode() {
  if (!verificationData.email) {
    alert("❌ No email found. Please start over.");
    switchModal(verificationData.isAdmin ? "forgotAdmin" : "forgot");
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationData.code = code;

  console.log(
    "📧 New verification code sent to",
    verificationData.email,
    "- Code:",
    code
  );
  alert(
    `📧 New verification code sent to ${verificationData.email}\n\nFor demo purposes, your code is: ${code}`
  );
}

function verifyCode() {
  const enteredCode = document.getElementById("verificationCode").value;

  if (!enteredCode) {
    alert("❌ Please enter the verification code");
    return;
  }

  if (enteredCode !== verificationData.code) {
    alert("❌ Invalid verification code. Please try again.");
    return;
  }

  verificationData.verified = true;
  document.getElementById("verificationCode").value = "";
  closeModal("verifyCode");
  openModal("resetPassword");
}

function resetPassword() {
  if (!verificationData.verified) {
    alert("❌ Please verify your email first");
    switchModal(verificationData.isAdmin ? "forgotAdmin" : "forgot");
    return;
  }

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!newPassword || !confirmPassword) {
    alert("❌ Please fill in all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("❌ Passwords do not match");
    return;
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    alert(
      "❌ Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    );
    return;
  }

  console.log("✅ Password reset successful for", verificationData.email);

  // Clear all form fields
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

/* Password Reset Functions Section Ends */

/* ----------------------------------------------------------------------- */

/* Mobile Menu Functions Section */

function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("mobile-active");
}

/* Mobile Menu Functions Section Ends */

/* ----------------------------------------------------------------------- */

/* Newsletter Function Section */

function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`✅ Thank you for subscribing with: ${email}`);
  event.target.reset();
}

/* Newsletter Function Section Ends */

/* ----------------------------------------------------------------------- */

/* Event Listeners Section */

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
      if (!e.target.closest(".profile-dropdown") && !e.target.closest(".logout-btn")) {
        toggleDropdown();
      }
    });
  }
});

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

// Close confirmation modal when clicking outside
const logoutModal = document.getElementById('logoutConfirmationModal');
if (logoutModal) {
  logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
      closeConfirmationModal();
    }
  });
}

// Handle Enter key press in modals
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      if (activeModal.id === "signinModal") {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === "user-tab") {
          handleUserSignIn();
        } else if (activeTab && activeTab.id === "admin-tab") {
          handleAdminSignIn();
        }
      } else if (activeModal.id === "signupModal") {
        handleSignUp();
      } else if (activeModal.id === "forgotModal") {
        sendVerificationCode();
      } else if (activeModal.id === "forgotAdminModal") {
        sendAdminVerificationCode();
      } else if (activeModal.id === "verifyCodeModal") {
        verifyCode();
      } else if (activeModal.id === "resetPasswordModal") {
        resetPassword();
      }
    }
  }
});

// Handle Escape key to close modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const confirmationModal = getCachedElement('logoutConfirmationModal');
    if (confirmationModal && confirmationModal.classList.contains('active')) {
      closeConfirmationModal();
    }
    
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal && activeModal.id !== 'logoutConfirmationModal') {
      // Find the modal type by its ID using the MODAL_TYPES constant
      const modalType = Object.keys(MODAL_TYPES).find(key => MODAL_TYPES[key] === activeModal.id);
      if (modalType) {
        closeModal(modalType);
      }
    }
  }
});

/* Event Listeners Section Ends */

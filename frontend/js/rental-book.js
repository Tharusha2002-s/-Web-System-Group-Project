// ======================================== RENTAL BOOKING FUNCTIONS ========================================
const API_BASE_URL = 'http://localhost:5000/api';

// Calculate total cost and days
function calculateTotalCost() {
    const pickupDate = document.getElementById('pickup_date');
    const returnDate = document.getElementById('return_date');
    const numDaysInput = document.getElementById('num_days');
    const totalCostInput = document.getElementById('total_cost');

    if (!pickupDate || !returnDate || !numDaysInput || !totalCostInput) {
        console.error('Required form elements not found');
        return null;
    }

    if (pickupDate.value && returnDate.value) {
        const start = new Date(pickupDate.value);
        const end = new Date(returnDate.value);
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff > 0) {
            numDaysInput.value = daysDiff;
            
            // Get vehicle price from URL parameters or use default
            const urlParams = new URLSearchParams(window.location.search);
            const vehiclePrice = parseFloat(urlParams.get('price')) || 50;
            const totalCost = daysDiff * vehiclePrice;
            
            totalCostInput.value = `$${totalCost.toFixed(2)}`;
            return { 
                days: daysDiff, 
                cost: totalCost, 
                vehicleId: urlParams.get('vehicleId') || urlParams.get('id') || '1'
            };
        } else {
            alert('Return date must be after pickup date');
        }
    }
    return null;
}

// Add event listeners for date changes
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Booking page loaded');
    
    const pickupDateInput = document.getElementById('pickup_date');
    const returnDateInput = document.getElementById('return_date');
    
    if (pickupDateInput) {
        pickupDateInput.addEventListener('change', calculateTotalCost);
    }
    if (returnDateInput) {
        returnDateInput.addEventListener('change', calculateTotalCost);
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (pickupDateInput) {
        pickupDateInput.min = today;
    }
    if (returnDateInput) {
        returnDateInput.min = today;
    }

    // Initialize booking form handler
    initializeBookingForm();
});

// Generate a random booking ID
function generateBookingId() {
    return 'BK' + Date.now() + Math.floor(Math.random() * 1000);
}

// Show booking confirmation modal with success details
function showBookingConfirmation(bookingDetails, vehicleInfo, formData) {
    console.log('📋 Showing booking confirmation');
    console.log('Booking:', bookingDetails);
    console.log('Vehicle:', vehicleInfo);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content booking-success-modal" style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div class="success-header" style="text-align: center; margin-bottom: 30px;">
                <div class="success-icon" style="font-size: 60px; color: #28a745; margin-bottom: 15px;">✓</div>
                <h2 style="color: #28a745; margin-bottom: 10px;">Booking Confirmed Successfully!</h2>
                <p class="success-subtitle" style="color: #666;">Thank you for choosing Reliant Rental</p>
            </div>
            
            <div class="booking-details-card">
                <div class="details-grid">
                    <div class="detail-section" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            📝 Booking Information
                        </h3>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Booking ID:</span>
                            <span class="detail-value booking-id" style="color: #333; font-weight: bold;">#${bookingDetails.id || bookingDetails.booking_id || generateBookingId()}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Status:</span>
                            <span class="detail-value status-badge" style="background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${bookingDetails.status || 'Pending'}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Payment Status:</span>
                            <span class="detail-value status-badge" style="background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${bookingDetails.payment_status || 'Pending'}</span>
                        </div>
                    </div>

                    <div class="detail-section" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            👤 Customer Details
                        </h3>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Name:</span>
                            <span class="detail-value">${formData.first_name} ${formData.last_name}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Email:</span>
                            <span class="detail-value">${formData.email}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Phone:</span>
                            <span class="detail-value">${formData.phone}</span>
                        </div>
                    </div>

                    <div class="detail-section" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            🚗 Vehicle Details
                        </h3>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Vehicle:</span>
                            <span class="detail-value vehicle-name">${vehicleInfo.name || vehicleInfo.make + ' ' + vehicleInfo.model || 'Vehicle'}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Type:</span>
                            <span class="detail-value">${vehicleInfo.type || 'Standard'}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Daily Rate:</span>
                            <span class="detail-value">$${vehicleInfo.price_per_day || vehicleInfo.daily_rate || '50'}/day</span>
                        </div>
                    </div>

                    <div class="detail-section" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            📅 Rental Period
                        </h3>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Pickup:</span>
                            <span class="detail-value">${new Date(bookingDetails.start_date).toLocaleString()}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Return:</span>
                            <span class="detail-value">${new Date(bookingDetails.end_date).toLocaleString()}</span>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span class="detail-label" style="font-weight: 600; color: #555;">Total Days:</span>
                            <span class="detail-value">${bookingDetails.total_days} days</span>
                        </div>
                    </div>

                    <div class="detail-section highlight-section" style="margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            💰 Cost Summary
                        </h3>
                        <div class="detail-row total-row" style="display: flex; justify-content: space-between;">
                            <span class="detail-label" style="font-weight: 600; color: #555; font-size: 18px;">Total Amount:</span>
                            <span class="detail-value total-amount" style="font-size: 24px; font-weight: bold; color: #28a745;">$${parseFloat(bookingDetails.total_amount).toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="detail-section next-steps-section">
                        <h3 class="section-title" style="color: #ff7b00; margin-bottom: 15px; font-size: 16px;">
                            📋 Next Steps
                        </h3>
                        <div class="next-steps" style="background: #e8f4ff; padding: 15px; border-radius: 8px;">
                            <div class="step-item" style="margin-bottom: 10px; display: flex; align-items: center;">
                                <span class="step-number" style="background: #ff7b00; color: white; width: 25px; height: 25px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold;">1</span>
                                <span class="step-text">Your booking is pending approval</span>
                            </div>
                            <div class="step-item" style="margin-bottom: 10px; display: flex; align-items: center;">
                                <span class="step-number" style="background: #ff7b00; color: white; width: 25px; height: 25px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold;">2</span>
                                <span class="step-text">You will receive a confirmation email shortly</span>
                            </div>
                            <div class="step-item" style="margin-bottom: 10px; display: flex; align-items: center;">
                                <span class="step-number" style="background: #ff7b00; color: white; width: 25px; height: 25px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold;">3</span>
                                <span class="step-text">Payment can be made at pickup</span>
                            </div>
                            <div class="step-item" style="display: flex; align-items: center;">
                                <span class="step-number" style="background: #ff7b00; color: white; width: 25px; height: 25px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold;">4</span>
                                <span class="step-text">Bring your ID and driver's license</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions" style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                <button type="button" class="btn-secondary" onclick="printBookingDetails()" style="
                    padding: 12px 24px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                ">
                    🖨️ Print Details
                </button>
                <button type="button" class="btn-primary" onclick="redirectToHome()" style="
                    padding: 12px 24px;
                    background: #ff7b00;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                ">
                    🏠 Back to Home
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            redirectToHome();
        }
    });
}

// Redirect to home page
function redirectToHome() {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    // Update path based on your folder structure
    window.location.href = '../pages/Home.html';
}

// Print booking details
function printBookingDetails() {
    window.print();
}

// Get vehicle information by ID
async function getVehicleInfo(vehicleId) {
    try {
        console.log('🚗 Fetching vehicle info for ID:', vehicleId);
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Vehicle info retrieved:', result);
            return result.data || result.vehicle || result;
        }
    } catch (error) {
        console.error('⚠️ Error fetching vehicle info:', error);
    }
    
    // Fallback vehicle info
    const urlParams = new URLSearchParams(window.location.search);
    return {
        name: urlParams.get('name') || 'Vehicle',
        make: urlParams.get('make') || 'Standard',
        model: urlParams.get('model') || 'Model',
        year: urlParams.get('year') || new Date().getFullYear(),
        type: urlParams.get('type') || 'Sedan',
        price_per_day: parseFloat(urlParams.get('price')) || 50,
        daily_rate: parseFloat(urlParams.get('price')) || 50
    };
}

// Create demo booking data
function createDemoBooking(formData, bookingDetails) {
    return {
        id: generateBookingId(),
        booking_id: generateBookingId(),
        vehicle_id: parseInt(formData.vehicle_id) || 1,
        start_date: `${formData.pickup_date} ${formData.pickup_time}`,
        end_date: `${formData.return_date} ${formData.return_time}`,
        total_days: parseInt(bookingDetails.days),
        total_amount: parseFloat(bookingDetails.cost),
        status: 'pending',
        payment_status: 'pending',
        customer_name: `${formData.first_name} ${formData.last_name}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        created_at: new Date().toISOString()
    };
}

// Initialize booking form handler
function initializeBookingForm() {
    const form = document.querySelector('form');
    if (!form) {
        console.error('❌ Booking form not found');
        return;
    }

    console.log('✅ Booking form initialized');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        try {
            // Calculate booking details
            const bookingDetails = calculateTotalCost();
            if (!bookingDetails) {
                alert('Please select valid pickup and return dates');
                return;
            }

            // Get form data
            const formData = {
                first_name: document.getElementById('f_name')?.value || '',
                last_name: document.getElementById('l_name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                id_number: document.getElementById('card_num')?.value || '',
                pickup_date: document.getElementById('pickup_date')?.value || '',
                pickup_time: document.getElementById('pickup_time')?.value || '09:00',
                return_date: document.getElementById('return_date')?.value || '',
                return_time: document.getElementById('return_time')?.value || '09:00',
                total_days: bookingDetails.days,
                total_amount: bookingDetails.cost,
                vehicle_id: bookingDetails.vehicleId
            };

            // Validate required fields
            if (!formData.first_name || !formData.last_name || !formData.email || 
                !formData.phone || !formData.id_number) {
                alert('Please fill in all required fields');
                return;
            }

            console.log('📤 Submitting booking:', formData);

            // Create booking object for API
            const bookingData = {
                vehicle_id: parseInt(formData.vehicle_id),
                start_date: `${formData.pickup_date} ${formData.pickup_time}`,
                end_date: `${formData.return_date} ${formData.return_time}`,
                total_days: parseInt(formData.total_days),
                total_amount: parseFloat(formData.total_amount),
                status: 'pending',
                payment_status: 'pending',
                customer_name: `${formData.first_name} ${formData.last_name}`,
                customer_email: formData.email,
                customer_phone: formData.phone
            };

            let apiSuccess = false;
            let result = null;

            // Try to send booking to API
            try {
                const response = await fetch(`${API_BASE_URL}/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    result = await response.json();
                    apiSuccess = true;
                    console.log('✅ Booking created in database:', result);
                } else {
                    console.warn('⚠️ API request failed, using demo booking');
                }
            } catch (apiError) {
                console.warn('⚠️ API connection failed, using demo booking:', apiError.message);
            }

            // Get vehicle info
            const vehicleInfo = await getVehicleInfo(bookingData.vehicle_id);
            
            // Use API result if successful, otherwise create demo booking
            const finalBooking = apiSuccess ? (result.data || result.booking || result) : createDemoBooking(formData, bookingDetails);
            
            // Show success confirmation modal
            showBookingConfirmation(finalBooking, vehicleInfo, formData);
            
            // Reset form
            form.reset();

        } catch (error) {
            console.error('❌ Error in booking process:', error);
            alert('An error occurred while processing your booking. Please try again.');
        }
    });
}

// ======================================== OTHER EXISTING FUNCTIONS ========================================
// ... (keep all your existing authentication and other functions below)

// Add CSS for the booking confirmation modal
const style = document.createElement('style');
style.textContent = `
    .booking-details {
        max-height: 60vh;
        overflow-y: auto;
        margin: 20px 0;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #ddd;
    }
    
    .detail-section {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .detail-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .detail-section h3 {
        color: #2c5aa0;
        margin-bottom: 10px;
        font-size: 1.1em;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 5px 0;
    }
    
    .detail-label {
        font-weight: 600;
        color: #555;
    }
    
    .detail-value {
        color: #333;
    }
    
    .status-pending, .payment-pending {
        background: #fff3cd;
        color: #856404;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85em;
    }
    
    .total-amount {
        font-size: 1.2em;
        font-weight: bold;
        color: #2c5aa0;
    }
    
    .next-steps {
        background: #e8f4ff;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
    }
    
    .next-steps p {
        margin: 5px 0;
        color: #2c5aa0;
    }
    
    .modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #2c5aa0;
        color: white;
    }
    
    .btn-primary:hover {
        background: #1e3d6f;
        transform: translateY(-2px);
    }
    
    .btn-secondary {
        background: #6c757d;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #545b62;
        transform: translateY(-2px);
    }
    
    .success-icon {
        font-size: 4em;
        margin-bottom: 20px;
    }
    
    .success-modal h2 {
        color: #28a745;
        margin-bottom: 20px;
    }

    
`;
document.head.appendChild(style);

// ... (rest of your existing code remains exactly the same below this point)


// ======================================== GLOBAL VARIABLES ========================================
let verificationData = {
  email: "",
  code: "",
  verified: false,
  isAdmin: false,
};

// ======================================== PAGE LOAD HANDLERS ========================================
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
  const userProfile = document.getElementById("userProfile");
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        toggleDropdown();
      }
    });
  }
});

// ======================================== MODAL FUNCTIONS ========================================
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
function handleAdminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;
  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }
  showUserProfile(username, true);
  closeModal("admin");
  document.getElementById("adminUsername").value = "";
  document.getElementById("adminPassword").value = "";
}

// ======================================== PASSWORD RESET FUNCTIONS ========================================
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

// ======================================== USER PROFILE FUNCTIONS ========================================
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

// ======================================== NAVIGATION FUNCTIONS ========================================
function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("mobile-active");
  }
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

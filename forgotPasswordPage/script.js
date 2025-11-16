// ...Select all buttons...
const submitBtn = document.querySelector('.forget-info button[type="submit"]');
const cancelBtn = document.querySelector('.forget-info button[type="button"]');
const openEmailBtn = document.querySelector('.forget--info button[type="submit"]');
const backToLoginBtn = document.querySelector('.forget--info button[type="button"]');

// ...Forgot password submit...
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset link sent! Check your email.');
});

// ...Cancel button...
cancelBtn.addEventListener('click', () => {
    window.location.href = "index.html"; 
});

// ...Open email button...
if(openEmailBtn){
    openEmailBtn.addEventListener('click', () => {
        window.open('https://mail.google.com', '_blank');
    });
}

// ...Back to login...
if(backToLoginBtn){
    backToLoginBtn.addEventListener('click', () => {
        window.location.href = "login.html"; 
    });
}

// ...Contact form submission...
const contactForm = document.querySelector('.contact-form');
if(contactForm){
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Your message has been sent. Support will contact you shortly.');
        contactForm.reset();
    });
}

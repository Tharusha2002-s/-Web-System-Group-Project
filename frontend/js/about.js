
    
    function show(section) {
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      event.target.classList.add('active');
    }

    
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("dots");

    slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => setSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");
    updateSlider();

    function moveSlide(direction) {
      currentSlide = (currentSlide + direction + slides.length) % slides.length;
      updateSlider();
    }

    function setSlide(index) {
      currentSlide = index;
      updateSlider();
    }

    function updateSlider() {
      document.getElementById("slider").style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach(dot => dot.classList.remove("active"));
      dots[currentSlide].classList.add("active");
    }

    
    function ou(id) {
      const qualities = document.querySelectorAll(".quality");
      qualities.forEach(q => q.classList.remove("active"));
      document.getElementById(id).classList.add("active");

      const buttons = document.querySelectorAll(".qu button");
      buttons.forEach(b => b.classList.remove("active"));
      document.getElementById(`btn-${id}`).classList.add("active");
    }

    
    function openModal(id) {
      document.getElementById(id).style.display = "flex";
    }

    function closeModal(id) {
      document.getElementById(id).style.display = "none";
    }

// DOM content loaded event listener to initialize all functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tabs for each section separately
  setupTabs(".method-tab", ".method-pane", "#methodology");
  setupTabs(".sample-tab", ".sample-pane", "#id-samples");
  setupTabs(".testimonial-tab", ".testimonial-pane", "#testimonials");

  // Initialize other functionality
  initNavigation();
  initTestimonialSlider();
  initFilters();
  initContactForm();
  initSmoothScroll();
  setupPreviewModal();
  initAnimations();
});

// Fixed tab functionality with proper scoping to parent sections
function setupTabs(tabBtnsSelector, tabPanesSelector, parentSelector) {
  const parent = document.querySelector(parentSelector);
  if (!parent) {
    console.error(`Parent selector "${parentSelector}" not found`);
    return;
  }

  const tabBtns = parent.querySelectorAll(tabBtnsSelector);
  if (tabBtns.length === 0) {
    console.error(
      `No tab buttons found with selector "${tabBtnsSelector}" within "${parentSelector}"`
    );
    return;
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons in this section
      tabBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get target pane ID
      const targetId = this.getAttribute("data-target");
      if (!targetId) {
        console.error("Tab button is missing data-target attribute", this);
        return;
      }

      // Get all panes in this section
      const panes = parent.querySelectorAll(tabPanesSelector);

      // Hide all panes
      panes.forEach((pane) => pane.classList.remove("active"));

      // Show target pane - FIXED: Use getElementById to find the pane by ID
      const targetPane = parent.querySelector(`#${targetId}`);
      if (targetPane) {
        targetPane.classList.add("active");
      } else {
        console.error(`Target pane with ID "${targetId}" not found`);
      }
    });
  });
}

// Navigation functionality
function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");
    });
  }

  // Close menu when clicking a nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle && navMenu) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });
  });

  // Setup active navigation on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll("section");
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Testimonial slider functionality
function initTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slide-prev");
  const nextBtn = document.querySelector(".slide-next");
  let currentSlide = 0;
  let slideInterval;

  // Initialize slider
  function showSlide(n) {
    if (!slides.length) return;

    // Hide all slides
    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    // Remove active class from all dots
    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show the current slide and activate corresponding dot
    slides[n].style.display = "block";
    if (dots[n]) {
      dots[n].classList.add("active");
    }
  }

  // Next and previous controls
  function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
  }

  // Initialize slider
  if (slides.length > 0) {
    showSlide(currentSlide);

    // Event listeners for controls
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        clearInterval(slideInterval); // Reset timer when manually changing slides
        prevSlide();
        startAutoSlide(); // Restart timer
      });

      nextBtn.addEventListener("click", () => {
        clearInterval(slideInterval); // Reset timer when manually changing slides
        nextSlide();
        startAutoSlide(); // Restart timer
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        clearInterval(slideInterval); // Reset timer when manually changing slides
        currentSlide = index;
        showSlide(currentSlide);
        startAutoSlide(); // Restart timer
      });
    });

    // Start auto slide function
    function startAutoSlide() {
      clearInterval(slideInterval); // Clear any existing interval
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Auto slide every 5 seconds
    startAutoSlide();
  }
}

// Filter functionality for course showcase
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const showcaseItems = document.querySelectorAll(".showcase-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Add active class to clicked button
      btn.classList.add("active");

      // Get filter value
      const filter = btn.getAttribute("data-filter");

      // Filter showcase items
      showcaseItems.forEach((item) => {
        if (filter === "all" || item.classList.contains(filter)) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "translateY(20px)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form elements
      const nameInput = contactForm.querySelector("#name");
      const emailInput = contactForm.querySelector("#email");
      const messageInput = contactForm.querySelector("#message");

      // Simple validation
      let isValid = true;

      if (!nameInput.value.trim()) {
        markInvalid(nameInput, "Please enter your name");
        isValid = false;
      } else {
        markValid(nameInput);
      }

      if (!emailInput.value.trim()) {
        markInvalid(emailInput, "Please enter your email");
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        markInvalid(emailInput, "Please enter a valid email address");
        isValid = false;
      } else {
        markValid(emailInput);
      }

      if (!messageInput.value.trim()) {
        markInvalid(messageInput, "Please enter your message");
        isValid = false;
      } else {
        markValid(messageInput);
      }

      if (isValid) {
        // In a real implementation, you would send the form data to a server
        // For now, just show a success message
        showFormMessage(
          "success",
          "Thank you for your message! I will get back to you soon."
        );
        contactForm.reset();
      }
    });

    // Add input event listeners to clear validation messages
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        const errorElement =
          input.parentElement.querySelector(".error-message");
        if (errorElement) {
          errorElement.remove();
        }
      });
    });
  }

  function markInvalid(input, message) {
    input.classList.add("is-invalid");

    // Remove any existing error message
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
  }

  function markValid(input) {
    input.classList.remove("is-invalid");
    const errorElement = input.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }

  function isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function showFormMessage(type, message) {
    // Remove any existing message
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;

    // Add to form
    contactForm.appendChild(messageElement);

    // Remove after 5 seconds
    setTimeout(() => {
      messageElement.classList.add("fade-out");
      setTimeout(() => {
        messageElement.remove();
      }, 500);
    }, 5000);
  }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        });
      }
    });
  });
}

// E-Learning Preview Modal Functionality
function setupPreviewModal() {
  const modal = document.getElementById("previewModal");
  const previewFrame = document.getElementById("previewFrame");
  const modalTitle = document.querySelector(".modal-title");
  const closeModal = document.querySelector(".close-modal");
  const previewBtns = document.querySelectorAll(".btn-view");

  if (!modal || !previewFrame || !closeModal) return;

  previewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = btn.getAttribute("href");
      const title = btn
        .closest(".showcase-item")
        .querySelector("h3").textContent;

      previewFrame.src = url;
      if (modalTitle) {
        modalTitle.textContent = title;
      }
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    previewFrame.src = "";
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      previewFrame.src = "";
      document.body.style.overflow = "auto";
    }
  });
}

// Initialize animations
function initAnimations() {
  // Animate elements when they come into view
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animateElements.forEach((element) => {
    observer.observe(element);
  });

  // Add animation classes to elements
  document.querySelectorAll(".skill-category").forEach((el, index) => {
    el.classList.add("animate-on-scroll");
    el.style.animationDelay = `${index * 0.1}s`;
  });

  document
    .querySelectorAll(".framework-card, .approach-card, .tools-category")
    .forEach((el, index) => {
      el.classList.add("animate-on-scroll");
      el.style.animationDelay = `${index * 0.1}s`;
    });

  document.querySelectorAll(".showcase-item").forEach((el, index) => {
    el.classList.add("animate-on-scroll");
    el.style.animationDelay = `${index * 0.1}s`;
  });

  document.querySelectorAll(".project-card").forEach((el, index) => {
    el.classList.add("animate-on-scroll");
  });

  document.querySelectorAll(".testimonial-card").forEach((el, index) => {
    el.classList.add("animate-on-scroll");
    el.style.animationDelay = `${index * 0.1}s`;
  });
}

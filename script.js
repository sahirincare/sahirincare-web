
// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / height) * 100;
  document.getElementById('scroll-progress').style.width = scrolled + '%';

  // Back to Top Button visibility
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    if (scrollTop > 300) { // Show button after scrolling 300px
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
});

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('text-green-600', 'font-bold');
        if (link.getAttribute('href').substring(1) === entry.target.id) {
          link.classList.add('text-green-600', 'font-bold');
        }
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(section => observer.observe(section));

// Page Loader
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
});

// AOS Initialization
AOS.init({ once: true, duration: 800 });

// Formspree Contact Form
var form = document.getElementById("my-form");
async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "✅ Pesanan Anda berhasil dikirim!";
            status.classList.remove("text-red-600");
            status.classList.add("text-green-600");
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "❌ Terjadi kesalahan saat mengirim. Coba lagi ya.";
                }
                status.classList.remove("text-green-600");
                status.classList.add("text-red-600");
            });
        }
    }).catch(error => {
        status.innerHTML = "❌ Terjadi kesalahan koneksi.";
        status.classList.remove("text-green-600");
        status.classList.add("text-red-600");
    });
}
form.addEventListener("submit", handleSubmit);

// --- UPDATED DARK MODE SCRIPT ---
const toggleDesktop = document.getElementById('darkToggleDesktop');
const toggleMobile = document.getElementById('darkToggleMobile');
const body = document.body;

function applyDarkMode(enabled) {
    body.classList.toggle('dark-mode', enabled);
    // Sync both switches
    if(toggleDesktop) toggleDesktop.checked = enabled;
    if(toggleMobile) toggleMobile.checked = enabled;
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
}

// Check saved mode or system preference on initial load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('darkMode');

// Apply dark mode based on saved preference or system preference
if (savedMode === 'enabled' || (savedMode === null && prefersDark)) { // If no saved mode, use system preference
    applyDarkMode(true);
} else {
    applyDarkMode(false);
}

// Add event listeners for both toggles
toggleDesktop?.addEventListener('change', () => {
  applyDarkMode(toggleDesktop.checked);
});

toggleMobile?.addEventListener('change', () => {
  applyDarkMode(toggleMobile.checked);
});

// --- Service Filter Logic ---
const filterButtons = document.querySelectorAll('#service-filters .filter-button');
const serviceCards = document.querySelectorAll('#service-list .service-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        button.classList.add('active');

        const filter = button.dataset.filter; // Get the filter category

        serviceCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.style.display = 'flex'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });
});

// --- FAQ Accordion Logic ---
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling; // Get the content div
        const icon = header.querySelector('i'); // Get the icon

        // Close other open accordions
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                otherHeader.nextElementSibling.classList.remove('active');
                otherHeader.nextElementSibling.style.maxHeight = null;
                otherHeader.querySelector('i').classList.remove('fa-chevron-up');
                otherHeader.querySelector('i').classList.add('fa-chevron-down');
            }
        });

        // Toggle current accordion
        content.classList.toggle('active');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');

        if (content.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px"; // Set max-height to content's scrollHeight
        } else {
            content.style.maxHeight = null; // Reset max-height
        }
    });
});

// --- Back to Top Button Logic ---
const backToTopButton = document.getElementById('back-to-top');
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});




document.addEventListener("DOMContentLoaded", function () {
  const hamburgerToggle = document.getElementById("hamburger-toggle");
  const hamburgerMenu = document.getElementById("hamburger-menu");

  hamburgerToggle?.addEventListener("click", function (e) {
    e.stopPropagation();
    hamburgerMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", function (e) {
    if (!hamburgerMenu.contains(e.target) && !hamburgerToggle.contains(e.target)) {
      hamburgerMenu.classList.add("hidden");
    }
  });
});



document.getElementById("admin-login-form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = e.target[0].value.trim();
  const password = e.target[1].value.trim();
  const status = document.getElementById("login-status");

  // Dummy login check
  if (username === "admin" && password === "admin123") {
    alert("Login berhasil!");
    status.classList.add("hidden");
  } else {
    status.classList.remove("hidden");
  }
});

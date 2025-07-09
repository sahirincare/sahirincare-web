// Namespace untuk semua fungsi JavaScript aplikasi
const SahirinCareApp = (() => {
    // Konfigurasi
    const CONFIG = {
        GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE", // GANTI DENGAN API KEY ANDA!
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "admin123",
        WHATSAPP_NUMBER: "6287808788589",
        SAHIRINCARE_LAT: -6.370217455605747,
        SAHIRINCARE_LON: 107.09926462392487
    };

    // Elemen DOM
    const DOM = {
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        hamburgerToggleDesktop: document.getElementById('hamburger-toggle-desktop'),
        hamburgerMenuDesktop: document.getElementById('hamburger-menu-desktop'),
        mobileLangToggle: document.getElementById('mobile-lang-toggle'),
        mobileLangMenu: document.getElementById('mobile-lang-menu'),
        loader: document.getElementById('loader'),
        backToTopButton: document.getElementById('back-to-top'),
        darkToggleDesktop: document.getElementById('darkToggleDesktop'),
        darkToggleMobile: document.getElementById('darkToggleMobile'),
        filterButtons: document.querySelectorAll('#service-filters .filter-button'),
        serviceCards: document.querySelectorAll('#service-list .service-card'),
        accordionHeaders: document.querySelectorAll('.accordion-header'),
        contactForm: document.getElementById("my-form"),
        contactFormButton: document.getElementById("my-form-button"),
        contactFormStatus: document.getElementById("my-form-status"),
        adminLoginForm: document.getElementById("admin-login-form"),
        adminUsernameInput: document.getElementById("admin-username"),
        adminPasswordInput: document.getElementById("admin-password"),
        togglePasswordButton: document.getElementById("toggle-password"),
        loginStatus: document.getElementById("login-status"),
        geminiModal: document.getElementById('gemini-modal'),
        modalLoader: document.getElementById('modal-loader'),
        modalError: document.getElementById('modal-error'),
        modalErrorMessage: document.getElementById('modal-error-message'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        geminiInput: document.getElementById('gemini-input'),
        getGeminiResponseBtn: document.getElementById('get-gemini-response-btn'),
        geminiOutput: document.getElementById('gemini-output'),
        testimonialTrack: document.querySelector('.testimonial-track'),
        testimonialItems: document.querySelectorAll('.testimonial-item-wrapper'),
        prevTestimonialBtn: document.getElementById('prev-testimonial'),
        nextTestimonialBtn: document.getElementById('next-testimonial'),
        lokasiInfoBooking: document.getElementById("lokasi-info-booking"),
        lokasiText: document.getElementById("lokasi-text"),
        ulangLokasiBtn: document.getElementById("ulang-lokasi")
    };

    let testimonialCurrentIndex = 0;
    let testimonialIntervalId;

    // --- Helper Functions ---
    const applyDarkMode = (enabled) => {
        document.body.classList.toggle('dark-mode', enabled);
        if(DOM.darkToggleDesktop) DOM.darkToggleDesktop.checked = enabled;
        if(DOM.darkToggleMobile) DOM.darkToggleMobile.checked = enabled;
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
    };

    const showModal = (type, message = '') => {
        DOM.geminiModal.classList.add('show');
        if (type === 'loading') {
            DOM.modalLoader.style.display = 'block';
            DOM.modalError.style.display = 'none';
        } else if (type === 'error') {
            DOM.modalLoader.style.display = 'block'; // Tampilkan loader juga untuk konsistensi
            DOM.modalError.style.display = 'block';
            DOM.modalErrorMessage.textContent = message;
        }
    };

    const hideModal = () => {
        DOM.geminiModal.classList.remove('show');
        DOM.modalLoader.style.display = 'none';
        DOM.modalError.style.display = 'none';
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getLangName = (langCode) => {
        const langMap = {
            'en': 'english', 'ar': 'arabic', 'ja': 'japanese', 'fr': 'french',
            'de': 'german', 'zh-CN': 'chinese', 'ko': 'korean', 'hi': 'hindi', 'id': 'indonesian'
        };
        return langMap[langCode] || langCode;
    };

    // --- Core Functions ---

    const initLoader = () => {
        if (DOM.loader) DOM.loader.style.display = 'none';
    };

    const initMobileMenu = () => {
        DOM.mobileMenuButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.mobileMenu.classList.toggle('active');
        });
        DOM.hamburgerToggleDesktop?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.hamburgerMenuDesktop.classList.toggle('hidden');
        });
        DOM.mobileLangToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.mobileLangMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (DOM.mobileMenu && !DOM.mobileMenu.contains(e.target) && !DOM.mobileMenuButton.contains(e.target)) {
                DOM.mobileMenu.classList.remove('active');
            }
            if (DOM.hamburgerMenuDesktop && !DOM.hamburgerMenuDesktop.contains(e.target) && !DOM.hamburgerToggleDesktop.contains(e.target)) {
                DOM.hamburgerMenuDesktop.classList.add('hidden');
            }
            if (DOM.mobileLangMenu && !DOM.mobileLangMenu.contains(e.target) && !DOM.mobileLangToggle.contains(e.target)) {
                DOM.mobileLangMenu.classList.add('hidden');
            }
        });
    };

    const closeLangMenu = () => {
        DOM.mobileLangMenu.classList.add('hidden');
    };

    const initScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / height) * 100;
            document.getElementById('scroll-progress').style.width = scrolled + '%';

            if (DOM.backToTopButton) {
                scrollTop > 300 ? DOM.backToTopButton.classList.add('show') : DOM.backToTopButton.classList.remove('show');
            }
        });
        DOM.backToTopButton?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const initAOS = () => {
        AOS.init({ once: true, duration: 800 });
    };

    const initDarkMode = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem('darkMode');

        if (savedMode === 'enabled' || (savedMode === null && prefersDark)) {
            applyDarkMode(true);
        } else {
            applyDarkMode(false);
        }

        DOM.darkToggleDesktop?.addEventListener('change', () => applyDarkMode(DOM.darkToggleDesktop.checked));
        DOM.darkToggleMobile?.addEventListener('change', () => applyDarkMode(DOM.darkToggleMobile.checked));

        // Apply dark mode based on time of day if no saved preference
        if (savedMode === null) {
            const now = new Date();
            const hour = now.getHours();
            const isNight = hour >= 18 || hour < 6;
            if (isNight) {
                applyDarkMode(true);
            }
        }
    };

    const initServiceFilters = () => {
        DOM.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                DOM.serviceCards.forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
                });
            });
        });
    };

    const initAccordion = () => {
        DOM.accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('i');
                const isActive = content.classList.contains('active');
                DOM.accordionHeaders.forEach(h => { // Close others
                    const c = h.nextElementSibling;
                    const i = h.querySelector('i');
                    c.classList.remove('active');
                    c.style.maxHeight = null;
                    i.classList.remove('fa-chevron-up');
                    i.classList.add('fa-chevron-down');
                });
                if (!isActive) { // Open clicked one
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        });
    };

    const initContactForm = () => {
        DOM.contactForm?.addEventListener("submit", async function handleSubmit(event) {
            event.preventDefault();
            DOM.contactFormStatus.textContent = "";
            DOM.contactFormButton.disabled = true;
            DOM.contactFormButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...';

            const data = new FormData(event.target);
            try {
                const response = await fetch(event.target.action, {
                    method: DOM.contactForm.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    DOM.contactFormStatus.innerHTML = "✅ Pesanan Anda berhasil dikirim!";
                    DOM.contactForm.reset();
                } else {
                    const errorData = await response.json();
                    DOM.contactFormStatus.innerHTML = errorData.errors ? errorData.errors.map(e => e.message).join(", ") : "❌ Terjadi kesalahan saat mengirim pesanan.";
                }
            } catch (error) {
                console.error("Formspree submission error:", error);
                DOM.contactFormStatus.innerHTML = "❌ Terjadi kesalahan koneksi.";
            } finally {
                DOM.contactFormButton.disabled = false;
                DOM.contactFormButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Kirim Pesanan';
            }
        });
    };

    const initAdminLogin = () => {
        DOM.adminLoginForm?.addEventListener("submit", function(e) {
            e.preventDefault();
            const username = DOM.adminUsernameInput.value.trim();
            const password = DOM.adminPasswordInput.value.trim();

            DOM.loginStatus.classList.remove("text-red-600", "text-green-600");
            DOM.loginStatus.textContent = "Mencoba masuk...";
            DOM.loginStatus.className = "mt-4 text-center text-sm font-medium text-yellow-500 block";

            setTimeout(() => {
                if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
                    DOM.loginStatus.textContent = "✅ Login berhasil! Mengarahkan...";
                    DOM.loginStatus.className = "mt-4 text-center text-sm font-medium text-green-600 block";
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html'; // Ganti dengan path dashboard yang benar
                    }, 1000);

                } else {
                    DOM.loginStatus.textContent = "❌ Username atau password salah. Coba lagi.";
                    DOM.loginStatus.className = "mt-4 text-center text-sm font-medium text-red-600 block";
                    const formContainer = document.querySelector("#admin-login .bg-white");
                    formContainer.classList.add('animate-shake');
                    setTimeout(() => formContainer.classList.remove('animate-shake'), 500);
                }
            }, 1000);
        });

        DOM.togglePasswordButton?.addEventListener('click', function() {
            const isPassword = DOM.adminPasswordInput.type === 'password';
            DOM.adminPasswordInput.type = isPassword ? 'text' : 'password';
            this.querySelector('i').classList.toggle('fa-eye', !isPassword);
            this.querySelector('i').classList.toggle('fa-eye-slash', isPassword);
        });
    };

    const callGeminiApi = async (prompt) => {
        showModal('loading');
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Gagal berkomunikasi dengan API.');
            }

            const result = await response.json();
            
            hideModal();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Respons dari API tidak valid atau kosong.');
            }
        } catch (error) {
            showModal('error', error.message);
            console.error("Gemini API Error:", error);
            return null;
        }
    };

    const initGeminiFeature = () => {
        DOM.closeModalBtn.addEventListener('click', hideModal);

        DOM.getGeminiResponseBtn.addEventListener('click', async () => {
            const query = DOM.geminiInput.value.trim();
            if (!query) {
                showModal('error', 'Mohon isi pertanyaan atau keluhan Anda terlebih dahulu.');
                return;
            }

            let prompt;
            if (query.toLowerCase().includes("pundak") || query.toLowerCase().includes("kepala") || 
                query.toLowerCase().includes("pegal") || query.toLowerCase().includes("nyeri") ||
                query.toLowerCase().includes("layanan") || query.toLowerCase().includes("pijat")) {
                prompt = `Anda adalah seorang terapis ahli dari SahirinCare. Berdasarkan keluhan pelanggan berikut: "${query}", rekomendasikan satu layanan yang paling cocok dari daftar ini: Pijat Terapis, Pijat Refleksi, Pijat Masuk Angin, Terapis Nyeri Punggung, Pijat Anak-Anak, Pijat ke Rumah. Berikan nama layanan yang direkomendasikan dalam format tebal (**Nama Layanan**), diikuti dengan penjelasan singkat mengapa layanan tersebut cocok. Tambahkan juga ajakan untuk booking.`;
            } else {
                prompt = `Sebagai seorang ahli kesehatan untuk SahirinCare, berikan 3 tips kesehatan yang praktis dan mudah diikuti terkait topik: "${query}". Sajikan dalam format daftar bernomor.`;
            }
            
            const resultText = await callGeminiApi(prompt);
            
            if (resultText) {
                DOM.geminiOutput.textContent = resultText; 
                DOM.geminiOutput.innerHTML = DOM.geminiOutput.innerHTML.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                DOM.geminiOutput.classList.remove('hidden');
            }
        });
    };

    const updateTestimonialCarousel = () => {
        if (DOM.testimonialItems.length === 0 || !DOM.testimonialTrack) return;
        // Calculate item width including any horizontal padding/margin from CSS
        // For w-full and px-4, the actual content width is (container_width - 2*1rem)
        // But for translateX, we need the full width of the flex item.
        const itemWidth = DOM.testimonialItems[0].offsetWidth; 
        DOM.testimonialTrack.style.transform = `translateX(-${testimonialCurrentIndex * itemWidth}px)`;
    };

    const startTestimonialAutoSlide = () => {
        if (DOM.testimonialItems.length > 1) { // Only auto-slide if more than one testimonial
            testimonialIntervalId = setInterval(() => {
                testimonialCurrentIndex = (testimonialCurrentIndex + 1) % DOM.testimonialItems.length;
                updateTestimonialCarousel();
            }, 5000);
        }
    };

    const stopTestimonialAutoSlide = () => {
        clearInterval(testimonialIntervalId);
    };

    const initTestimonialCarousel = () => {
        if (DOM.testimonialItems.length <= 1) { // Hide buttons if 0 or 1 testimonial
            if (DOM.prevTestimonialBtn) DOM.prevTestimonialBtn.style.display = 'none';
            if (DOM.nextTestimonialBtn) DOM.nextTestimonialBtn.style.display = 'none';
            return; // No need for carousel logic if only one item
        }

        updateTestimonialCarousel();
        startTestimonialAutoSlide();

        DOM.prevTestimonialBtn?.addEventListener('click', () => {
            stopTestimonialAutoSlide();
            testimonialCurrentIndex = (testimonialCurrentIndex - 1 + DOM.testimonialItems.length) % DOM.testimonialItems.length;
            updateTestimonialCarousel();
            startTestimonialAutoSlide();
        });

        DOM.nextTestimonialBtn?.addEventListener('click', () => {
            stopTestimonialAutoSlide();
            testimonialCurrentIndex = (testimonialCurrentIndex + 1) % DOM.testimonialItems.length;
            updateTestimonialCarousel();
            startTestimonialAutoSlide();
        });

        window.addEventListener('resize', () => {
            updateTestimonialCarousel(); // Recalculate on resize
            stopTestimonialAutoSlide(); // Stop and restart to prevent issues during resize
            startTestimonialAutoSlide();
        });
    };

    const detectLocation = async () => {
        if (DOM.lokasiInfoBooking) DOM.lokasiInfoBooking.classList.remove("hidden"); 
        if (DOM.lokasiText) DOM.lokasiText.textContent = "📍 Menentukan lokasi Anda...";

        if (!navigator.geolocation) {
            if (DOM.lokasiText) DOM.lokasiText.textContent = "Geolocation tidak didukung browser Anda.";
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const distance = getDistance(lat, lon, CONFIG.SAHIRINCARE_LAT, CONFIG.SAHIRINCARE_LON) * 1.15; // Estimasi jarak + 15%

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                const place = data.address.village || data.address.suburb || data.address.town || data.address.city || data.display_name;
                if (DOM.lokasiText) DOM.lokasiText.innerHTML = `📍 Lokasi Anda: <strong>${place}</strong><br>🚗 Estimasi jarak: <strong>${distance.toFixed(1)} km</strong> ke SahirinCare`;
            } catch (err) {
                console.error("Reverse geocoding error:", err);
                if (DOM.lokasiText) DOM.lokasiText.innerHTML = `📍 Koordinat Anda terdeteksi.<br>🚗 Estimasi jarak: <strong>${distance.toFixed(1)} km</strong> ke SahirinCare`;
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            let errorMessage = "Gagal mendeteksi lokasi.";
            if (err.code === err.PERMISSION_DENIED) {
                errorMessage = "Izin lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser Anda.";
            } else if (err.code === err.POSITION_UNAVAILABLE) {
                errorMessage = "Informasi lokasi tidak tersedia.";
            } else if (err.code === err.TIMEOUT) {
                errorMessage = "Waktu deteksi lokasi habis.";
            }
            if (DOM.lokasiText) DOM.lokasiText.textContent = errorMessage;
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    const initGoogleTranslate = () => {
        // Fungsi ini akan dipanggil oleh Google Translate API
        window.googleTranslateElementInit = () => {
            new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'id,en,ar,ja,fr,de,zh-CN,ko,hi',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        // Memuat skrip Google Translate secara dinamis
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    };

    const translateLanguage = (lang) => {
        const $frame = document.querySelector('.goog-te-menu-frame');
        if (!$frame) {
            // Jika frame belum dimuat, coba lagi setelah jeda
            setTimeout(() => translateLanguage(lang), 500);
            return;
        }
        
        const langElements = $frame.contentWindow.document.querySelectorAll('.goog-te-menu2-item span.text');
        for (let i = 0; i < langElements.length; i++) {
            const el = langElements[i];
            if (el.innerText.toLowerCase().includes(getLangName(lang))) {
                el.click();
                return;
            }
        }
    };

    // Public API
    return {
        init: () => {
            initLoader();
            initMobileMenu();
            initScrollEvents();
            initAOS();
            initDarkMode();
            initServiceFilters();
            initAccordion();
            initContactForm();
            initAdminLogin();
            initGeminiFeature();
            initTestimonialCarousel();
            detectLocation(); // Initial location detection
            initGoogleTranslate();
        },
        closeLangMenu: closeLangMenu, // Expose for inline onclick
        translateLanguage: translateLanguage, // Expose for inline onclick
        detectLocation: detectLocation // Expose for inline onclick
    };
})();

document.addEventListener('DOMContentLoaded', SahirinCareApp.init);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      console.log('ServiceWorker terdaftar: ', reg.scope);
    }).catch(function (err) {
      console.log('ServiceWorker gagal:', err);
    });
  });
}

// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let pastorSlide = 0;
let slideInterval;
let modalOpen = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Priesthood Family Chapel - Script Loaded');
    
    // Initialize all components
    initDarkMode();
    initMobileMenu();
    initEventSlider();
    // initMediaTabs(); // Remove if using side-by-side videos
    initServicesTabs();
    initPastorSlider();
    initModals();
    initToastNotifications();
    initCopyButtons();
    initQuickJoin(); // Fixed version included below
    initYouTubePlayers();
    initMobileFAB();
    initGallery();
    initBibleCollege();
    
    // Set active navigation
    setActiveNavigation();
    
    // Initialize lazy loading
    initLazyLoading();
});

// ===== DARK MODE TOGGLE =====
function initDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const html = document.documentElement;
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
        
        // Show toast notification
        showToast(`Switched to ${newTheme} mode`);
    }
    
    // Check for saved theme or prefer-color-scheme
    function initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        // Apply saved theme
        html.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme);
    }
    
    // Update icons
    function updateDarkModeIcon(theme) {
        // Update desktop toggle icon
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update mobile FAB icon
        if (mobileThemeToggle) {
            const mobileIcon = mobileThemeToggle.querySelector('i');
            if (mobileIcon) {
                mobileIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Update FAB label text
            const fabLabel = mobileThemeToggle.querySelector('.fab-label');
            if (fabLabel) {
                fabLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
            }
        }
    }
    
    // Initialize theme
    initTheme();
    
    // Desktop toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Mobile FAB toggle button
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
        
        // Also add keyboard support for accessibility
        mobileThemeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-change if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateDarkModeIcon(newTheme);
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Update hamburger icon
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('active') ? 
                    'fas fa-times' : 'fas fa-bars';
            }
        });
        
        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}

// ===== EVENTS SLIDER =====
function initEventSlider() {
    const slides = document.querySelectorAll('.event-slide');
    const prevBtn = document.getElementById('prevEventBtn');
    const nextBtn = document.getElementById('nextEventBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;
    
    const totalSlides = slides.length;
    
    // Initialize first slide
    showSlide(0);
    
    // Next slide function
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Previous slide function
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        
        // Activate corresponding dot
        if (dots.length > index) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto slide (optional)
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto slide on hover
    const slider = document.querySelector('.events-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// ===== MEDIA TABS =====
function initMediaTabs() {
    const tabBtns = document.querySelectorAll('.media-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.media-tabs .tab-content');
    
    if (!tabBtns.length) return;
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none'; // Ensure they're hidden
        });
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`.media-tabs .tab-btn[data-tab="${tabId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Show corresponding content
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
            tabContent.style.display = 'block';
            
            // Initialize YouTube players for this tab
            setTimeout(() => {
                initYouTubePlayersForTab(tabContent);
            }, 100);
        }
    }
    
    // Add click events to tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Initialize first tab
    if (tabBtns.length > 0) {
        const firstTabId = tabBtns[0].getAttribute('data-tab');
        switchTab(firstTabId);
    }
}

// ===== INIT YOUTUBE PLAYERS FOR SPECIFIC TAB =====
function initYouTubePlayersForTab(tabElement) {
    const youtubePlayers = tabElement.querySelectorAll('.youtube-player');
    
    youtubePlayers.forEach(player => {
        const videoId = player.getAttribute('data-id');
        const title = player.getAttribute('data-title');
        
        if (!videoId) return;
        
        // Clear existing content and create new player
        player.innerHTML = '';
        
        // Create thumbnail with play button
        const thumbnail = document.createElement('div');
        thumbnail.className = 'youtube-thumbnail';
        thumbnail.style.cssText = `
            background-image: url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg);
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            position: relative;
            cursor: pointer;
        `;
        
        // Create play button
        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        
        // Add click event
        thumbnail.addEventListener('click', function() {
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        });
        
        // Add keyboard support
        thumbnail.setAttribute('tabindex', '0');
        thumbnail.setAttribute('role', 'button');
        thumbnail.setAttribute('aria-label', `Play video: ${title}`);
        thumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            }
        });
        
        thumbnail.appendChild(playButton);
        player.appendChild(thumbnail);
    });
}

// ===== SERVICES TABS =====
function initServicesTabs() {
    const tabBtns = document.querySelectorAll('.services-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.services-tabs .tab-content');
    
    if (!tabBtns.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Initialize first tab
    if (tabBtns.length > 0) {
        tabBtns[0].click();
    }
}

// ===== PASTOR SLIDER =====
function initPastorSlider() {
    const slides = document.querySelectorAll('.pastor-slide');
    const prevBtn = document.querySelector('.prev-pastor');
    const nextBtn = document.querySelector('.next-pastor');
    const indicators = document.querySelectorAll('.slider-indicators .indicator');
    
    if (!slides.length) return;
    
    const totalPastorSlides = slides.length;
    
    // Initialize first slide
    showPastorSlide(0);
    
    // Show specific slide
    function showPastorSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        
        // Activate corresponding indicator
        if (indicators.length > index) {
            indicators[index].classList.add('active');
        }
        
        pastorSlide = index;
    }
    
    // Next slide
    function nextPastorSlide() {
        pastorSlide = (pastorSlide + 1) % totalPastorSlides;
        showPastorSlide(pastorSlide);
    }
    
    // Previous slide
    function prevPastorSlide() {
        pastorSlide = (pastorSlide - 1 + totalPastorSlides) % totalPastorSlides;
        showPastorSlide(pastorSlide);
    }
    
    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPastorSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPastorSlide);
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showPastorSlide(index));
    });
    
    // Auto slide for pastor images
    setInterval(nextPastorSlide, 4000);
}

// ===== MODALS =====
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Open modal function
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modalOpen = true;
            
            // Hide any open dropdowns
            hideAllDropdowns();
            
            // Close mobile menu if open
            const mobileNav = document.getElementById('mobileNav');
            const hamburger = document.getElementById('hamburger');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalOpen = false;
        
        // Reset form containers to options
        const formContainers = modal.querySelectorAll('.form-container');
        const optionsContainers = modal.querySelectorAll('.modal-options');
        
        formContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        optionsContainers.forEach(container => {
            container.style.display = 'block';
        });
    }
    
    // Event listeners for modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) closeModal(modal);
        });
    });
    
    // Event listeners for back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const formContainer = modal.querySelector('.form-container');
                const optionsContainer = modal.querySelector('.modal-options');
                
                if (formContainer && optionsContainer) {
                    formContainer.style.display = 'none';
                    optionsContainer.style.display = 'block';
                }
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOpen) {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Prayer modal specific functionality
    setupPrayerModal();
    setupRegistrationModal();
}

// ===== PRAYER MODAL SETUP =====
function setupPrayerModal() {
    const whatsappPrayer = document.getElementById('whatsappPrayer');
    const emailPrayer = document.getElementById('emailPrayer');
    const formPrayer = document.getElementById('formPrayer');
    const backToPrayerOptions = document.getElementById('backToPrayerOptions');
    const prayerOptions = document.getElementById('prayerOptions');
    const prayerFormContainer = document.getElementById('prayerFormContainer');
    
    if (whatsappPrayer) {
        whatsappPrayer.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/233246498337?text=Hello!%20I%20would%20like%20to%20request%20prayer.', '_blank');
        });
    }
    
    if (emailPrayer) {
        emailPrayer.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'mailto:priesthoodfamilybiblecollege@gmail.com?subject=Prayer%20Request&body=Dear%20Prayer%20Team,%0A%0AI%20would%20like%20to%20request%20prayer%20for:%0A%0A1.%0A2.%0A3.%0A%0AName:%0APhone:%0AEmail:%0A%0AThank%20you.%0A';
        });
    }
    
    if (formPrayer && prayerOptions && prayerFormContainer) {
        formPrayer.addEventListener('click', function(e) {
            e.preventDefault();
            prayerOptions.style.display = 'none';
            prayerFormContainer.style.display = 'block';
        });
    }
    
    if (backToPrayerOptions && prayerOptions && prayerFormContainer) {
        backToPrayerOptions.addEventListener('click', function(e) {
            e.preventDefault();
            prayerOptions.style.display = 'block';
            prayerFormContainer.style.display = 'none';
        });
    }
}

// ===== REGISTRATION MODAL SETUP =====
function setupRegistrationModal() {
    const whatsappRegistration = document.getElementById('whatsappRegistration');
    const showRegistrationForm = document.getElementById('showRegistrationForm');
    const emailRegistrationBible = document.getElementById('emailRegistrationBible');
    const backToRegistrationOptions = document.getElementById('backToRegistrationOptions');
    const registrationOptions = document.getElementById('registrationOptions');
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    
    // Modal button from index.html
    const whatsappModalBtn = document.getElementById('whatsappModalBtn');
    const formModalBtn = document.getElementById('formModalBtn');
    const emailModalBtn = document.getElementById('emailModalBtn');
    const backToModalOptions = document.getElementById('backToModalOptions');
    
    // WhatsApp registration
    const whatsappHandlers = [whatsappRegistration, whatsappModalBtn];
    whatsappHandlers.forEach(handler => {
        if (handler) {
            handler.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://wa.me/233249172148?text=Hello!%20I%20would%20like%20to%20register%20for%20Bible%20College.', '_blank');
            });
        }
    });
    
    // Form registration
    const formHandlers = [showRegistrationForm, formModalBtn];
    formHandlers.forEach(handler => {
        if (handler && registrationOptions && registrationFormContainer) {
            handler.addEventListener('click', function(e) {
                e.preventDefault();
                registrationOptions.style.display = 'none';
                registrationFormContainer.style.display = 'block';
            });
        }
    });
    
    // Email registration
    const emailHandlers = [emailRegistrationBible, emailModalBtn];
    emailHandlers.forEach(handler => {
        if (handler) {
            handler.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'mailto:priesthoodfamilybiblecollege@gmail.com?subject=Bible%20College%20Registration&body=Dear%20Bible%20College%20Team,%0A%0AI%20am%20interested%20in%20registering%20for%20the%20Bible%20College%20program.%0A%0APlease%20send%20me%20more%20information.%0A%0AName:%0APhone:%0AEmail:%0ACurrent%20Ministry:%0A';
            });
        }
    });
    
    // Back to options
    const backHandlers = [backToRegistrationOptions, backToModalOptions];
    backHandlers.forEach(handler => {
        if (handler && registrationOptions && registrationFormContainer) {
            handler.addEventListener('click', function(e) {
                e.preventDefault();
                registrationOptions.style.display = 'block';
                registrationFormContainer.style.display = 'none';
            });
        }
    });
}

// ===== TOAST NOTIFICATIONS =====
function initToastNotifications() {
    // Toast container is already in HTML
}

function showToast(message, duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// ===== COPY BUTTONS =====
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn, .copy-momo-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number') || this.textContent.trim();
            
            // Create temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = number;
            document.body.appendChild(tempInput);
            
            // Select and copy text
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast('Number copied to clipboard!');
                } else {
                    showToast('Failed to copy. Please try again.');
                }
            } catch (err) {
                console.error('Copy failed:', err);
                showToast('Copy not supported. Please copy manually.');
            }
            
            // Remove temporary input
            document.body.removeChild(tempInput);
        });
    });
}

// ===== QUICK JOIN =====
// ===== QUICK JOIN - SIMPLIFIED WORKING VERSION =====
function initQuickJoin() {
    console.log('Initializing Quick Join...');
    
    // Mobile elements only (we're focusing on mobile)
    const mobileQuickJoin = document.getElementById('mobileQuickJoin');
    const mobileDropdown = document.getElementById('mobileQuickJoinDropdown');
    
    if (!mobileQuickJoin || !mobileDropdown) {
        console.log('Mobile join elements not found');
        return;
    }
    
    console.log('Found mobile join elements');
    
    // CRITICAL: Ensure dropdown starts hidden
    mobileDropdown.classList.remove('show');
    mobileDropdown.style.display = 'none';
    
    // Simple toggle function
    function toggleMobileDropdown() {
        console.log('Toggling dropdown...');
        console.log('Current display:', mobileDropdown.style.display);
        
        if (mobileDropdown.style.display === 'none' || !mobileDropdown.classList.contains('show')) {
            // Show dropdown
            mobileDropdown.classList.add('show');
            mobileDropdown.style.display = 'block';
            console.log('Dropdown shown');
        } else {
            // Hide dropdown
            mobileDropdown.classList.remove('show');
            mobileDropdown.style.display = 'none';
            console.log('Dropdown hidden');
        }
    }
    
    // Remove any existing event listeners
    const newButton = mobileQuickJoin.cloneNode(true);
    mobileQuickJoin.parentNode.replaceChild(newButton, mobileQuickJoin);
    
    // Get fresh button
    const freshButton = document.getElementById('mobileQuickJoin');
    
    // Add click event
    freshButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile join button clicked directly');
        toggleMobileDropdown();
    });
    
    // Also handle click from mobile FAB if it exists
    const mobileJoinFAB = document.querySelector('.mobile-fab.join-fab');
    if (mobileJoinFAB) {
        mobileJoinFAB.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile FAB join button clicked');
            freshButton.click(); // Trigger the main button
        });
    }
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileDropdown.contains(e.target) && 
            e.target !== freshButton && 
            !freshButton.contains(e.target) &&
            (!mobileJoinFAB || (e.target !== mobileJoinFAB && !mobileJoinFAB.contains(e.target)))) {
            
            if (mobileDropdown.style.display === 'block') {
                console.log('Clicked outside - hiding dropdown');
                mobileDropdown.classList.remove('show');
                mobileDropdown.style.display = 'none';
            }
        }
    });
}
// ===== YOUTUBE PLAYERS =====
function initYouTubePlayers() {
    const youtubePlayers = document.querySelectorAll('.youtube-player');
    
    youtubePlayers.forEach(player => {
        const videoId = player.getAttribute('data-id');
        const title = player.getAttribute('data-title');
        
        if (!videoId) return;
        
        // Create thumbnail with play button
        player.innerHTML = `
            <div class="youtube-thumbnail" style="background-image: url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `;
        
        // Add click event to open YouTube
        player.addEventListener('click', function() {
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        });
        
        // Set title as alt attribute for accessibility
        player.setAttribute('aria-label', `Play video: ${title}`);
        
        // Add keyboard support
        player.setAttribute('tabindex', '0');
        player.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            }
        });
    });
}

// ===== MOBILE FAB =====
function initMobileFAB() {
    const mobileFABContainer = document.querySelector('.mobile-fab-container');
    if (!mobileFABContainer) return;
    
    // Show FAB on mobile only
    function checkMobileFAB() {
        if (window.innerWidth <= 768) {
            mobileFABContainer.style.display = 'flex';
        } else {
            mobileFABContainer.style.display = 'none';
        }
    }
    
    // Initial check
    checkMobileFAB();
    
    // Check on resize
    window.addEventListener('resize', checkMobileFAB);
    
    // Prayer FAB
    const prayerFAB = document.querySelector('.mobile-fab.prayer-fab');
    if (prayerFAB) {
        prayerFAB.addEventListener('click', function() {
            // Open prayer modal
            const modalTriggers = document.querySelectorAll('[data-modal="prayerModal"]');
            if (modalTriggers.length > 0) {
                modalTriggers[0].click();
            }
        });
    }
    
    // Join FAB - Updated to work with initQuickJoin
    const joinFAB = document.querySelector('.mobile-fab.join-fab');
    if (joinFAB) {
        joinFAB.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Trigger the mobile quick join functionality
            const mobileQuickJoin = document.getElementById('mobileQuickJoin');
            if (mobileQuickJoin) {
                mobileQuickJoin.click();
            }
        });
    }
}

// ===== GALLERY FUNCTIONALITY =====
function initGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Define gallery data
    const galleryData = {
        'NG': { name: 'Grace Ministry', count: 10, images: [] },
        'NL': { name: 'Love Ministry', count: 10, images: [] },
        'NC': { name: 'Choir & Music', count: 10, images: [] },
        'CM': { name: 'Children Ministry', count: 10, images: [] },
        'YT': { name: 'Youth Ministry', count: 10, images: [] },
        'EV': { name: 'Special Events', count: 10, images: [] }
    };
    
    // Generate gallery items
    function generateGalleryItems() {
        let allItems = [];
        let itemNumber = 1;
        
        Object.keys(galleryData).forEach(category => {
            const cat = galleryData[category];
            
            for (let i = 1; i <= cat.count; i++) {
                const formattedNumber = i.toString().padStart(3, '0');
                const imagePath = `images/${category}_${formattedNumber}.jpg`;
                const fallbackPath = 'images/placeholder.jpg';
                
                allItems.push({
                    category: category,
                    number: i,
                    formattedNumber: formattedNumber,
                    image: imagePath,
                    fallback: fallbackPath,
                    name: cat.name,
                    displayNumber: itemNumber
                });
                
                itemNumber++;
            }
        });
        
        return allItems;
    }
    
    // Display gallery items
    function displayGalleryItems(items) {
        if (items.length === 0) {
            galleryContainer.innerHTML = `
                <div class="gallery-empty">
                    <i class="fas fa-images"></i>
                    <h3>No photos found</h3>
                    <p>Photos will appear here as they are added to the gallery.</p>
                    <p style="margin-top: 20px;">
                        <a href="#photo-contribution" class="btn btn-primary">
                            <i class="fas fa-camera"></i> Share Your Photos
                        </a>
                    </p>
                </div>
            `;
            return;
        }
        
        galleryContainer.innerHTML = '';
        
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-number', item.number);
            
            galleryItem.innerHTML = `
                <div class="gallery-number">${item.displayNumber}</div>
                <div class="gallery-category">${item.category}</div>
                <img src="${item.image}" 
                     alt="${item.name} - Photo ${item.formattedNumber}" 
                     class="gallery-image"
                     loading="lazy"
                     onerror="this.src='${item.fallback}'; this.onerror=null;">
                <div class="gallery-overlay">
                    <h3>${item.name}</h3>
                    <p>Photo ${item.formattedNumber}</p>
                </div>
            `;
            
            galleryContainer.appendChild(galleryItem);
        });
    }
    
    // Filter gallery
    function filterGallery(filter) {
        const allItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
        
        allItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Update filter counts
    function updateFilterCounts() {
        const allItems = generateGalleryItems();
        const counts = {};
        
        allItems.forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        
        const totalCount = allItems.length;
        
        // Update filter button text with counts
        filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const countSpan = btn.querySelector('.filter-count');
            
            if (countSpan) {
                if (filter === 'all') {
                    countSpan.textContent = totalCount;
                } else {
                    countSpan.textContent = counts[filter] || 0;
                }
            }
        });
    }
    
    // Initialize gallery
    const allItems = generateGalleryItems();
    displayGalleryItems(allItems);
    updateFilterCounts();
    
    // Filter button events
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                const filter = this.getAttribute('data-filter');
                filterGallery(filter);
            });
        });
    }
}

// ===== BIBLE COLLEGE FUNCTIONALITY =====
function initBibleCollege() {
    // Bible College specific buttons
    const whatsappBibleCollege = document.getElementById('whatsappBibleCollege');
    const formRegistrationBible = document.getElementById('formRegistrationBible');
    const emailRegistrationBible = document.getElementById('emailRegistrationBible');
    
    if (whatsappBibleCollege) {
        whatsappBibleCollege.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/233249172148?text=Hello!%20I%20would%20like%20to%20register%20for%20Bible%20College.', '_blank');
        });
    }
    
    if (formRegistrationBible) {
        formRegistrationBible.addEventListener('click', function(e) {
            e.preventDefault();
            // Open registration modal
            const modalTriggers = document.querySelectorAll('[data-modal="registrationModal"]');
            if (modalTriggers.length > 0) {
                modalTriggers[0].click();
            }
        });
    }
    
    if (emailRegistrationBible) {
        emailRegistrationBible.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'mailto:priesthoodfamilybiblecollege@gmail.com?subject=Bible%20College%20Registration&body=Dear%20Bible%20College%20Team,%0A%0AI%20am%20interested%20in%20registering%20for%20the%20Bible%20College%20program.%0A%0APlease%20send%20me%20more%20information.%0A%0AName:%0APhone:%0AEmail:%0ACurrent%20Ministry:%0A';
        });
    }
    
    // Force course duration styling
    document.querySelectorAll('.course-duration').forEach(element => {
        element.style.background = '#FFD700';
        element.style.color = '#000000';
        element.style.fontWeight = '700';
        element.style.padding = '8px 12px';
        element.style.borderRadius = '5px';
        element.style.display = 'inline-block';
        element.style.marginTop = '10px';
        element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });
}

// ===== SET ACTIVE NAVIGATION =====
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    if (currentPage === 'index.html' || currentPage === '') {
        document.querySelectorAll('a[href="index.html"]').forEach(link => {
            link.classList.add('active');
        });
    } else if (currentPage === 'bible-college.html') {
        document.querySelectorAll('a[href="bible-college.html"]').forEach(link => {
            link.classList.add('active');
        });
    } else if (currentPage === 'gallery.html') {
        document.querySelectorAll('a[href="gallery.html"]').forEach(link => {
            link.classList.add('active');
        });
    }
}

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const mobileNav = document.getElementById('mobileNav');
        const hamburger = document.getElementById('hamburger');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            hamburger.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    }
});

// ===== SCROLL TO TOP BUTTON =====
// Create scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: var(--black-color);
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        box-shadow: var(--shadow-md);
        transition: var(--transition);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hide on mobile when FABs are shown
    if (window.innerWidth <= 768) {
        scrollBtn.style.display = 'none';
    }
    
    // Update on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            scrollBtn.style.display = 'none';
        } else if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ===== IMAGE LAZY LOADING =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Call this in DOMContentLoaded
console.log('All scripts loaded successfully');
document.addEventListener('DOMContentLoaded', function () {
    // Handle loading animation
    const loadingAnimation = document.querySelector('.loading-animation');
    
    window.addEventListener('load', function() {
        // Add the hidden class to hide loading animation when page is fully loaded
        setTimeout(function() {
            loadingAnimation.classList.add('hidden');
            // Remove from DOM after transition completes
            setTimeout(function() {
                loadingAnimation.style.display = 'none';
            }, 500);
        }, 1000); // Add a small delay for better user experience
    });
    
    // Implement lazy loading for images
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        // Use dataset.src if available, otherwise keep the original src
                        if (image.dataset.src) {
                            image.src = image.dataset.src;
                        }
                        image.classList.add('lazy-loaded');
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            let lazyLoadThrottleTimeout;
            
            function lazyLoad() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }
                
                lazyLoadThrottleTimeout = setTimeout(() => {
                    const scrollTop = window.pageYOffset;
                    
                    lazyImages.forEach(img => {
                        if (img.offsetTop < window.innerHeight + scrollTop) {
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            img.classList.add('lazy-loaded');
                        }
                    });
                    
                    if (lazyImages.length === 0) {
                        document.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationChange', lazyLoad);
                    }
                }, 20);
            }
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationChange', lazyLoad);
        }
    }
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        mirror: true,
        disable: 'mobile'
    });
    
    // Performance counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-value');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 16); // Approximately 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // Chat bubble functionality
    function initChatBubble() {
        const chatButton = document.getElementById('chat-button');
        const chatBubble = document.getElementById('chat-bubble');
        const chatClose = document.getElementById('chat-close');
        
        if (chatButton && chatBubble && chatClose) {
            chatButton.addEventListener('click', function() {
                chatBubble.classList.toggle('active');
                playSound(clickSound);
            });
            
            chatClose.addEventListener('click', function() {
                chatBubble.classList.remove('active');
                playSound(clickSound);
            });
            
            // Show chat bubble after 5 seconds
            setTimeout(() => {
                chatBubble.classList.add('active');
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                    if (chatBubble.classList.contains('active')) {
                        chatBubble.classList.remove('active');
                    }
                }, 10000);
            }, 5000);
        }
    }
    
    // Car configurator price calculation
    function initConfigurator() {
        const modelChoices = document.querySelectorAll('.config-choice[data-model]');
        const wheelChoices = document.querySelectorAll('.config-choice[data-wheels]');
        const packageChoices = document.querySelectorAll('.config-choice[data-package]');
        const priceDisplay = document.getElementById('config-price');
        
        if (priceDisplay) {
            // Store selected options
            let selectedOptions = {
                model: { price: 37000 },
                wheels: { price: 0 },
                package: { price: 0 }
            };
            
            // Update price display
            function updatePrice() {
                const totalPrice = selectedOptions.model.price + 
                                  selectedOptions.wheels.price + 
                                  selectedOptions.package.price;
                
                try {
                    const formattedPrice = new Intl.NumberFormat('en-US').format(totalPrice);
                    priceDisplay.textContent = formattedPrice;
                } catch (error) {
                    // Fallback if Intl.NumberFormat fails
                    priceDisplay.textContent = totalPrice.toString();
                    console.error('Error formatting price:', error);
                }
            }
            
            // Handle model selection
            modelChoices.forEach(choice => {
                choice.addEventListener('click', function() {
                    modelChoices.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const priceValue = this.getAttribute('data-price');
                    selectedOptions.model.price = priceValue ? parseInt(priceValue, 10) || 0 : 0;
                    updatePrice();
                    playSound(clickSound);
                });
            });
            
            // Handle wheels selection
            wheelChoices.forEach(choice => {
                choice.addEventListener('click', function() {
                    wheelChoices.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const priceValue = this.getAttribute('data-price');
                    selectedOptions.wheels.price = priceValue ? parseInt(priceValue, 10) || 0 : 0;
                    updatePrice();
                    playSound(clickSound);
                });
            });
            
            // Handle package selection
            packageChoices.forEach(choice => {
                choice.addEventListener('click', function() {
                    packageChoices.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const priceValue = this.getAttribute('data-price');
                    selectedOptions.package.price = priceValue ? parseInt(priceValue, 10) || 0 : 0;
                    updatePrice();
                    playSound(clickSound);
                });
            });
            
            // Initialize with default price
            updatePrice();
        }
    }
    
    // Select elements
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('section');
    const parallaxElements = document.querySelectorAll('.parallax');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverSound = document.getElementById('hover-sound');
    const clickSound = document.getElementById('click-sound');
    const engineSound = document.getElementById('engine-sound');
    const soundToggle = document.querySelector('.sound-toggle');
    const pageTransition = document.querySelector('.page-transition');
    
    // Page transition effect
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageTransition.classList.add('complete');
        }, 500);
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        playSound(clickSound);
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Header background on scroll
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop;
                
                window.scrollTo({
                    top: targetPosition - 80,
                    behavior: 'smooth'
                });
                
                playSound(clickSound);
            }
        });
    });
    
    // Sound effects
    let soundEnabled = false;
    
    function playSound(sound) {
        if (soundEnabled && sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
    
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            // Play a short engine sound when enabled
            engineSound.volume = 0.3;
            engineSound.play();
        } else {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        
        playSound(clickSound);
    });
    
    // Update progress bar based on scroll position
    function updateProgressBar() {
        const scrollPosition = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollPosition / totalHeight) * 100;
        
        progressBar.style.width = progress + '%';
    }
    
    // Update active section in navigation
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && sectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Parallax effect
    function updateParallax() {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(window.scrollY * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Custom cursor
    function updateCursor(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }
    
    document.addEventListener('mousemove', updateCursor);
    
    // Cursor hover effect
    const cursorHoverElements = document.querySelectorAll('a, button, .model-card, .gallery-item, .feature-hotspot');
    
    cursorHoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
            playSound(hoverSound);
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    });
    
    // Generate gallery images with categories
    const galleryImages = [
        { src: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1000', category: 'exterior', title: 'Front View' },
        { src: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000', category: 'exterior', title: 'Side Profile' },
        { src: 'https://images.unsplash.com/photo-1581650107963-3e8c1f48241b?q=80&w=1000', category: 'exterior', title: 'Rear Angle' },
        { src: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1000', category: 'interior', title: 'Dashboard' },
        { src: 'https://images.unsplash.com/photo-1547245324-ae59aefc4011?q=80&w=1000', category: 'details', title: 'Taillight Detail' },
        { src: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=1000', category: 'details', title: 'Wheel & Brake' },
        { src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000', category: 'interior', title: 'Steering Wheel' },
        { src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000', category: 'exterior', title: 'Night Shot' },
        { src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000', category: 'details', title: 'Engine Bay' }
    ];
    
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryFilters = document.querySelectorAll('.filter-btn');
    
    // Populate gallery with images
    function populateGallery(filterCategory = 'all') {
        galleryGrid.innerHTML = '';
        
        galleryImages.forEach((image, index) => {
            if (filterCategory === 'all' || image.category === filterCategory) {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.setAttribute('data-aos', 'fade-up');
                galleryItem.setAttribute('data-aos-delay', (index % 5) * 100);
                galleryItem.setAttribute('data-category', image.category);
                
                galleryItem.innerHTML = `
                    <img src="${image.src}" alt="${image.title}">
                    <div class="gallery-overlay">
                        <div class="gallery-overlay-content">
                            <h3 class="gallery-overlay-title">${image.title}</h3>
                            <p class="gallery-overlay-subtitle">${image.category}</p>
                        </div>
                        <i class="fas fa-search-plus"></i>
                    </div>
                `;
                
                galleryGrid.appendChild(galleryItem);
            }
        });
        
        initLightbox();
    }
    
    // Initialize gallery with all images
    populateGallery();
    
    // Gallery filters
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            galleryFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            populateGallery(filterValue);
            playSound(clickSound);
        });
    });
    
    // Lightbox functionality
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    let filteredImages = [];
    
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const category = this.getAttribute('data-category');
                
                // Get all visible images based on current filter
                filteredImages = galleryImages.filter(img => {
                    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    return activeFilter === 'all' || img.category === activeFilter;
                });
                
                // Find the index of clicked image in filtered array
                currentImageIndex = filteredImages.findIndex(img => img.src === imgSrc);
                
                openLightbox(imgSrc);
                playSound(clickSound);
            });
        });
    }
    
    function openLightbox(imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        lightboxImg.src = filteredImages[currentImageIndex].src;
        playSound(clickSound);
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        lightboxImg.src = filteredImages[currentImageIndex].src;
        playSound(clickSound);
    }
    
    lightboxClose.addEventListener('click', () => {
        closeLightbox();
        playSound(clickSound);
    });
    
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });
    
    // Feature hotspots
    const featureHotspots = document.querySelectorAll('.feature-hotspot');
    const featureDetails = document.querySelectorAll('.feature-detail');
    
    featureHotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            
            featureHotspots.forEach(h => h.classList.remove('active'));
            featureDetails.forEach(d => d.classList.remove('active'));
            
            this.classList.add('active');
            document.querySelector(`.feature-detail[data-feature="${feature}"]`).classList.add('active');
            
            playSound(clickSound);
        });
    });
    
    // Tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.querySelector(`.tab-panel[data-tab="${tabId}"]`).classList.add('active');
            
            playSound(clickSound);
        });
    });
    
    // Form submission
    const testDriveForm = document.getElementById('test-drive-form');
    
    if (testDriveForm) {
        testDriveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const model = this.querySelector('#model').value;
            
            // Simple form validation
            if (name && email) {
                // In production, this would send data to server
                const formSubmitMsg = document.createElement('div');
                formSubmitMsg.className = 'form-submit-msg success';
                formSubmitMsg.innerHTML = `<p>Thank you ${name}! Your test drive request for the ${model.toUpperCase()} has been submitted. We'll contact you soon at ${email}.</p>`;
                
                testDriveForm.innerHTML = '';
                testDriveForm.appendChild(formSubmitMsg);
                
                playSound(engineSound);
            }
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    
    function updateBackToTopBtn() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    }
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        playSound(clickSound);
    });
    
    // Generate and animate particles
    const particlesContainer = document.querySelector('.particles-container');
    
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position, size and animation duration
            const size = Math.random() * 8 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 15 + 5;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Performance metrics animation
    const circularProgress = document.querySelectorAll('.circular-progress');
    
    function animateCircles() {
        circularProgress.forEach(circle => {
            const percentage = circle.getAttribute('data-percentage');
            const radius = circle.getAttribute('r');
            const circumference = 2 * Math.PI * radius;
            
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
        });
    }
    
    // Initialize Swiper for models
    function initModelSwiper() {
        if (typeof Swiper !== 'undefined') {
            // Pre-load the model images before initializing Swiper
            const modelImages = document.querySelectorAll('.model-card .model-image img');
            let loadedImages = 0;
            
            // Force load all model images immediately 
            modelImages.forEach(img => {
                if (img.dataset.src) {
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        img.src = img.dataset.src;
                        img.classList.add('lazy-loaded');
                        loadedImages++;
                        
                        // Initialize Swiper only after all images are loaded
                        if (loadedImages === modelImages.length) {
                            // Now initialize the Swiper
                            const modelSwiper = new Swiper('.model-swiper', {
                                slidesPerView: 1,
                                spaceBetween: 30,
                                loop: true,
                                speed: 800,
                                autoplay: {
                                    delay: 5000,
                                    disableOnInteraction: false
                                },
                                pagination: {
                                    el: '.swiper-pagination',
                                    clickable: true
                                },
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev'
                                },
                                breakpoints: {
                                    768: {
                                        slidesPerView: 2
                                    },
                                    1200: {
                                        slidesPerView: 3
                                    }
                                },
                                on: {
                                    init: function() {
                                        setTimeout(() => {
                                            document.querySelector('.model-swiper').classList.add('swiper-initialized');
                                        }, 100);
                                    }
                                }
                            });
                        }
                    };
                    tempImg.src = img.dataset.src;
                }
            });
        }
    }

    // Color customizer
    const colorOptions = document.querySelectorAll('.color-option');
    const colorPreviewImg = document.getElementById('color-preview-img');
    
    if (colorOptions.length > 0 && colorPreviewImg) {
        const carColors = {
            red: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1000',
            blue: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
            black: 'https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed?q=80&w=1000',
            silver: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
            orange: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1000'
        };
        
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                colorPreviewImg.src = carColors[color];
                playSound(clickSound);
            });
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', function() {
        updateHeader();
        updateProgressBar();
        updateActiveSection();
        updateParallax();
        updateBackToTopBtn();
    });
    
    window.addEventListener('resize', function() {
        updateProgressBar();
    });
    
    // Mouse movement for parallax in hero section
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) { // Only on desktop
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                const moveX = (mouseX - 0.5) * 20;
                const moveY = (mouseY - 0.5) * 20;
                heroBackground.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        }
    });
    
    // Initialize functions on page load
    updateHeader();
    updateProgressBar();
    updateActiveSection();
    updateParallax();
    createParticles();
    
    if (circularProgress.length > 0) {
        animateCircles();
    }
    
    // Add active class to first feature hotspot and detail
    if (featureHotspots.length > 0 && featureDetails.length > 0) {
        featureHotspots[0].classList.add('active');
        featureDetails[0].classList.add('active');
    }
    
    // Load 360 view images on demand
    const view360Slider = document.getElementById('view-360-slider');
    const view360Img = document.getElementById('view-360-img');
    
    if (view360Slider && view360Img) {
        view360Slider.addEventListener('input', function() {
            // Simulate 360 view by slightly changing the angle of the same image
            // In production, you would have 36 different angle shots
            const angle = parseInt(this.value);
            view360Img.style.transform = `rotateY(${angle * 10}deg)`;
        });
    }
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Call all initialization functions
    animateCounters();
    initChatBubble();
    initConfigurator();
    initModelSwiper();
});
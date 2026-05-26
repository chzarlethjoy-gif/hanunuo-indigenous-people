// ===== CONSTANTS & CONFIGURATION =====
const CONFIG = {
    scrollThreshold: 80,
    fadeInDistance: 100,
    particleCount: 50,
    scrollAnimationSpeed: 0.8
};

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const heroCanvas = document.getElementById('heroCanvas');
const heroParticles = document.getElementById('heroParticles');

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Update navbar on scroll
    window.addEventListener('scroll', updateNavbar);
}

function updateNavbar() {
    if (window.scrollY > CONFIG.scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== PROGRESS BAR =====
function updateProgressBar() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${scrollPercent}%`;
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== HERO CANVAS ANIMATION =====
function initializeHeroCanvas() {
    if (!heroCanvas) return;

    const ctx = heroCanvas.getContext('2d');
    const particles = [];
    const mouse = { x: 0, y: 0 };

    function resizeCanvas() {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.originalOpacity = this.opacity;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around
            if (this.x < 0) this.x = heroCanvas.width;
            if (this.x > heroCanvas.width) this.x = 0;
            if (this.y < 0) this.y = heroCanvas.height;
            if (this.y > heroCanvas.height) this.y = 0;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            if (distance < maxDistance) {
                this.opacity = this.originalOpacity + (1 - distance / maxDistance) * 0.5;
            } else {
                this.opacity = this.originalOpacity;
            }
        }

        draw(ctx) {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initialize() {
        particles.length = 0;
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // Draw connections
        particles.forEach((particle, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initialize();
    animate();
}

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
}

// ===== PARALLAX EFFECT =====
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        document.querySelectorAll('.image-frame img').forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            if (elementTop < window.innerHeight && elementTop + elementHeight > 0) {
                const parallaxValue = (window.innerHeight - elementTop) * 0.1;
                element.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }, { passive: true });
}

// ===== GALLERY INTERACTION =====
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const img = item.querySelector('img');
            
            if (title && img) {
                // Open in lightbox or modal (you can expand this)
                console.log('Gallery item clicked:', title);
            }
        });

        // Add hover animations
        item.addEventListener('mouseenter', () => {
            item.style.filter = 'brightness(1.1)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.filter = 'brightness(1)';
        });
    });
}

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== TYPING EFFECT FOR HERO TITLE =====
function initializeTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.getAttribute('data-text') || line.textContent;
        line.textContent = '';
        
        let charIndex = 0;
        const delay = index * 100;
        
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, delay);
    });
}

// ===== SCROLL ANIMATION FOR SECTIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.fade-in-up').forEach((element, index) => {
                    setTimeout(() => {
                        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// ===== CUSTOM CURSOR =====
function initializeCustomCursor() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="6" fill="%23d4af37" opacity="0.8"/><circle cx="16" cy="16" r="10" fill="none" stroke="%23d4af37" stroke-width="1.5" opacity="0.5"/></svg>') 16 16, auto;
        }
        a, button, [role="button"] {
            cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="8" fill="%23d4af37"/></svg>') 16 16, pointer;
        }
    `;
    document.head.appendChild(style);
}

// ===== PERFORMANCE OPTIMIZATION - LAZY LOADING =====
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== MOBILE TOUCH INTERACTIONS =====
function initializeTouchInteractions() {
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        // Show/hide progress bar on swipe
        if (Math.abs(diff) > 100) {
            if (diff > 0) {
                // Swiped up
                progressBar.style.opacity = '1';
            } else {
                // Swiped down
                progressBar.style.opacity = '0.5';
            }
        }
    });
}

// ===== THEME ENHANCEMENT - ADD GLOW EFFECTS =====
function initializeGlowEffects() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glow-pulse {
            0%, 100% {
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.05);
            }
            50% {
                box-shadow: 0 0 40px rgba(212, 175, 55, 0.5), inset 0 0 30px rgba(212, 175, 55, 0.1);
            }
        }

        .hero-badge {
            animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navMenu.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== PERFORMANCE MONITORING =====
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            }, 0);
        });
    }
}

// ===== SCROLL EVENT HANDLER (OPTIMIZED) =====
let lastScrollTime = 0;
let scrollTimeout;

function handleScroll() {
    const now = Date.now();
    
    if (now - lastScrollTime > 10) {
        updateProgressBar();
        lastScrollTime = now;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Window resized');
    }, 250);
}, { passive: true });

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Hanunuo Mangyan Heritage Website');

    // Initialize all features
    initializeNavbar();
    initializeBackToTop();
    initializeHeroCanvas();
    initializeIntersectionObserver();
    initializeParallax();
    initializeGallery();
    initializeSmoothScroll();
    initializeTypingEffect();
    initializeScrollAnimations();
    initializeCustomCursor();
    initializeTouchInteractions();
    initializeGlowEffects();
    initializeKeyboardNavigation();
    initializeExpandableText();
    logPerformanceMetrics();

    // Initial updates
    updateProgressBar();
    updateNavbar();

    console.log('✓ Heritage website initialized successfully');
});

function initializeExpandableText() {
    const selectors = [
        '.social-card',
        '.political-card',
        '.economic-card',
        '.religion-card',
        '.issue-card',
        '.reflection-box'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(card => {
        const heading = card.querySelector('h4, h3');
        if (!heading) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'collapsible-content';

        let next = heading.nextSibling;
        let movedAny = false;

        while (next) {
            const current = next;
            next = current.nextSibling;
            wrapper.appendChild(current);
            movedAny = true;
        }

        if (!movedAny) return;

        card.appendChild(wrapper);

        if (wrapper.scrollHeight <= 260) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'collapse-toggle';
        toggle.textContent = 'See more';

        toggle.addEventListener('click', () => {
            const expanded = wrapper.classList.toggle('expanded');
            toggle.textContent = expanded ? 'See less' : 'See more';

            if (!expanded) {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        card.appendChild(toggle);
    });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function for optimized event handling
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for consistent event handling
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Add animation class to elements
 */
function animateElement(element, animationName, duration = 600) {
    element.style.animation = `${animationName} ${duration}ms ease-out forwards`;
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(element, offset = 80) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
}

/**
 * Add class with delay
 */
function addClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

// ===== ADDITIONAL INTERACTIVE FEATURES =====

/**
 * Gallery Modal functionality for videos and detailed content
 */
function initializeGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const videoUrl = item.getAttribute('data-video');
            const copy = item.getAttribute('data-copy');
            
            if (title) {
                // Create modal content
                const modal = document.createElement('div');
                modal.className = 'gallery-modal active';
                modal.innerHTML = `
                    <div class="modal-content">
                        <button class="modal-close" aria-label="Close modal">✕</button>
                        <div class="modal-inner">
                            ${videoUrl ? `<iframe class="modal-video" src="${getYouTubeEmbedUrl(videoUrl)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : ''}
                            <h2>${title}</h2>
                            <div class="modal-text">${copy || 'Click on an item to view more details.'}</div>
                        </div>
                    </div>
                `;
                
                // Add to body
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                // Close button functionality
                const closeBtn = modal.querySelector('.modal-close');
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                        document.body.style.overflow = '';
                    }, 300);
                });
                
                // Close on background click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        setTimeout(() => {
                            modal.remove();
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
                
                // Close on Escape
                const escapeHandler = (e) => {
                    if (e.key === 'Escape') {
                        modal.classList.remove('active');
                        setTimeout(() => {
                            modal.remove();
                            document.body.style.overflow = '';
                            document.removeEventListener('keydown', escapeHandler);
                        }, 300);
                    }
                };
                document.addEventListener('keydown', escapeHandler);
            }
        });
    });
}

/**
 * Convert YouTube URL to embed URL
 */
function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url, window.location.href);
        const host = parsed.hostname.replace('www.', '');
        if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (parsed.pathname.startsWith('/embed/')) return url;
            const videoId = parsed.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (error) {
        console.error('Error parsing YouTube URL:', error);
    }
    return url;
}

/**
 * Add copy-to-clipboard functionality for references
 */
function initializeReferenceCopy() {
    const referenceItems = document.querySelectorAll('.reference-item');
    
    referenceItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            const text = item.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const originalBg = item.style.background;
                item.style.background = 'rgba(212, 175, 55, 0.2)';
                setTimeout(() => {
                    item.style.background = originalBg;
                }, 500);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGalleryModal();
    initializeReferenceCopy();
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

/**
 * Add focus visible styling
 */
function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

initializeAccessibility();

// ===== PRINT FRIENDLY =====
window.addEventListener('beforeprint', () => {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
});

window.addEventListener('afterprint', () => {
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
});

// ===== COOKIE/STORAGE UTILITIES =====

/**
 * Save user preference
 */
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage not available:', e);
    }
}

/**
 * Get user preference
 */
function getUserPreference(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.warn('LocalStorage not available:', e);
        return defaultValue;
    }
}

// Save that user has visited
saveUserPreference('hasVisited', true);

console.log('%c🌿 Hanunuo Mangyan Heritage Website', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%cPreserving Indigenous Culture & Traditions', 'color: #c9b8a6; font-size: 12px;');

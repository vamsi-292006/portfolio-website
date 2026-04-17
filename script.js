document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor & Magnetic Buttons ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Delay for outline to create smooth trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 100, fill: "forwards" });
    });

    const magneticElements = document.querySelectorAll('.hover-magnetic, a, button');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // --- 2. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Default is dark from HTML class. Toggle logic:
    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        // Update particles color based on theme
        const isDark = htmlElement.classList.contains('dark');
        updateParticlesConfig(isDark);
    });

    // --- 3. Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        document.querySelector('.progress-bar').style.width = scrollPercentage + '%';
    });

    // --- 4. Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    });

    // --- 5. Typewriter Effect ---
    const words = ["Competitive Programmer", "Machine Learning Enthusiast", "Hackathon Addict"];
    let i = 0;
    let timer;

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                document.getElementById('typewriter').innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                document.getElementById('typewriter').innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) { i++; } else { i = 0; }
                setTimeout(typingEffect, 500);
                return false;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }
    setTimeout(typingEffect, 1000);

    // --- 6. Particles.js Initialization ---
    function updateParticlesConfig(isDark) {
        const pColor = isDark ? "#10b981" : "#0ea5e9";
        const lColor = isDark ? "#ffffff" : "#000000";
        
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": pColor },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": lColor, "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
    // Initialize particles (default dark)
    updateParticlesConfig(true);

    // --- 7. GSAP ScrollTriggers ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    gsap.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from(".profile-wrapper", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    // Reveal Up Animation for Sections
    const revealElements = document.querySelectorAll(".reveal-up");
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Section Header Animations
    const headers = document.querySelectorAll(".section-header");
    headers.forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // --- 8. REAL Contact Form Logic (Formspree) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // User's Provided Formspree endpoint
    const FORMSPREE_URL = "https://formspree.io/f/mnjldvaj"; 

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents page reload
        
        // Button loading state animation
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.style.opacity = '0.8';
        btn.disabled = true;

        // Collect form data
        const formData = new FormData(contactForm);

        try {
            // Send data to Formspree
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                
                formStatus.classList.remove('hidden');
                formStatus.textContent = "Thanks! Your message has been sent. I'll reply soon.";
                formStatus.className = "text-center font-medium mt-4 text-accent block";
                
                contactForm.reset(); 
                
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            // Error handling
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            
            formStatus.classList.remove('hidden');
            formStatus.textContent = "Oops! Something went wrong. Please email me directly at vamsipedda55@gmail.com";
            formStatus.className = "text-center font-medium mt-4 text-red-500 block";
        }
    });
});
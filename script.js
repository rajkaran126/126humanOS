document.addEventListener('DOMContentLoaded', () => {
    // --- LOADING SCREEN LOGIC ---
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressFill = document.getElementById('progress-fill');
    const syncPercentage = document.getElementById('sync-percentage');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        const increment = Math.random() * 5 + 1;
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                mainContent.classList.add('visible');
            }, 500);
        }
        
        progressFill.style.width = `${progress}%`;
        syncPercentage.textContent = `${progress.toFixed(1)}%`;
        
    }, 50);

    // --- CANVAS BACKGROUND ANIMATION ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold particles
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }

    let time = 0;
    function animateBackground() {
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        time += 0.005;

        // Outer rotating dashed ring
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time);
        ctx.beginPath();
        ctx.setLineDash([15, 20]);
        ctx.arc(0, 0, Math.min(width, height) * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)'; // Icy blue
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Inner solid glowing ring
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(width, height) * 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)'; // Gold glow
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.setLineDash([]);
        for(let i = -width; i < width; i+= 50) {
            ctx.moveTo(i, -height);
            ctx.lineTo(i, height);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    // --- SCROLL ANIMATIONS ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.glass-card, .metric-row, .identity-text');
    animateElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // --- GLARE EFFECT ---
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, rgba(10,10,10,0.6) 60%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(10, 10, 10, 0.6)';
        });
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

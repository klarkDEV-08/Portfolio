// ===== CONFIGURAÇÕES E CONSTANTES =====
const CONFIG = {
    THEME_KEY: 'theme', // Alinhado com o que você usa no localStorage
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 80
};

class Portfolio {
    constructor() {
        // Inicializa as propriedades antes de rodar a lógica
        this.themeToggle = document.getElementById('alterar-tema');
        this.themeIcon = document.querySelector('.icone-tema i');
        
        this.init();
    }

    init() {
        this.initTheme(); // Rodar primeiro para evitar flash de cor branca
        this.setupEventListeners();
        this.initScrollAnimations();
        this.initSmoothScrolling();
        this.initContactForm();
        this.initTypingEffect();
    }

    // ===== GERENCIAMENTO DE TEMA CORRIGIDO =====
    initTheme() {
        if (!this.themeToggle) return;

        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
        const body = document.body;

        // Aplica o tema salvo imediatamente
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            if (this.themeIcon) this.themeIcon.className = 'fa-solid fa-moon';
        }

        this.themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            localStorage.setItem(CONFIG.THEME_KEY, isDark ? 'dark' : 'light');
            
            if (this.themeIcon) {
                this.themeIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            }
            
            this.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => this.themeToggle.style.transform = 'scale(1)', 150);
        });
    }

    // ===== ANIMAÇÕES DE SCROLL =====
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('about-stats')) {
                        this.animateStats();
                    }
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.about, .skills, .projects, .experience, .contact, .project-card, .timeline-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            if (stat.dataset.animated) return; // Evita repetir a animação
            stat.dataset.animated = true;

            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, 50);
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('.nav-link, .btn[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - CONFIG.SCROLL_OFFSET,
                        behavior: 'smooth'
                    });
                }
            });
        });
        this.initActiveNavigation();
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + CONFIG.SCROLL_OFFSET + 100;
            sections.forEach(section => {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
                    });
                }
            });
        });
    }

    initTypingEffect() {
        const highlight = document.querySelector('.hero-title .highlight');
        if (!highlight) return;

        const text = highlight.textContent;
        highlight.textContent = '';
        let i = 0;

        const timer = setInterval(() => {
            if (i < text.length) {
                highlight.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }

    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    async handleFormSubmission(form) {
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        // Simulação de envio
        await new Promise(r => setTimeout(r, 1500));
        this.showNotification('Mensagem enviada!', 'success');
        form.reset();
        
        btn.textContent = originalText;
        btn.disabled = false;
    }

    showNotification(msg, type) {
        const note = document.createElement('div');
        note.className = `notification`;
        note.style.cssText = `position:fixed; top:20px; right:20px; padding:15px; background:#10b981; color:white; border-radius:5px; z-index:9999;`;
        note.textContent = msg;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.debounce(() => {
            console.log('Resized');
        }, 250));
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Inicialização única
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});
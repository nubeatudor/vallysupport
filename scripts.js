/**
 * Vally's Afterhours Support - Master Logic 3.5
 * Features: High-Density White Particles, Seamless Scroll Transition, GDPR Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CORE ELEMENTS ---
    const header = document.getElementById('siteHeader');
    const modal = document.getElementById('vs-consent');
    const yearEl = document.getElementById('year');
    const leadForm = document.getElementById('leadForm');
    const navLinks = document.querySelectorAll('.nav-link');

    // Reset scroll lock safety
    document.body.style.overflow = '';

    // --- 2. HIGH-VISIBILITY PARTICLES ---
    const initParticles = () => {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        // Increased count to 140 for a very busy, visible network
        for (let i = 0; i < 140; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                size: Math.random() * 2 + 1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.x += p.vx; 
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                // Draw Solid White Dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.85)"; 
                ctx.fill();

                // Draw Connecting Lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    
                    if (dist < 115) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * (1 - dist / 115)})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };
        animate();
    };
    
    window.addEventListener('load', initParticles);

    // --- 3. NAVBAR SCROLL TRANSITION (No Outline Fix) ---
    const handleNavbar = () => {
        const scrollThreshold = 40;
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            header.style.backgroundColor = "rgba(15, 23, 42, 0.98)";
            header.style.padding = "0.75rem 0";
            header.style.backdropFilter = "blur(12px)";
            // Explicitly strip any border/outline causing the white line
            header.style.border = "none";
            header.style.boxShadow = "none";
            header.style.outline = "none";
            
            // Brighten links
            navLinks.forEach(link => link.style.color = "#f8fafc");
        } else {
            header.classList.remove('scrolled');
            header.style.backgroundColor = "transparent";
            header.style.padding = "1.5rem 0";
            header.style.backdropFilter = "none";
            header.style.border = "none";
            header.style.boxShadow = "none";
            
            // Dim links back to hero style
            navLinks.forEach(link => link.style.color = "#cbd5e1");
        }
    };
    window.addEventListener('scroll', handleNavbar, { passive: true });
    handleNavbar(); 

    // --- 4. GDPR & CONSENT ---
    const checkConsent = () => {
        const consentKey = 'vs_consent_v1'; 
        if (!modal || localStorage.getItem(consentKey)) return;

        setTimeout(() => {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
        }, 1500);

        const closeConsent = () => {
            localStorage.setItem(consentKey, 'true');
            modal.style.display = 'none';
            modal.classList.add('hidden');
            document.body.style.overflow = ''; 
        };

        document.addEventListener('click', (e) => {
            if (e.target.closest('#vs-accept-all') || e.target.closest('#vs-save') || e.target.closest('#vs-consent-close')) {
                closeConsent();
            }
        });
    };
    checkConsent();

    // --- 5. DYNAMIC FOOTER YEAR ---
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});
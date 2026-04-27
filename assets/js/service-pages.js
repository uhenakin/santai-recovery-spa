// ── Header show on scroll ──
    window.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('visible', window.scrollY > 80);
    });

    // ── Mobile menu ──
    document.getElementById('navToggle').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('active');
    });
    document.getElementById('closeMenu').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });

    // ── Gallery Slider ──
    const track = document.getElementById('sliderTrack');
    const images = track.querySelectorAll('img');
    const dotsContainer = document.getElementById('sliderDots');
    const counter = document.getElementById('sliderCounter');
    const total = images.length;
    let current = 0;
    let visibleCount = window.innerWidth <= 900 ? 1 : 2;

    // Build dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    function getSlideWidth() {
        const img = images[0];
        return img.offsetWidth + 20; // width + gap
    }

    function goTo(index) {
        const maxIndex = total - visibleCount;
        current = Math.max(0, Math.min(index, maxIndex));
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
        counter.textContent = `${current + 1} / ${total}`;
    }

    document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

    // Touch / drag support
    let startX = 0, isDragging = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; track.classList.add('dragging'); });
    track.addEventListener('mousemove', e => { if (!isDragging) return; });
    track.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });
    track.addEventListener('mouseleave', () => { isDragging = false; track.classList.remove('dragging'); });

    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    window.addEventListener('resize', () => {
        visibleCount = window.innerWidth <= 900 ? 1 : 2;
        goTo(current);
    });

    // ── Scroll animations ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.benefit-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });

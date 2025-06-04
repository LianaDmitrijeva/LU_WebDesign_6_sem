document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIconSpan = document.getElementById('theme-icon-span');

    let navDots = [];
    let sectionsToObserve = [];
    let observer = null;
    let currentNavSelector = '';

    const setTheme = (theme) => {
        if (theme === 'night') {
            document.body.classList.add('night-theme');
            if (themeIconSpan) themeIconSpan.textContent = 'light_mode';
        } else {
            document.body.classList.remove('night-theme');
            if (themeIconSpan) themeIconSpan.textContent = 'dark_mode';
        }
        localStorage.setItem('theme', theme);
    };

    themeSwitcher.addEventListener('click', () => {
        if (document.body.classList.contains('night-theme')) {
            setTheme('day');
        } else {
            setTheme('night');
        }
    });

    const savedTheme = localStorage.getItem('theme') || 'day';
    setTheme(savedTheme);

    const clearActiveDots = () => {
        document.querySelectorAll(`${currentNavSelector} .nav-dot`).forEach(dot => dot.classList.remove('active'));
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                clearActiveDots();
                const currentScreenId = entry.target.getAttribute('id');
                const activeDot = document.querySelector(`${currentNavSelector} .nav-dot[data-screen="${currentScreenId}"]`);
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    function initializeNavigationObserver() {
        const isMobile = window.innerWidth < 800;

        if (observer) {
            observer.disconnect();
        }

        if (isMobile) {
            currentNavSelector = '.side-nav-mobile';
            navDots = document.querySelectorAll('.side-nav-mobile .nav-dot');
            sectionsToObserve = document.querySelectorAll('#screen-1.screen, .mobile-sub-screen');
        } else {
            currentNavSelector = '.side-nav';
            navDots = document.querySelectorAll('.side-nav .nav-dot');
            sectionsToObserve = document.querySelectorAll('.screen');
        }
        
        observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionsToObserve.forEach(section => {
            if (section) observer.observe(section);
        });

        document.querySelectorAll('.nav-dot').forEach(dot => {
            const newDot = dot.cloneNode(true);
            dot.parentNode.replaceChild(newDot, dot);
        });
        
        if (isMobile) {
             navDots = document.querySelectorAll('.side-nav-mobile .nav-dot');
        } else {
             navDots = document.querySelectorAll('.side-nav .nav-dot');
        }

        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href');
                const targetScreen = document.querySelector(targetId);
                if (targetScreen) {
                    targetScreen.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        setTimeout(() => {
            const firstVisibleSection = Array.from(sectionsToObserve).find(s => {
                 const rect = s.getBoundingClientRect();
                 return rect.top >= 0 && rect.top < window.innerHeight / 2;
            });
            if (firstVisibleSection) {
                clearActiveDots();
                const firstVisibleId = firstVisibleSection.getAttribute('id');
                const activeDot = document.querySelector(`${currentNavSelector} .nav-dot[data-screen="${firstVisibleId}"]`);
                if (activeDot) activeDot.classList.add('active');
            }
        }, 100);
    }

    initializeNavigationObserver(); 

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initializeNavigationObserver, 250); 
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.screen');
    const navDots = document.querySelectorAll('.nav-dot');
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIconSpan = document.getElementById('theme-icon-span'); // Get the span for the icon

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'night') {
            document.body.classList.add('night-theme');
            if (themeIconSpan) themeIconSpan.textContent = 'light_mode'; // Show sun icon (to switch to day)
        } else {
            document.body.classList.remove('night-theme');
            if (themeIconSpan) themeIconSpan.textContent = 'dark_mode'; // Show moon icon (to switch to night)
        }
        localStorage.setItem('theme', theme);
    };

    // Event listener for theme switcher button
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('night-theme') ? 'night' : 'day';
        if (currentTheme === 'night') {
            setTheme('day');
        } else {
            setTheme('night');
        }
    });

    // Load saved theme from localStorage or default to day
    const savedTheme = localStorage.getItem('theme') || 'day';
    setTheme(savedTheme);

    // Function to remove active class from all dots
    const clearActiveDots = () => {
        navDots.forEach(dot => dot.classList.remove('active'));
    };

    // IntersectionObserver callback
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                clearActiveDots();
                const currentScreenId = entry.target.getAttribute('id');
                const activeDot = document.querySelector(`.nav-dot[data-screen="${currentScreenId}"]`);
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    };

    // IntersectionObserver options
    const observerOptions = {
        root: null, // relative to document viewport 
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the target is visible
    };

    // Create and start the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });

    // Event listener for dot clicks (smooth scroll to section)
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = dot.getAttribute('href'); // Assuming href="#screen-N"
            const targetScreen = document.querySelector(targetId);
            if (targetScreen) {
                targetScreen.scrollIntoView({ behavior: 'smooth' });
                // The observer will handle updating the active dot after scroll
            }
        });
    });

    // Initial check in case a section is already in view on load (e.g. #screen-3 in URL)
    // This might be complex with scroll snapping, observer should handle initial state well enough.
    // For a very precise initial state, one might need to manually check once after load.
    // However, let's rely on the observer first, as it should trigger for the initially visible section.
});

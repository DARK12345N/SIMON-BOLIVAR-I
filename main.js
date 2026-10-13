document.addEventListener('DOMContentLoaded', () => {
    const navbars = document.querySelectorAll('.navbar');

    navbars.forEach((navbar) => {
        const navLinks = navbar.querySelector('.nav-links');
        const toggle = navbar.querySelector('.menu-toggle');

        if (!navLinks || !toggle) {
            return;
        }

        const setMenuState = (isOpen) => {
            navLinks.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
            toggle.classList.toggle('is-open', isOpen);
        };

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            setMenuState(!navLinks.classList.contains('active'));
        });

        toggle.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setMenuState(false);
            }
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    setMenuState(false);
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!navbar.contains(event.target)) {
                setMenuState(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setMenuState(false);
            }
        });
    });
});

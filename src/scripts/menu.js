// menu.js


// wrap everything in astro:page-load event listener
document.addEventListener('astro:page-load', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');

    if (!hamburger || !navLinks) {
        return;
    }

    hamburger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('expanded');
        hamburger.classList.toggle('active', isExpanded);
        nav?.classList.toggle('active', isExpanded);
    });

});

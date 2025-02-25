// menu.js


// wrap everything in astro:page-load event listener
document.addEventListener('astro:page-load', () => {

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('expanded');
        console.log('clicked');
    });

});

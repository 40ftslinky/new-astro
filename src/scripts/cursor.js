document.addEventListener('astro:page-load', () => {
    const carousels = document.querySelectorAll('.carousel_container');

    // For each carousel container, create a custom cursor
    carousels.forEach(carousel => {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        carousel.appendChild(cursor);

        let isMouseInside = false;

        // Update the cursor position immediately based on the mouse coordinates
        carousel.addEventListener('mousemove', (event) => {
            if (isMouseInside) {
                const rect = carousel.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;

                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            }
        });

        // Add class to cursor and start tracking when mouse enters the carousel container
        carousel.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-on');
            isMouseInside = true;
        });

        // Remove class from cursor and stop tracking when mouse leaves the carousel container
        carousel.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-on');
            isMouseInside = false;
        });
    });
});

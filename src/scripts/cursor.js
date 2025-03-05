document.addEventListener('astro:page-load', () => {
    const carousels = document.querySelectorAll('.carousel_container');

    // for each carousel container create custom cursor
    carousels.forEach(carousel => {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        carousel.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        let speed = 0.25;

        function animate() {
            let distX = mouseX - cursorX;
            let distY = mouseY - cursorY;

            cursorX = cursorX + (distX * speed);
            cursorY = cursorY + (distY * speed);

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animate);
        }

        animate();

        let mouseDown = false;
        let startX, scrollLeft;

        let startDragging = function (event) {
            mouseDown = true;
            // startX = event.pageX - carousel.offsetLeft;
            // scrollLeft = carousel.scrollLeft;
            cursor.classList.add('drag');
        };
        let stopDragging = function (event) {
            mouseDown = false;
            cursor.classList.remove('drag');
        };

        carousel.addEventListener('mousemove', (event) => {
            const rect = carousel.getBoundingClientRect();
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        });

        carousel.addEventListener('mousedown', startDragging);
        carousel.addEventListener('mouseup', stopDragging);
        carousel.addEventListener('mouseleave', stopDragging, () => {
            mouseX = 0;
            mouseY = 0;
        });

        carousel.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-on');
        });

        carousel.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-on');
        });
    });
});

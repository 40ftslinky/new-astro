// cursor

const carousels = document.querySelectorAll('.carousel_container');

carousels.forEach(carousel => {

    // Create a cursor element for each carousel
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    carousel.appendChild(cursor);

    let x = 0;
    let y = 0;

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    let speed = 0.25; // change to increase the ease

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
        startX = event.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        cursor.classList.add('drag');
    };
    let stopDragging = function (event) {
        mouseDown = false;
        cursor.classList.remove('drag');
    };

    carousel.addEventListener('mousemove', (event) => {
        const stage = document.querySelector('.carousel_wrap');
        // Get the bounding rectangle of target
        const rect = carousel.getBoundingClientRect();

        // Mouse position
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;

        cursor.classList.remove('resize');
        
        if (mouseX < 10 || mouseY < 10 || mouseX > rect.width - 10 || mouseY > rect.height - 10) {
            cursor.classList.remove('resize');
        } else {
            cursor.classList.add('resize');
        }

        if (mouseDown) {
            event.preventDefault();
            const x = event.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            carousel.scrollLeft = scrollLeft - walk;
        }
    });

    // Add the event listeners
    carousel.addEventListener('mousedown', startDragging, false);
    carousel.addEventListener('mouseup', stopDragging, false);
    carousel.addEventListener('mouseleave', stopDragging, false);

    // Add scroll event listener
    carousel.addEventListener('walk', () => {
        slider.classList.add('dragged');
    });

});




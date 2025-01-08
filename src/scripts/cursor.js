// cursor
const cursor = document.querySelector('.cursor');

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

const canvas = document.getElementById("canvas");

canvas.addEventListener('mousemove', (event) => {

    // Get the bounding rectangle of target
    const rect = canvas.getBoundingClientRect();

    // Mouse position
    mouseX = event.clientX - rect.left ;
    mouseY = event.clientY - rect.top;

    
    
    if (mouseX < 0 || mouseY < 0 || mouseX > canvas.width || mouseY > canvas.height) {
        // cursor.style.display = 'none';
        cursor.classList.remove('resize');
       
    } else {
        // cursor.style.display = 'block';
        cursor.classList.add('resize');
    }
    
    
});

let isDragging = false;

// Add the event listeners for mousedown, mousemove, and mouseup
canvas.addEventListener("mousedown", (event) => {
    // x = event.offsetX;
    // y = event.offsetY;
    isDragging = true;
        cursor.classList.add('drag');
});

canvas.addEventListener("mouseleave", (event) => {
// x = event.offsetX;
// y = event.offsetY;
isDragging = false;
    cursor.classList.remove('drag');
});

canvas.addEventListener("mouseup", (event) => {
// x = event.offsetX;
// y = event.offsetY;
isDragging = false;
    cursor.classList.remove('drag');
});

const carousels = document.querySelectorAll('.carousel_container');
// const slider = document.querySelector('.carousel_wrap');

const innerSlider = document.querySelector('.carousel_wrap');

carousels.forEach(carousel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    innerSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        innerSlider.classList.add('dragged');
        startX = e.pageX - innerSlider.offsetLeft;
        scrollLeft = innerSlider.scrollLeft;
    });
    innerSlider.addEventListener('mouseleave', () => {
        isDown = false;
        innerSlider.classList.remove('dragged');
    });
    innerSlider.addEventListener('mouseup', () => {
        isDown = false;
        innerSlider.classList.remove('dragged');
    });
    innerSlider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - innerSlider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        innerSlider.scrollLeft = scrollLeft - walk;
    });

});
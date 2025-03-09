document.addEventListener('astro:page-load', () => {
    const images = document.querySelectorAll('.hover-swap');

    images.forEach(image => {
        const originalSrc = image.src;
        const newSrc = image.getAttribute('data-srcset');
        const parentElement = image.parentElement;

        image.addEventListener('mouseenter', () => {
            const tempImage = new Image();
            tempImage.src = newSrc;
            tempImage.onload = () => {
                parentElement.style.backgroundImage = `url(${newSrc})`;
                image.style.opacity = '0'; // Hide the original image
            };
        });

        image.addEventListener('mouseleave', () => {
            parentElement.style.backgroundImage = `url(${originalSrc})`;
            image.style.opacity = '1'; // Show the original image
        });
    });
});
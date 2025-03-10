// carousel.js

document.addEventListener('astro:page-load', () => {
    class Carousel {
        constructor(element) {
            this.element = element;
            this.container = element.querySelector('.carousel_stage');
            this.slides = element.querySelectorAll('.carousel_slide');
            this.prevButton = element.querySelector('.prev');
            this.nextButton = element.querySelector('.next');
            this.indicatorContainer = element.querySelector('.carousel-indicators'); // Container for the indicators

            //added a check to ensure these elements exist
            if (!this.container || !this.prevButton || !this.nextButton) {
                console.warn('Carousel elements missing in', element);
                return;
            }

            this.totalSlides = this.slides.length;
            this.isDragging = false;
            this.startPos = 0;
            this.animationID = 0;
            this.isWindowFocused = true;
            this.isResetting = false;
            this.customCursor = document.querySelector('.cursor');
            this.currentSlide = 0; // Start at the first slide
            this.slideWidth = this.slides[0].offsetWidth;
            this.prevTranslate = 0;
            this.currentTranslate = 0;
            this.indicatorContainer;

            this.init();
        }

        init() {
            // Initialize position
            this.updateSlidePosition(false);
            // Prevent image dragging within carousel
            this.container.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', (event) => {
                    event.preventDefault();
                });
            });

            // Event listeners
            this.container.addEventListener('touchstart', this.startDragging.bind(this), { passive: false });
            this.container.addEventListener('touchend', this.endDragging.bind(this));
            this.container.addEventListener('touchmove', this.drag.bind(this), { passive: false });

            this.container.addEventListener('mousedown', this.startDragging.bind(this));
            this.container.addEventListener('mouseup', this.endDragging.bind(this));
            this.container.addEventListener('mouseleave', this.endDragging.bind(this));
            this.container.addEventListener('mousemove', this.drag.bind(this));

            this.prevButton.addEventListener('click', () => {
                if (!this.isResetting) {
                    this.moveSlide(-1);
                }
            });

            this.nextButton.addEventListener('click', () => {
                if (!this.isResetting) {
                    this.moveSlide(1);
                }
            });

            this.createIndicators(); // Create the indicators
            this.updateIndicators(); // Initial indicator state

        }

        moveSlide(direction) {
            if (this.isResetting) return;

            this.currentSlide += direction;
            // Keep the current slide within bounds
            if (this.currentSlide < 0) {
                this.currentSlide = 0;
            } else if (this.currentSlide >= this.totalSlides) {
                this.currentSlide = this.totalSlides - 1;
            }

            this.updateSlidePosition(true);
            this.updateIndicators();
        }

        updateSlidePosition(animate = true) {
            if (!animate) {
                this.container.style.transition = 'none';
            } else if (!this.isDragging) {
                this.container.style.transition = 'transform 0.5s ease-in-out';
            }
            this.slideWidth = this.slides[0].offsetWidth;
            this.prevTranslate = -this.slideWidth * this.currentSlide;
            this.currentTranslate = this.prevTranslate;

            requestAnimationFrame(() => {
                this.container.style.transform = `translateX(${this.currentTranslate}px)`;
            });
        }

        startDragging(event) {
            if (this.isResetting) return;
            this.isDragging = true;
            this.startPos = event instanceof TouchEvent ?
                event.touches[0].clientX :
                event.clientX;

            this.container.style.transition = 'none';
            this.container.classList.add('grabbing');
            this.customCursor.classList.add('carousel-active');

            this.animationID = requestAnimationFrame(this.animation.bind(this));
        }

        endDragging() {
            if (!this.isDragging) return;

            this.isDragging = false;
            cancelAnimationFrame(this.animationID);

            this.container.classList.remove('grabbing');
            this.customCursor.classList.remove('carousel-active');

            this.container.style.transition = 'transform 0.5s ease-in-out';

            const movedBy = this.currentTranslate - this.prevTranslate;
            if (Math.abs(movedBy) > 20) {
                if (movedBy < 0) {
                    this.moveSlide(1);
                } else {
                    this.moveSlide(-1);
                }
            } else {
                this.updateSlidePosition(true);
            }
        }

        animation() {
            if (this.isDragging) {
                this.setSliderPosition();
                requestAnimationFrame(this.animation.bind(this));
            }
        }

        setSliderPosition() {
            this.container.style.transform = `translateX(${this.currentTranslate}px)`;
        }

        drag(event) {
            if (this.isDragging && !this.isResetting) {
                const currentPosition = event instanceof TouchEvent ?
                    event.touches[0].clientX :
                    event.clientX;
                const diff = (currentPosition - this.startPos);
                this.currentTranslate = this.prevTranslate + diff;
            }
        }

        // create indicators
        createIndicators() {
            //check to ensure the indicatorContainer has been added to the DOM
            if (!this.indicatorContainer) {
                console.warn('No carousel indicators container found.');
                return;
            }
            // Create indicators
            for (let i = 0; i < this.totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                indicator.dataset.index = i;
                indicator.addEventListener('click', () => {
                    this.currentSlide = i;
                    this.updateSlidePosition(true);
                    this.updateIndicators();
                });
                this.indicatorContainer.appendChild(indicator);
            }
        }

        //update indicators
        updateIndicators() {
            if (!this.indicatorContainer) return;
            const indicators = this.indicatorContainer.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
        }
    }

    // Initialize all carousels on the page
    document.querySelectorAll('.carousel_container').forEach(carousel => {
        new Carousel(carousel);
    });
});

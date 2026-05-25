// carousel.js

document.addEventListener('astro:page-load', () => {
    class Carousel {
        constructor(element) {
            this.element = element;
            this.container = element.querySelector('.carousel_stage');
            this.slides = Array.from(element.querySelectorAll('.carousel_slide'));
            this.prevButton = element.querySelector('.prev');
            this.nextButton = element.querySelector('.next');
            this.indicatorContainer = element.querySelector('.carousel-indicators');

            if (!this.container || !this.prevButton || !this.nextButton) {
                console.warn('Carousel elements missing in', element);
                return;
            }

            this.totalSlides = this.slides.length;
            this.isDragging = false;
            this.startPos = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.animationID = 0;
            this.isResetting = false;
            this.customCursor = document.querySelector('.cursor');
            this.currentSlide = 0;
            this.containerWidth = this.container.offsetWidth;
            this.carouselWidth = this.element.offsetWidth;
            this.activePointerId = null;
            this.hasPointerEvents = 'PointerEvent' in window;

            this.init();
        }

        init() {
            if (this.element.dataset.carouselInitialized === 'true') return;
            this.element.dataset.carouselInitialized = 'true';

            this.updateSlidePosition(false);

            this.container.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', event => event.preventDefault());
            });

            if (this.hasPointerEvents) {
                this.container.addEventListener('pointerdown', this.startDragging.bind(this));
                this.container.addEventListener('pointerup', this.endDragging.bind(this));
                this.container.addEventListener('pointercancel', this.endDragging.bind(this));
                this.container.addEventListener('lostpointercapture', this.endDragging.bind(this));
                this.container.addEventListener('pointermove', this.drag.bind(this));
            } else {
                this.container.addEventListener('touchstart', this.startDragging.bind(this), { passive: false });
                this.container.addEventListener('touchend', this.endDragging.bind(this));
                this.container.addEventListener('touchcancel', this.endDragging.bind(this));
                this.container.addEventListener('touchmove', this.drag.bind(this), { passive: false });
                this.container.addEventListener('mousedown', this.startDragging.bind(this));
                this.container.addEventListener('mouseup', this.endDragging.bind(this));
                this.container.addEventListener('mouseleave', this.endDragging.bind(this));
                this.container.addEventListener('mousemove', this.drag.bind(this));
            }

            this.prevButton.addEventListener('click', () => {
                if (!this.isResetting) this.moveSlide(-1);
            });

            this.nextButton.addEventListener('click', () => {
                if (!this.isResetting) this.moveSlide(1);
            });

            this.createIndicators();
            this.updateIndicators();
            this.adjustLastSlide();
            window.addEventListener('resize', this.adjustLastSlide.bind(this));
        }

        moveSlide(direction) {
            if (this.isResetting) return;

            this.currentSlide += direction;
            this.currentSlide = Math.max(0, Math.min(this.currentSlide, this.totalSlides - 1));
            this.updateSlidePosition(true);
            this.updateIndicators();
        }

        updateSlidePosition(animate = true) {
            if (!animate) {
                this.container.style.transition = 'none';
            } else if (!this.isDragging) {
                this.container.style.transition = 'transform 0.5s ease-in-out';
            }

            let translateX = 0;
            for (let i = 0; i < this.currentSlide; i++) {
                translateX -= this.slides[i].offsetWidth + this.getSlideMarginRight(i);
            }

            // Calculate the minimum translateX to prevent the carousel stage from going out of bounds to the left
            const minTranslateX = this.getMinTranslateX();

            //handle last slide
             if (this.currentSlide === this.totalSlides - 1) {
                const totalWidthOfSlidesBeforeLast = translateX*-1;
                const lastSlideWidth = this.slides[this.totalSlides - 1].offsetWidth;
                const requiredOffset = Math.max(0, totalWidthOfSlidesBeforeLast + lastSlideWidth - this.carouselWidth);

                translateX = -totalWidthOfSlidesBeforeLast - requiredOffset;
             }

           
            // Clamp translateX to prevent dragging past the right edge (empty space on the right)
            translateX = Math.max(minTranslateX, Math.min(0, translateX));

            this.currentTranslate = translateX;
            this.prevTranslate = translateX;

            requestAnimationFrame(() => {
                this.container.style.transform = `translateX(${this.currentTranslate}px)`;
            });
        }

        startDragging(event) {
            if (this.isResetting || this.isInteractiveControl(event.target)) return;

            if (event.cancelable) event.preventDefault();

            this.isDragging = true;
            this.activePointerId = event.pointerId ?? null;
            this.startPos = this.getClientX(event);
            this.container.style.transition = 'none';
            this.container.classList.add('grabbing');
            this.customCursor?.classList.add('carousel-active');

            if (this.hasPointerEvents && this.activePointerId !== null && this.container.setPointerCapture) {
                this.container.setPointerCapture(this.activePointerId);
            }

            this.animationID = requestAnimationFrame(this.animation.bind(this));
        }

        endDragging(event) {
            if (!this.isDragging) return;
            if (event?.pointerId !== undefined && this.activePointerId !== event.pointerId) return;

            this.isDragging = false;
            cancelAnimationFrame(this.animationID);
            this.container.classList.remove('grabbing');
            this.customCursor?.classList.remove('carousel-active');
            this.container.style.transition = 'transform 0.5s ease-in-out';

            if (
                this.hasPointerEvents &&
                this.activePointerId !== null &&
                this.container.hasPointerCapture &&
                this.container.releasePointerCapture &&
                this.container.hasPointerCapture(this.activePointerId)
            ) {
                this.container.releasePointerCapture(this.activePointerId);
            }
            this.activePointerId = null;

            const movedBy = this.currentTranslate - this.prevTranslate;
            if (Math.abs(movedBy) > 20) {
                this.moveSlide(movedBy < 0 ? 1 : -1);
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
            // Prevent dragging past the right edge (empty space on the right)
            const maxTranslateX = 0;
            const minTranslateX = this.getMinTranslateX();
            this.currentTranslate = Math.max(minTranslateX, Math.min(maxTranslateX, this.currentTranslate));
            this.container.style.transform = `translateX(${this.currentTranslate}px)`;
        }

        drag(event) {
             if (this.isDragging && !this.isResetting) {
                if (event.pointerId !== undefined && this.activePointerId !== event.pointerId) return;
                if (event.cancelable) event.preventDefault();

                const currentPosition = this.getClientX(event);
                const diff = currentPosition - this.startPos;
                this.currentTranslate += diff;

                 // Prevent dragging past the edges
                const maxTranslateX = 0;
                const minTranslateX = this.getMinTranslateX();
                this.currentTranslate = Math.max(minTranslateX, Math.min(maxTranslateX, this.currentTranslate));

                this.startPos = currentPosition;
            }
        }

        createIndicators() {
            if (!this.indicatorContainer) {
                console.warn('No carousel indicators container found.');
                return;
            }
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

        updateIndicators() {
            if (!this.indicatorContainer) return;
            const indicators = this.indicatorContainer.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
        }

        adjustLastSlide() {
            this.containerWidth = this.container.offsetWidth;
            this.carouselWidth = this.element.offsetWidth;
            this.updateSlidePosition(false);
        }

        getClientX(event) {
            if (event.touches?.length) return event.touches[0].clientX;
            if (event.changedTouches?.length) return event.changedTouches[0].clientX;
            return event.clientX;
        }

        getMinTranslateX() {
            const scrollableWidth = Math.max(0, this.container.scrollWidth - this.carouselWidth);
            return -scrollableWidth;
        }

        isInteractiveControl(target) {
            if (!(target instanceof Element)) return false;
            return target.closest('button, a, input, textarea, select, label');
        }

        getSlideMarginRight(slideIndex) {
             if (slideIndex >= this.totalSlides -1 || slideIndex < 0) {
                return 0; // No right margin for the last slide
            }
            const style = window.getComputedStyle(this.slides[slideIndex]);
            const marginRight = parseFloat(style.marginRight) || 0; // Parse as float, default to 0
            return marginRight;
        }
    }

    document.querySelectorAll('.carousel_container').forEach(carousel => {
        new Carousel(carousel);
    });
});

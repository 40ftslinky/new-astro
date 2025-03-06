// carousel.js

document.addEventListener('astro:page-load', () => {
    class Carousel {
      constructor(element) {
        this.element = element;
        this.container = element.querySelector('.carousel_stage');
        this.slides = element.querySelectorAll('.carousel_slide');
        this.prevButton = element.querySelector('.prev');
        this.nextButton = element.querySelector('.next');
  
        //added a check to ensure these elements exist
        if (!this.container || !this.prevButton || !this.nextButton) {
          console.warn('Carousel elements missing in', element);
          return;
        }
  
        this.originalSlideCount = 2; // Number of unique slides
        this.totalSlides = this.slides.length;
        this.middleOffset = Math.floor(this.totalSlides / 3);
  
        this.currentSlide = this.middleOffset;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = -this.currentSlide * 100;
        this.prevTranslate = this.currentTranslate;
        this.animationID = 0;
        this.isWindowFocused = true;
        this.isResetting = false;
        this.customCursor = document.querySelector('.cursor');
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
  
        // Window focus events
        window.addEventListener('focus', () => {
          this.isWindowFocused = true;
        });
  
        window.addEventListener('blur', () => {
          this.isWindowFocused = false;
        });
      }
  
      moveSlide(direction) {
        if (this.isResetting) return;
  
        this.currentSlide += direction;
        this.updateSlidePosition(true);
  
        if (
          this.currentSlide >= this.totalSlides - this.middleOffset ||
          this.currentSlide < this.middleOffset - this.originalSlideCount
        ) {
          this.isResetting = true;
  
          setTimeout(() => {
            if (this.currentSlide >= this.totalSlides - this.middleOffset) {
              this.currentSlide = this.middleOffset;
            } else {
              this.currentSlide = this.totalSlides - this.middleOffset - this.originalSlideCount;
            }
  
            this.updateSlidePosition(false);
  
            setTimeout(() => {
              this.container.style.transition = 'transform 0.5s ease-in-out';
              this.isResetting = false;
            }, 50);
          }, 500);
        }
      }
  
      updateSlidePosition(animate = true) {
        if (!animate) {
          this.container.style.transition = 'none';
        } else if (!this.isDragging) {
          this.container.style.transition = 'transform 0.5s ease-in-out';
        }
  
        this.prevTranslate = this.currentSlide * -100;
        this.currentTranslate = this.prevTranslate;
  
        requestAnimationFrame(() => {
          this.container.style.transform = `translateX(${this.currentTranslate}%)`;
        });
      }
  
      startDragging(event) {
        if (this.isResetting) return;
          this.isDragging = true;
          this.startPos = event instanceof TouchEvent ?
              event.touches[0].clientX :
              event.clientX;
  
          this.container.style.transition = 'none';
        //   this.container.classList.add('grabbed');
        //   this.customCursor.classList.add('grabbing');
  
          this.animationID = requestAnimationFrame(this.animation.bind(this));
      }
  
      endDragging() {
        if (!this.isDragging) return;
  
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
  
        // this.container.classList.remove('grabbed');
        // this.customCursor.classList.remove('grabbing');
        
  
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
        this.container.style.transform = `translateX(${this.currentTranslate}%)`;
      }
  
      drag(event) {
          if (this.isDragging && !this.isResetting) {
              const currentPosition = event instanceof TouchEvent ?
                  event.touches[0].clientX :
                  event.clientX;
              const diff = (currentPosition - this.startPos) / this.container.offsetWidth * 100;
              this.currentTranslate = this.prevTranslate + diff;
          }
      }
    }
  
    // Initialize all carousels on the page
    document.querySelectorAll('.carousel_container').forEach(carousel => {
      new Carousel(carousel);
    });
  });

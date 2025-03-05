document.addEventListener('astro:page-load', () => {
  // CURSOR STATES
  // customCursor.parentElement.classList.add('cursor-over');
  // customCursor.classList.add('cursor-on');
  // carousel.classList.add('grabbed');
  // customCursor.classList.add('grabbing');
  // customCursor.classList.add('dragging');

  // create a script that
  // changes the cursor state when hovering over each carousel
  // ensure that the cursor state is reset when the cursor leaves relevant carousel and "curor-over" state is removed from the carousel and "cursor-on" state is removed from the cursor
  // ensure that the "cursor-on" state does not change when the cursor is moved within the carousel
  // add a function that changes the cursor state when the carousel is dragged
  // add a function that changes the cursor state when the carousel is grabbed "grabbed" state is added to the carousel and "grabbing" state is added to the cursor
  // ensure that the cursor state is reset when the cursor leaves relevant carousel and "grabbed" state is removed from the carousel and "grabbing" state is removed from the cursor
  // add a function that moves the carousel to the left when the carousel is grabbed and moved to the left side of the window
  // add a function that moves the carousel to the right when the carousel is grabbed and moved to the right side of the window
  // ensure that the cursor state does not change when the user grabs the carousel to slide it left or right
  // ensure that the cursor state does not change when the user clicks on the carousel to navigate to the next slide
  // add a function that navigates the carousel to the previous slide when the carousel is clicked on the left side
  // add a function that navigates the carousel to the next slide when the carousel is clicked on the right side
  // ensure that the cursors location is not calulated when the cursor is not over the carousel
  // ensure that the cursor state is reset when the cursor leaves the carousel
  // ensure that the cursor state is reset when the cursor leaves the window
  // ensure that the cursor state is reset when the cursor is moved outside the window
  // ensure that the cursor state is reset when the cursor is moved outside the carousel

  const carousels = document.querySelectorAll('.carousel_container');
  const carouselWraps = document.querySelectorAll('.carousel_container .carousel_wrap');
  const customCursor = document.querySelector('.cursor');
  const body = document.body;

  let leaveTimeout;
  let isCursorInCarousel = false;
  let isDragging = false;
  let startX, scrollLeft;

  function resetCursorState() {
    customCursor.classList.remove('cursor-over', 'cursor-on', 'grabbing', 'dragging');
    carouselWraps.forEach(wrap => wrap.classList.remove('grabbed'));
    isCursorInCarousel = false;
    isDragging = false;
  }

  function updateCursorPosition(event) {
    const parentRect = body.getBoundingClientRect(); 
    const relativeX = event.clientX - parentRect.left;
    const relativeY = event.clientY - parentRect.top;

    customCursor.style.left = `${relativeX}px`;
    customCursor.style.top = `${relativeY}px`;
  }

  function handleCarouselClick(event, carousel, carouselWrap) {
    const carouselWidth = carousel.offsetWidth;
    const clickX = event.clientX - carousel.getBoundingClientRect().left;

    if (clickX < carouselWidth / 2) {
      // Clicked on the left side - previous slide
      carouselWrap.scrollLeft -= carouselWrap.offsetWidth / 2;
    } else {
      // Clicked on the right side - next slide
      carouselWrap.scrollLeft += carouselWrap.offsetWidth / 2;
    }
  }

  carouselWraps.forEach((carouselWrap, index) => {
    const carousel = carousels[index];
    carouselWrap.addEventListener('mouseenter', () => {
      clearTimeout(leaveTimeout);
      isCursorInCarousel = true;
      customCursor.classList.add('cursor-over', 'cursor-on');
    });

    carouselWrap.addEventListener('mouseleave', (event) => {
        const rect = carousel.getBoundingClientRect();
        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) {
            if (!isDragging) {
                leaveTimeout = setTimeout(resetCursorState, 250);
            }
        }
    });

    carouselWrap.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.pageX - carouselWrap.offsetLeft;
      scrollLeft = carouselWrap.scrollLeft;
      carouselWrap.classList.add('grabbed');
      customCursor.classList.add('grabbing');
    });

    carouselWrap.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      const x = event.pageX - carouselWrap.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scroll speed
      carouselWrap.scrollLeft = scrollLeft - walk;
      customCursor.classList.add('dragging');
    });

    carouselWrap.addEventListener('mouseup', () => {
      isDragging = false;
      carouselWrap.classList.remove('grabbed');
      customCursor.classList.remove('grabbing', 'dragging');
    });

    carousel.addEventListener('click', (event) => {
        if (isDragging) return;
        handleCarouselClick(event, carousel, carouselWrap);
    });
    carouselWrap.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        carouselWrap.classList.remove('grabbed');
        customCursor.classList.remove('grabbing', 'dragging');
      }
    })
    
  });
    
    document.addEventListener('mousemove', (event) => {
        if (!isCursorInCarousel) return;
        updateCursorPosition(event);
    });

  // Reset cursor state on leaving the window
  document.addEventListener('mouseleave', () => {
    resetCursorState();
  });

  // Reset cursor on mouse up anywhere
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
          carouselWraps.forEach(wrap => wrap.classList.remove('grabbed'));
          customCursor.classList.remove('grabbing','dragging');
      }
  });

});

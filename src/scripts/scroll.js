const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }

      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
        entry.target.classList.remove('appear');
      }
    });
  };

  // **Uncomment this line:**
  const observer = new IntersectionObserver(callback);

  // observe boxes
  const faders = document.querySelectorAll('.fade-in'); // Assuming you have these selectors
  const sliders = document.querySelectorAll('.slide-in'); // Assuming you have these selectors
  
  faders.forEach((fader) => observer.observe(fader));
  sliders.forEach((slider) => observer.observe(slider));

  // use intersection observer to add a class and animate elements when their parent is in view
  // Select all elements with the class 'animate'
  const animateElements = document.querySelectorAll('.animate');

    // You can add an observer for animate elements here too, 
    // if you want a different behavior than the one described in your callback
    // animateElements.forEach(element => observer.observe(element))
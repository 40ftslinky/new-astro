// vanilla js

// wrap everything in astro:page-load event listener
document.addEventListener('astro:page-load', () => {

  const navBtn = document.querySelector('.menu-button');
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.link');
  const hero = document.querySelector('.hero');
  const main = document.querySelector('.main-content');
  const body = document.querySelector('body');

  const navOptions = {
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
  };

  const navObs = new IntersectionObserver(
    (entries) => body.classList.toggle('active', !entries[0].isIntersecting),
    navOptions
  );

  navObs.observe(document.querySelector('section'));

  // fade-in / slide-in
  const faders = [...document.querySelectorAll('[class*="fade"]')];
  const sliders = [...document.querySelectorAll('[class*="slide"]')];

  // create observer
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

  const observer = new IntersectionObserver(callback, {
    threshold: 0.1
  });

  // observe boxes
  faders.forEach((fader) => observer.observe(fader));
  sliders.forEach((slider) => observer.observe(slider));

  // use intersection observer to add a class and animate elements when their parent is in view
  // Select all elements with the class 'animate'
  const animateElements = document.querySelectorAll('.animate');
  // Loop through the elements
  const animateObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
          }
          if (!entry.isIntersecting) {
              entry.target.classList.remove('in-view');
          }
      });
  }, {
      threshold: 0.1
  });
  // Observe each element
  animateElements.forEach(animateElement => {
      animateObserver.observe(animateElement);
  });

  // end of astro:page-load event listener
});
// video-pause.js


// wrap everything in astro:page-load event listener
document.addEventListener('astro:page-load', () => {


// document.addEventListener('DOMContentLoaded', function() {
  var win = window;
  var elementTop, elementBottom, viewportTop, viewportBottom;

  function isScrolledIntoView(elem) {
      elementTop = elem.getBoundingClientRect().top + win.scrollY;
      elementBottom = elementTop + elem.offsetHeight;
      viewportTop = win.scrollY + win.innerHeight / 3;
      viewportBottom = viewportTop + win.innerHeight / 3;
      return (elementBottom > viewportTop && elementTop < viewportBottom);
  }

  var videos = document.querySelectorAll('video');
  if (videos.length) {
      videos.forEach(function(video) {
          video.setAttribute('webkit-playsinline', '');
          video.setAttribute('playsinline', '');
          video.setAttribute('muted', 'muted');
          video.setAttribute('id', 'loadvideo');
          video.load();
      });

      win.addEventListener('scroll', function() {
          videos.forEach(function(video) {
              if (isScrolledIntoView(video)) {
                  video.play();
                  video.setAttribute('class', 'playing');
              } else {
                  video.pause();
                  video.setAttribute('class', 'paused');
              }
          });
      });
  }
});
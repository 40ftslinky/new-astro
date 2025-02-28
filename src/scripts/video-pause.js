// video-pause.js

// Use a more generic event for Astro page transitions
document.addEventListener('astro:after-swap', () => {
    initializeVideoHandling();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeVideoHandling();
});

function initializeVideoHandling() {
    console.log("Initializing video handling...");

    const win = window;
    let viewportTop, viewportBottom;

    function updateViewport() {
        // Calculate viewport boundaries dynamically
        viewportTop = win.scrollY + win.innerHeight / 3;
        viewportBottom = win.scrollY + (win.innerHeight * 2 / 3);
    }

    function isScrolledIntoView(elem) {
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        const elementTop = rect.top + win.scrollY;
        const elementBottom = elementTop + rect.height;
        return (elementBottom >= viewportTop && elementTop <= viewportBottom);
    }

    updateViewport();
    win.addEventListener('scroll', updateViewport);

    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
        console.log("Found videos:", videos.length);
        videos.forEach(function (video) {
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('controls', 'false');
            video.muted = true;
            video.setAttribute('id', 'loadvideo');
            video.load();
            
            video.addEventListener('loadeddata', () => {
              console.log(`Video loaded: ${video.src}`);
            });
        });

        // Use IntersectionObserver for better performance
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.paused) {
                        entry.target.play().catch(error => {
                            console.error("Error attempting to play video:", error);
                        });
                    }
                    entry.target.classList.add('playing');
                    entry.target.classList.remove('paused');
                } else {
                    if (!entry.target.paused) {
                        entry.target.pause();
                    }
                    entry.target.classList.add('paused');
                    entry.target.classList.remove('playing');
                }
            });
        }, {
            rootMargin: '0px',
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        });

        videos.forEach(video => {
            observer.observe(video);
        });
        console.log("Video handling initialized.");
    }else{
        console.log("No videos found.");
    }
    
}

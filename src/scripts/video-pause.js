// video-pause.js

// Use a more generic event for Astro page transitions
document.addEventListener('astro:after-swap', () => {
    initializeVideoHandling();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeVideoHandling();
});

function isMobileDevice() {
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasSmallViewport = window.matchMedia('(max-width: 767px)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return isIOS || (hasCoarsePointer && hasSmallViewport);
}

function initializeVideoHandling() {
    if (isMobileDevice()) {
        return;
    }

    console.log("Initializing video handling...");

    const win = window;
    let viewportTop, viewportBottom;
    let scrollTimeout;

    function updateViewport() {
        // Calculate viewport boundaries dynamically
        viewportTop = win.scrollY + win.innerHeight / 3;
        viewportBottom = win.scrollY + (win.innerHeight * 2 / 3);
        resetScrollTimeout();
    }

    function resetScrollTimeout() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(pauseAllVideos, 180000); // 180000ms = 180s
    }

    function pauseAllVideos() {
        const videos = document.querySelectorAll('video.playing');
        videos.forEach(video => {
            video.pause();
            video.classList.add('paused');
            video.classList.remove('playing');
        });
        console.log("Paused all videos due to inactivity.");
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
    } else {
        console.log("No videos found.");
    }
    
    resetScrollTimeout(); // Initialize the scroll timeout
}

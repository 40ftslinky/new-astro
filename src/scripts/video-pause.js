// video-pause.js

// Run after the initial load and every Astro client-side navigation.
document.addEventListener('astro:page-load', () => {
    initializeVideoHandling();
});

let activeObserver;
let activeScrollHandler;
let activeScrollTimeout;

function isMobileDevice() {
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasSmallViewport = window.matchMedia('(max-width: 767px)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return isIOS || (hasCoarsePointer && hasSmallViewport);
}

function initializeVideoHandling() {
    const videos = document.querySelectorAll('video');

    activeObserver?.disconnect();
    if (activeScrollHandler) window.removeEventListener('scroll', activeScrollHandler);
    if (activeScrollTimeout) clearTimeout(activeScrollTimeout);

    // `controls` is a Boolean attribute: controls="false" still enables it.
    // Remove both the property and attribute before the mobile early return so
    // Safari never exposes its native controls on hover or tap.
    videos.forEach((video) => {
        video.controls = false;
        video.removeAttribute('controls');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');
        video.muted = true;
    });

    if (isMobileDevice()) {
        return;
    }

    console.log("Initializing video handling...");

    function resetScrollTimeout() {
        if (activeScrollTimeout) {
            clearTimeout(activeScrollTimeout);
        }
        activeScrollTimeout = setTimeout(pauseAllVideos, 180000); // 180000ms = 180s
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

    activeScrollHandler = resetScrollTimeout;
    window.addEventListener('scroll', activeScrollHandler, { passive: true });

    if (videos.length > 0) {
        console.log("Found videos:", videos.length);

        function setPausedState(video) {
            video.dataset.inViewport = 'false';
            video.pause();
            video.classList.add('paused');
            video.classList.remove('playing');
        }

        async function playWhenReady(video) {
            video.dataset.inViewport = 'true';

            // Safari may leave off-screen media at HAVE_NOTHING/HAVE_METADATA.
            // Wait until it can actually play instead of applying a false
            // `playing` state as soon as play() is requested.
            if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
                if (video.dataset.waitingForCanPlay !== 'true') {
                    video.dataset.waitingForCanPlay = 'true';
                    video.addEventListener('canplay', () => {
                        video.dataset.waitingForCanPlay = 'false';
                        if (video.dataset.inViewport === 'true') playWhenReady(video);
                    }, { once: true });

                    video.preload = 'auto';
                    video.load();
                }
                return;
            }

            try {
                await video.play();

                // The video may have left the viewport while Safari was
                // resolving play(). Do not let that late promise restart it.
                if (video.dataset.inViewport !== 'true') {
                    video.pause();
                    return;
                }

                video.classList.add('playing');
                video.classList.remove('paused');
            } catch (error) {
                video.classList.add('paused');
                video.classList.remove('playing');
                console.error("Error attempting to play video:", error);
            }
        }

        // Use IntersectionObserver for better performance
        activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (!(video instanceof HTMLVideoElement)) return;

                if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                    playWhenReady(video);
                } else {
                    setPausedState(video);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: [0, 0.15, 0.5, 1.0]
        });

        videos.forEach(video => {
            video.preload = 'metadata';
            activeObserver.observe(video);
        });
        console.log("Video handling initialized.");
    } else {
        console.log("No videos found.");
    }
    
    resetScrollTimeout(); // Initialize the scroll timeout
}

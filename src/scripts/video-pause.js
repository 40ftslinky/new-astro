// video-pause.js

// Run after the initial load and every Astro client-side navigation.
document.addEventListener('astro:page-load', () => {
    initializeVideoHandling();
});

let activeObserver;
let activeCarouselObservers = [];
let activeScrollHandler;
let activeScrollTimeout;

function initializeVideoHandling() {
    const videos = document.querySelectorAll('video');

    activeObserver?.disconnect();
    activeCarouselObservers.forEach(observer => observer.disconnect());
    activeCarouselObservers = [];
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
        if (video.dataset.audioInitialized !== 'true') {
            video.muted = true;
            initializeAudioControl(video);
            video.dataset.audioInitialized = 'true';
        }
    });

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

        // A video must be visible in both the page and its carousel window.
        // A carousel's transformed stage can extend beyond its visible area.
        const visibility = new WeakMap();
        const carouselVideos = new Map();
        const pageObserverOptions = {
            rootMargin: '0px',
            threshold: [0, 0.15, 0.5, 1.0]
        };
        const carouselObserverOptions = {
            rootMargin: '0px',
            threshold: [0, 0.5, 1.0]
        };

        function updateVisibility(entries, boundary) {
            entries.forEach(entry => {
                const video = entry.target;
                const state = visibility.get(video);
                if (!state) return;

                if (boundary === 'carousel') {
                    const visibleWidth = entry.intersectionRect.width;
                    const videoWidth = entry.boundingClientRect.width;
                    state.carousel = entry.isIntersecting &&
                        videoWidth > 0 &&
                        visibleWidth / videoWidth >= 0.5;
                } else {
                    state.page = entry.isIntersecting &&
                        entry.intersectionRect.width > 0 &&
                        entry.intersectionRect.height > 0 &&
                        entry.intersectionRatio >= 0.15;
                }

                if (state.page && state.carousel) {
                    if (video.dataset.inViewport !== 'true') playWhenReady(video);
                } else {
                    setPausedState(video);
                }
            });
        }

        activeObserver = new IntersectionObserver(
            entries => updateVisibility(entries, 'page'), pageObserverOptions
        );

        videos.forEach(video => {
            const carousel = video.closest('.carousel_container');
            visibility.set(video, { page: false, carousel: !carousel });
            setPausedState(video);
            video.preload = 'metadata';
            activeObserver.observe(video);
            if (carousel) {
                if (!carouselVideos.has(carousel)) carouselVideos.set(carousel, []);
                carouselVideos.get(carousel).push(video);
            }
        });

        carouselVideos.forEach((items, carousel) => {
            const observer = new IntersectionObserver(
                entries => updateVisibility(entries, 'carousel'),
                { ...carouselObserverOptions, root: carousel }
            );
            items.forEach(video => observer.observe(video));
            activeCarouselObservers.push(observer);
        });
        console.log("Video handling initialized.");
    } else {
        console.log("No videos found.");
    }
    
    resetScrollTimeout(); // Initialize the scroll timeout
}


const audioIcons = {
    off: '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8989 24.3392L26.9989 12.2392V29.9992C26.9986 30.1764 26.9512 30.3503 26.8616 30.5032C26.772 30.656 26.6434 30.7823 26.4889 30.8692C26.3346 30.9579 26.1591 31.0029 25.9811 30.9993C25.8032 30.9958 25.6296 30.9439 25.4789 30.8492L14.8989 24.3392ZM30.7089 4.28917C30.6164 4.19647 30.5065 4.12292 30.3855 4.07274C30.2646 4.02256 30.1349 3.99673 30.0039 3.99673C29.8729 3.99673 29.7433 4.02256 29.6223 4.07274C29.5013 4.12292 29.3914 4.19647 29.2989 4.28917L27.0089 6.57917V1.99917C27.0086 1.82197 26.9612 1.64804 26.8716 1.49517C26.782 1.34231 26.6534 1.216 26.4989 1.12917C26.3443 1.04153 26.1689 0.997133 25.9912 1.00065C25.8134 1.00417 25.64 1.05547 25.4889 1.14917L12.7289 8.99917H1.9989C1.4489 8.99917 0.998903 9.44917 0.998903 9.99917V21.9992C0.998903 22.5492 1.4489 22.9992 1.9989 22.9992H10.5889L5.2989 28.2892C5.15936 28.4288 5.06446 28.6068 5.02626 28.8005C4.98807 28.9942 5.0083 29.1949 5.08438 29.377C5.16046 29.5592 5.28897 29.7147 5.45358 29.8236C5.61819 29.9326 5.81148 29.9903 6.0089 29.9892C6.2689 29.9892 6.5189 29.8892 6.7189 29.6992L30.7089 5.70917C30.8016 5.61666 30.8752 5.50677 30.9253 5.38579C30.9755 5.26482 31.0013 5.13514 31.0013 5.00417C31.0013 4.8732 30.9755 4.74352 30.9253 4.62255C30.8752 4.50157 30.8016 4.39168 30.7089 4.29917V4.28917Z" fill="currentColor"/></svg>',
    on: '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.488 1.127C27.172 0.95 26.784 0.959 26.476 1.148L13.717 9H3C2.448 9 2 9.447 2 10V22C2 22.553 2.448 23 3 23H13.717L26.476 30.852C26.636 30.95 26.818 31 27 31C27.168 31 27.336 30.958 27.488 30.873C27.804 30.696 28 30.362 28 30V2C28 1.638 27.804 1.304 27.488 1.127Z" fill="currentColor"/></svg>'
};

function initializeAudioControl(video) {
    const wrapper = video.closest('.video_wrap');
    if (!wrapper) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-audio-toggle';
    button.hidden = true;
    wrapper.append(button);

    function update() {
        const detected = video.audioTracks?.length > 0 || video.mozHasAudio === true || video.webkitAudioDecodedByteCount > 0;
        const hasAudio = video.dataset.hasAudio === 'true' || (video.dataset.hasAudio !== 'false' && detected);
        button.hidden = !hasAudio;
        const enabled = !video.muted && video.volume > 0;
        button.innerHTML = enabled ? audioIcons.on : audioIcons.off;
        button.setAttribute('aria-label', enabled ? 'Turn audio off' : 'Turn audio on');
        button.setAttribute('aria-pressed', String(enabled));
    }

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const enable = video.muted || video.volume === 0;
        if (enable && video.volume === 0) video.volume = 1;
        video.muted = !enable;
        if (enable && video.paused && video.dataset.inViewport === 'true') {
            video.play().catch(() => {});
        }
        update();
    });
    for (const event of ['loadedmetadata', 'loadeddata', 'playing', 'timeupdate', 'volumechange', 'emptied']) {
        video.addEventListener(event, update);
    }
    video.audioTracks?.addEventListener('addtrack', update);
    video.audioTracks?.addEventListener('removetrack', update);
    update();
}

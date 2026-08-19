const finePointer = window.matchMedia('(pointer: fine)');
let cleanupActiveCursors = () => {};

function initCarouselCursors() {
    cleanupActiveCursors();
    if (!finePointer.matches) return;

    const cleanupCallbacks = [];

    document.querySelectorAll('.carousel_container').forEach((carousel) => {
        // Astro page transitions can re-run this hook on an existing DOM tree.
        if (carousel.dataset.cursorInitialized === 'true') return;
        carousel.dataset.cursorInitialized = 'true';

        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.setAttribute('aria-hidden', 'true');
        carousel.appendChild(cursor);
        cleanupCallbacks.push(() => cursor.remove());

        let bounds;
        let frame = 0;
        let isInside = false;
        let pendingX = 0;
        let pendingY = 0;
        cleanupCallbacks.push(() => {
            if (frame) cancelAnimationFrame(frame);
            carousel.removeAttribute('data-cursor-initialized');
        });

        const updatePosition = () => {
            frame = 0;
            if (!isInside || !bounds) return;

            // CSS variables are composited by the transform; no layout is caused.
            cursor.style.setProperty('--cursor-x', `${pendingX - bounds.left}px`);
            cursor.style.setProperty('--cursor-y', `${pendingY - bounds.top}px`);
        };

        const schedulePosition = (event) => {
            if (!isInside || (event.pointerType && event.pointerType !== 'mouse')) return;

            pendingX = event.clientX;
            pendingY = event.clientY;
            if (!frame) frame = requestAnimationFrame(updatePosition);
        };

        const refreshBounds = () => {
            if (isInside) bounds = carousel.getBoundingClientRect();
        };

        carousel.addEventListener('pointerenter', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            bounds = carousel.getBoundingClientRect();
            isInside = true;
            cursor.classList.add('cursor-on');
            schedulePosition(event);
        }, { passive: true });

        carousel.addEventListener('pointermove', schedulePosition, { passive: true });

        carousel.addEventListener('pointerleave', () => {
            isInside = false;
            bounds = null;
            cursor.classList.remove('cursor-on', 'cursor-hover', 'grabbing');
            carousel.classList.remove('grabbed');
            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        }, { passive: true });

        carousel.addEventListener('pointerdown', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            carousel.classList.add('grabbed');
            cursor.classList.add('grabbing');
        }, { passive: true });

        const release = () => {
            carousel.classList.remove('grabbed');
            cursor.classList.remove('grabbing');
        };

        carousel.addEventListener('pointerup', release, { passive: true });
        carousel.addEventListener('pointercancel', release, { passive: true });
        window.addEventListener('pointerup', release, { passive: true });
        window.addEventListener('resize', refreshBounds, { passive: true });
        cleanupCallbacks.push(() => window.removeEventListener('pointerup', release));
        cleanupCallbacks.push(() => window.removeEventListener('resize', refreshBounds));

        // Delegation avoids adding two hover listeners for every carousel button.
        carousel.addEventListener('pointerover', (event) => {
            if (event.target.closest('.carousel-button')) cursor.classList.add('cursor-hover');
        }, { passive: true });

        carousel.addEventListener('pointerout', (event) => {
            const button = event.target.closest('.carousel-button');
            if (button && !button.contains(event.relatedTarget)) cursor.classList.remove('cursor-hover');
        }, { passive: true });
    });

    cleanupActiveCursors = () => {
        cleanupCallbacks.splice(0).forEach((cleanup) => cleanup());
        cleanupActiveCursors = () => {};
    };
}

document.addEventListener('astro:page-load', initCarouselCursors);

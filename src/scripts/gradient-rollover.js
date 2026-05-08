document.addEventListener('astro:page-load', () => {
    const rollovers = document.querySelectorAll('.gradient-rollover');

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const gradientRadius = 50;
    const easingFactor = 0.14;

    const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;
    const shortestAngleDelta = (currentAngle, nextAngle) => {
        let delta = normalizeAngle(nextAngle) - normalizeAngle(currentAngle);

        if (delta > 180) {
            delta -= 360;
        }

        if (delta < -180) {
            delta += 360;
        }

        return delta;
    };

    const setGradientAngle = (rollover, gradient, angle) => {
        const normalizedAngle = normalizeAngle(angle);
        const radians = (normalizedAngle - 90) * (Math.PI / 180);
        const offsetX = Math.cos(radians) * gradientRadius;
        const offsetY = Math.sin(radians) * gradientRadius;

        rollover.style.setProperty('--rollover-angle', `${normalizedAngle.toFixed(2)}deg`);

        gradient.setAttribute('x1', `${clamp(50 - offsetX, 0, 100).toFixed(2)}%`);
        gradient.setAttribute('y1', `${clamp(50 - offsetY, 0, 100).toFixed(2)}%`);
        gradient.setAttribute('x2', `${clamp(50 + offsetX, 0, 100).toFixed(2)}%`);
        gradient.setAttribute('y2', `${clamp(50 + offsetY, 0, 100).toFixed(2)}%`);
    };

    rollovers.forEach((rollover) => {
        if (!(rollover instanceof SVGSVGElement) || rollover.dataset.gradientRolloverBound === 'true') {
            return;
        }

        const gradient = rollover.querySelector('[data-gradient-rollover-gradient]');

        if (!(gradient instanceof SVGLinearGradientElement)) {
            return;
        }

        rollover.dataset.gradientRolloverBound = 'true';
        let currentAngle = 45;
        let targetAngle = 45;
        let animationFrameId;

        const animateGradient = () => {
            const delta = shortestAngleDelta(currentAngle, targetAngle);

            if (Math.abs(delta) < 0.1) {
                currentAngle = targetAngle;
                setGradientAngle(rollover, gradient, currentAngle);
                animationFrameId = undefined;
                return;
            }

            currentAngle += delta * easingFactor;
            setGradientAngle(rollover, gradient, currentAngle);
            animationFrameId = window.requestAnimationFrame(animateGradient);
        };

        const startAnimation = () => {
            if (animationFrameId !== undefined) {
                return;
            }

            animationFrameId = window.requestAnimationFrame(animateGradient);
        };

        const resetGradient = () => {
            targetAngle = 45;
            startAnimation();
        };

        const updateGradient = (event) => {
            const bounds = rollover.getBoundingClientRect();
            const centerX = bounds.left + (bounds.width / 2);
            const centerY = bounds.top + (bounds.height / 2);
            const deltaX = event.clientX - centerX;
            const deltaY = event.clientY - centerY;

            targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
            startAnimation();
        };

        rollover.addEventListener('pointerenter', () => {
            rollover.classList.add('is-active');
        });

        rollover.addEventListener('pointermove', updateGradient);

        rollover.addEventListener('pointerleave', () => {
            rollover.classList.remove('is-active');
            resetGradient();
        });

        setGradientAngle(rollover, gradient, currentAngle);
    });
});
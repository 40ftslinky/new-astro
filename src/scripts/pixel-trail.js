const options = {
  pixelSize: 10,
  fadeDuration: 500,
  color: '#0d0dff',
  simulatedTrailCount: 0,
  simulatedTrailLength: 35,
  simulatedTrailSpeed: 175,
  simulatedTrailInterval: 1500,
};

let cleanup;

function mountPixelTrail() {
  cleanup?.();

  if (!window.matchMedia('(pointer: fine)').matches) {
    cleanup = undefined;
    return;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return;

  canvas.className = 'pixel-trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);

  const pixels = new Map();
  const simulationTimers = new Set();
  let frame;
  let spawnTimer;
  let initialTrailTimer;
  let trailId = 0;
  let activeSimulatedTrails = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function render() {
    const now = performance.now();
    context.clearRect(0, 0, canvas.width, canvas.height);

    pixels.forEach((pixel, key) => {
      const progress = (now - pixel.startedAt) / options.fadeDuration;

      if (progress >= 1) {
        pixels.delete(key);
        return;
      }

      context.fillStyle = options.color;
      context.globalAlpha = 1 - progress;
      context.fillRect(
        pixel.x * options.pixelSize,
        pixel.y * options.pixelSize,
        options.pixelSize,
        options.pixelSize,
      );
    });

    context.globalAlpha = 1;
    frame = pixels.size ? requestAnimationFrame(render) : undefined;
  }

  function requestRender() {
    if (!frame && pixels.size) frame = requestAnimationFrame(render);
  }

  function addPixel(x, y, key = `${x}-${y}`) {
    pixels.set(key, { x, y, startedAt: performance.now() });
    requestRender();
  }

  function addPointerPixel(event) {
    const x = Math.floor(event.clientX / options.pixelSize);
    const y = Math.floor(event.clientY / options.pixelSize);
    addPixel(x, y);
  }

  function makePath() {
    const columns = Math.ceil(canvas.width / options.pixelSize);
    const rows = Math.ceil(canvas.height / options.pixelSize);
    const directions = [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
      { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    ];
    const path = [];
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);
    let direction = Math.floor(Math.random() * directions.length);

    for (let step = 0; step < options.simulatedTrailLength; step += 1) {
      path.push({ x, y });

      if (Math.random() < 0.3) {
        direction = (direction + Math.floor(Math.random() * 3) - 1 + directions.length) % directions.length;
      }

      let nextX = x + directions[direction].x;
      let nextY = y + directions[direction].y;

      if (nextX < 0 || nextX >= columns) {
        directions[direction] = { ...directions[direction], x: -directions[direction].x };
        nextX = x + directions[direction].x;
      }

      if (nextY < 0 || nextY >= rows) {
        directions[direction] = { ...directions[direction], y: -directions[direction].y };
        nextY = y + directions[direction].y;
      }

      x = Math.max(0, Math.min(columns - 1, nextX));
      y = Math.max(0, Math.min(rows - 1, nextY));
    }

    return path;
  }

  function startSimulatedTrail() {
    if (document.hidden || activeSimulatedTrails >= options.simulatedTrailCount) return;

    const id = trailId;
    const path = makePath();
    let index = 0;
    trailId += 1;
    activeSimulatedTrails += 1;

    let timer;

    const advance = () => {
      const point = path[index];

      if (!point) {
        clearInterval(timer);
        simulationTimers.delete(timer);
        activeSimulatedTrails -= 1;
        return;
      }

      addPixel(point.x, point.y, `simulated-${id}-${point.x}-${point.y}`);
      index += 1;
    };

    advance();
    timer = setInterval(advance, options.simulatedTrailSpeed);
    simulationTimers.add(timer);
  }

  function handleVisibilityChange() {
    if (!document.hidden) startSimulatedTrail();
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', addPointerPixel, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  spawnTimer = window.setInterval(startSimulatedTrail, options.simulatedTrailInterval / 3);
  initialTrailTimer = window.setTimeout(startSimulatedTrail, 500);

  cleanup = () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', addPointerPixel);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.clearInterval(spawnTimer);
    window.clearTimeout(initialTrailTimer);
    simulationTimers.forEach(clearInterval);
    simulationTimers.clear();
    if (frame) cancelAnimationFrame(frame);
    canvas.remove();
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountPixelTrail, { once: true });
} else {
  mountPixelTrail();
}

document.addEventListener('astro:page-load', mountPixelTrail);

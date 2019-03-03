import Sketch from 'app/sketches/crystalline/';

let startTime;

const init = () => {
    const sketch = new Sketch(3, 720, 720);

    const capturer = new CCapture({
        verbose: false,
        display: true,
        framerate: 60,
        motionBlurFrames: 0 * (960 / 60),
        quality: 99,
        format: 'gif',
        timeLimit: sketch.loop.duration,
        frameLimit: 0,
        autoSaveTime: 0,
        workers: 10,
        workersPath: 'capture/',
    });

    const capture = () => {
        capturer.start();
        startTime = performance.now();
    }

    const update = () => {
        requestAnimationFrame(update);

        sketch.record(startTime);
        capturer.capture(sketch.renderer.domElement);
    }

    const setup = () => {
        startTime = 0;
        update();
    }

    setup();
    document.getElementById('capture').addEventListener('click', capture);
};

global.addEventListener('load', init);

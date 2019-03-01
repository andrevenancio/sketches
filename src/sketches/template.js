import dat from 'dat-gui';
import { getParam } from 'app/utils/query';

let elapsedTime = 0;
let oldTime = 0;
let focus = false;
let newTime;
let diff;

const updateElapsedTime = () => {
    newTime = (typeof performance === 'undefined' ? Date : performance).now();
    diff = (newTime - oldTime) / 1000;
    oldTime = newTime;
    elapsedTime += diff;
}

class Template {

    constructor(loopDuration, loopWidth, loopHeight) {
        const captureLoop = loopDuration !== undefined;

        this.gui = new dat.GUI({ autoPlace: false });
        this.loop = {};

        if (captureLoop === false) {
            global.addEventListener('resize', this.handleResize.bind(this), false);
            global.addEventListener('focus', this.handleResume.bind(this), false);
            global.addEventListener('blur', this.handlePause.bind(this), false);
        } else {
            this.loop.duration = loopDuration;
            this.loop.width = loopWidth,
            this.loop.height = loopHeight;
        }

        if (getParam('debug') !== null && captureLoop === false) {
            this.gui.domElement.style.position = 'fixed';
            this.gui.domElement.style.top = 0;
            this.gui.domElement.style.right = 0;
            document.body.appendChild(this.gui.domElement);
        }

        // all done with setup
        this.setup();
        this.init();
        if (captureLoop) {
            this.resize(this.loop.width / global.devicePixelRatio, this.loop.height / global.devicePixelRatio);
        } else {
            this.handleResize();
            this.handleResume();
        }
    }

    handleResize() {
        this.resize(global.innerWidth, global.innerHeight);
        this.update(elapsedTime);
    }

    handleResume() {
        if (focus === false) {
            focus = true;
            this.raf = requestAnimationFrame(this.handleUpdate.bind(this));
            this.resume();
        }
    }

    handlePause() {
        if (focus === true) {
            focus = false;
            cancelAnimationFrame(this.raf);
            this.pause();
        }
    }

    handleUpdate() {
        updateElapsedTime();

        this.update(elapsedTime);
        this.raf = requestAnimationFrame(this.handleUpdate.bind(this));
   }

    setup() {}
    init() {}
    resize() {}
    pause() {}
    resume() {}
    update() {}
    record() {}

}

export default Template;

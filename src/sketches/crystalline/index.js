import {
    AmbientLight,
    BackSide,
    BoxBufferGeometry,
    BoxGeometry,
    CubeCamera,
    DirectionalLight,
    DoubleSide,
    FrontSide,
    IcosahedronGeometry,
    LinearMipMapLinearFilter,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    TextureLoader,
    Vector3,
    VertexColors,
    WebGLRenderer,
} from 'three';

import OrbitControls from 'app/utils/orbit-controls';
import Template from 'app/sketches/template';
import skybox2 from 'app/shaders/skybox2';

const settings = {
    turbidity: 6,
    rayleigh: 0, // 0.1,
    luminance: 1,

    inclination: 0, // 0.49,
    azimuth: 0.25,
}

class Crystalline extends Template {

    setup() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(global.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(60, 1, 1, 1000);
        this.camera.position.set(0, 0, 100);

        this.cubeCamera = new CubeCamera(1, 1000, 512);
        this.cubeCamera.renderTarget.texture.generateMipmaps = true;
        this.cubeCamera.renderTarget.texture.minFilter = LinearMipMapLinearFilter;
        this.scene.add(this.cubeCamera);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.gui.add(settings, 'turbidity', 0, 20).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'rayleigh', 0, 20).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'luminance', 0, 1).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'inclination', 0, 0.5).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'azimuth', 0, 1).onChange(this.updateGui.bind(this));
    }

    init() {
        // skybox
        let geometry = new BoxBufferGeometry(1, 1, 1);
        let material = new ShaderMaterial(skybox2);
        this.skybox = new Mesh(geometry, material);
        this.skybox.scale.setScalar(10000);
        this.scene.add(this.skybox);

        // sphere
        geometry = new IcosahedronGeometry(20, 0);
        material = new MeshStandardMaterial({
            roughness: 0.0,
            envMap: this.cubeCamera.renderTarget.texture,
            side: DoubleSide,
        });
        this.sphere = new Mesh(geometry, material);
        this.scene.add(this.sphere);

        // set initial values from settings
        this.updateGui();
    }

    updateGui() {
        // update sun position
        const theta = Math.PI * (settings.inclination - 0.5);
        var phi = 2 * Math.PI * (settings.azimuth - 0.5);
        const position = new Vector3(
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
            Math.sin(phi) * Math.cos(theta),
        );

        // update uniforms
        this.skybox.material.uniforms.turbidity.value = settings.turbidity;
        this.skybox.material.uniforms.rayleigh.value = settings.rayleigh;
        this.skybox.material.uniforms.luminance.value = settings.luminance;
        this.skybox.material.uniforms.sunPosition.value = position;
    }

    resize(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    update(elapsedTime) {
        this.sphere.visible = false;
        this.cubeCamera.update(this.renderer, this.scene);
        this.sphere.visible = true;

        this.sphere.rotation.x = elapsedTime;
        this.sphere.rotation.y = elapsedTime;

        this.renderer.render(this.scene, this.camera);
    }

    record(elapsedTime) {
        // const time = (.001 * (performance.now() - elapsedTime)) % this.loop.duration;
        // this.crystal.rotation.x = time * 2 * Math.PI / this.loop.duration;
        // this.crystal.rotation.y = time * Math.PI / this.loop.duration;
        this.renderer.render(this.scene, this.camera);
    }
}

export default Crystalline;

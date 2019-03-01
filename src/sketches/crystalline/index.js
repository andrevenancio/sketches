import {
    IcosahedronGeometry,
    SphereGeometry,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    ShaderMaterial,
    BackSide,
    Vector3,
} from 'three';
import OrbitControls from 'app/utils/orbit-controls';
import Template from 'app/sketches/template';

const settings = {
    fov: 50,
    rayX: 1,
    rayY: 0,
    rayZ: 0,
};

class Crystalline extends Template {

    updateGui() {
        this.camera.fov = settings.fov;
        this.camera.updateProjectionMatrix();

        this.ray.x = settings.rayX;
        this.ray.y = settings.rayY;
        this.ray.z = settings.rayZ;
    }

    setup() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(global.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(settings.fov, 1, 1, 1000);
        this.camera.position.z = 500;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.gui.add(settings, 'fov', 15, 90).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'rayX', -1, 1).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'rayY', -1, 1).onChange(this.updateGui.bind(this));
        this.gui.add(settings, 'rayZ', -1, 1).onChange(this.updateGui.bind(this));
    }

    init() {
        this.ray = new Vector3(settings.rayX, settings.rayY, settings.rayZ);
        const geometry = new SphereGeometry(200, 16, 16);
        const material = new ShaderMaterial({
            uniforms: {
                u_ray: { value: this.ray },
            },
            vertexShader: `
                varying vec2 v_uv;

                void main() {
                    v_uv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_ray;

                varying vec2 v_uv;

                vec4 background(vec3 ray) {
                    vec3 bg = vec3(0.6 + clamp(-ray.y, 0.0, 1.0), 0.7, 0.8 + (0.4 * ray.x) * abs(ray.z));
                    bg += vec3(10.0, 6.0, 4.0) * 4.0 * pow(clamp(dot(ray, normalize(vec3(6.0, 10.0, 8.0))), 0.0, 1.0), 64.0);
                    // bg += vec3(3.0, 5.0, 7.0) * abs(1.0 - ray.z);
                    return vec4(bg, 1.0);
                }

                void main() {
                    vec4 color = background(vec3(v_uv, 1.0) + u_ray);

                    gl_FragColor = color;
                }
            `,
        });
        material.side = BackSide;
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        console.log('ray', this.ray);
    }

    resize(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    record(elapsedTime) {
        const time = (.001 * (performance.now() - elapsedTime)) % this.loop.duration;
        this.mesh.rotation.x = time * 2 * Math.PI / this.loop.duration;
        this.mesh.rotation.y = time * 3 * Math.PI / this.loop.duration;
        this.renderer.render(this.scene, this.camera);
    }
}

export default Crystalline;

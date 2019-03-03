import { Vector3 } from 'three';

const shader = {
    uniforms: {
        u_light: { value: new Vector3(0.9, -1.0, 0.9) },
    },
    vertexShader: `
        varying vec3 v_normal;
        varying vec3 v_position;

        void main() {
            vec4 position = modelViewMatrix * vec4(position, 1.0);
            v_normal = normal;
            v_position = position.xyz;
            gl_Position = projectionMatrix * position;
        }
    `,
    fragmentShader: `
        uniform vec3 u_light;

        varying vec3 v_normal;
        varying vec3 v_position;

        vec4 background(vec3 ray, vec3 baseColor, vec3 light) {
            // background base colour
            vec3 color = baseColor;

            // adds a bit of gradient
            color += vec3(clamp(-ray.y, 0.0, 1.0) / 4.0);

            // draw light
            color += vec3(1.0) * 0.4 * pow(clamp(dot(ray, normalize(light)), 0.0, 1.0), 8.0);

            // draw yellow glow around light
            color += vec3(1.0, 1.0, 0.8) * 0.9 * pow(clamp(dot(ray, normalize(light)), 0.0, 1.0), 64.0);

            // draw a subtle gradient on top
            color += vec3(1.0, 0.898, 0.789) * abs(1.0 - ray.y) / 30.0;

            return vec4(color, 1.0);
        }

        void main() {
            vec3 ray = normalize(reflect(v_position - cameraPosition, v_normal));
            vec4 color = background(ray, vec3(0.05), u_light);

            gl_FragColor = color;
        }
    `,
};

export default shader;

import { Vector3 } from 'three';

const shader = {
    uniforms: {
        u_texture: { value: null },
    },
    vertexShader: `
        varying vec3 v_position;
        varying vec3 v_normal;

        void main() {
            vec4 position = modelViewMatrix * vec4(position, 1.0);
            v_position = position.xyz;
            v_normal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * position;
        }
    `,
    fragmentShader: `
        uniform sampler2D u_texture;

        varying vec3 v_position;
        varying vec3 v_normal;

        void main() {
            // flat shading
            vec3 flatNormal = normalize(cross(dFdx(v_position), dFdy(v_position)));

            vec3 r = reflect(v_position, flatNormal);
            float m = 2.0 * sqrt(pow(r.x, 2.0) + pow(r.y, 2.0) + pow(r.z + 1.0, 2.0));
            vec2 vN = r.xy / m + 0.5;

            vec3 color = texture2D(u_texture, vN).rgb;
            gl_FragColor = vec4(color, 1.0);
        }
    `,
};

export default shader;

import * as THREE from 'three';

const vertexShader = `
    varying vec2 vUv;

    void main()
    {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;

    varying vec2 vUv;

    float random(in float x){
    return fract(sin(x)*43758.5453);
    }

    float random(in vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    float rchar(in vec2 outer,in vec2 inner){
    float grid = 5.;
    vec2 margin = vec2(.2,.05);
    float seed = 23.;
    vec2 borders = step(margin,inner)*step(margin,1.-inner);
    return step(.5,random(outer*seed+floor(inner*grid))) * borders.x * borders.y;
    }

    vec3 matrix(in vec2 st){
    float rows = 0.05;
    vec2 ipos = floor(st*rows);

    ipos += vec2(.0,floor(u_time*20.*random(ipos.x)));

    vec2 fpos = fract(st*rows);
    vec2 center = (.5-fpos);

    float pct = random(ipos);
    float glow = (1.-dot(center,center)*3.)*1.5;

    return vec3(0,rchar(ipos,fpos) * pct * glow,0);
    }

    void main(){
    vec2 st =  u_resolution * vUv.xy;
    vec3 color = matrix(st);
    gl_FragColor = vec4(color , 1);
    }
`;

const MatrixMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        u_mouse: { value: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
        u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
        u_time: { value: 0.0 }
    },
    blending: THREE.AdditiveBlending,
    depthTest: true,
    //glslVersion:THREE.GLSL3
});

export default MatrixMaterial;
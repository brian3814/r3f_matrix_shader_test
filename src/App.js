import React, { Suspense, useRef } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./styles.css";
import MatrixMaterial from "./MatrixMaterial";
import * as THREE from "three";
import {OrbitControls} from '@react-three/drei'



const ArWing = () => {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "models/scene.gltf");
  const { scene, gl } = useThree();

  const fox = gltf.scene;
  fox.traverse((m) => {
    if (m instanceof THREE.Mesh) {
      m.material = MatrixMaterial;
    }
  });
  const clock = new THREE.Clock();
  let previousTime = 0;
  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    MatrixMaterial.uniforms.u_time.value = clock.getElapsedTime();

  });
  document.addEventListener("keypress", function(event) {
    console.log(event);
  });

  window.scene = scene;
  window.group = group;
  window.gl = gl;
  return (
    <primitive object={fox}/>
  );
};

export default function App() {
  return (
    <>
      <Canvas
        gl={{antialias:true}}
        mode='concurrent'
        frameloop='always'
        style={{ background: "black" }}>
        <directionalLight intensity={0.5} />
        <OrbitControls/>
        <Suspense fallback={null}>
          <ArWing />
        </Suspense>
      </Canvas>
      <a
        href="https://codeworkshop.dev/blog/2020-03-31-creating-a-3d-spacefox-scene-with-react-three-fiber/"
        className="blog-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Blog Post
      </a>
    </>
  );
}

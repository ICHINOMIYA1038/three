import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Sample2() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let sphere: THREE.Mesh, lightSphere: THREE.Mesh;
    let light: THREE.PointLight;

    // レンダラーの作成
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンの作成
    scene = new THREE.Scene();

    // カメラの作成
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 球体の作成
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // MeshPhongMaterialを使用して光沢のあるマテリアルを作成
    sphere = new THREE.Mesh(geometry, material);

    // 球体をシーンに追加
    scene.add(sphere);

    // ライトの作成
    light = new THREE.PointLight(0xffffff, 1, 100); // ポイントライトを作成
    scene.add(light);

    // ライトの位置を制御する球体の作成
    const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    scene.add(lightSphere);

    // アニメーションのループ処理
    const animate = () => {
      requestAnimationFrame(animate);

      // ライトを回転させる
      const time = Date.now() * 0.001;
      const radius = 3;
      light.position.x = Math.cos(time) * radius;
      light.position.z = Math.sin(time) * radius;
      lightSphere.position.copy(light.position); // ライト制御用の球体もライトの位置と同期させる

      // 球体を回転させる
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      // レンダリング
      renderer.render(scene, camera);
    };

    animate();

    // ウィンドウのリサイズイベントに対するリスナーを追加
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // カメラのアスペクト比を更新
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // レンダラーのサイズを更新
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // コンポーネントがアンマウントされる際にリサイズイベントのリスナーを削除
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Sample(){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
      let sphere: THREE.Mesh;
  
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
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);
  
      // 影の設定
      renderer.shadowMap.enabled = true;
      sphere.castShadow = true; // 球体が影を生成するように設定
      light.castShadow = true; // ライトが影を生成するように設定
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
  
      // アニメーションのループ処理
      const animate = () => {
        requestAnimationFrame(animate);
  
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


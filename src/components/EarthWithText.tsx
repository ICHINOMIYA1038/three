import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader , Font} from 'three/examples/jsm/loaders/FontLoader.js';


export default function EarthWithText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let earth: THREE.Mesh;

    // レンダラーの作成
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // シーンの作成
    scene = new THREE.Scene();

    // カメラの作成
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 球体の作成
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // テクスチャの読み込みとマテリアルへの適用
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/textures/earth.jpg'); // 地球のテクスチャ画像へのパスを指定
    const material = new THREE.MeshPhongMaterial({ map: texture }); // マテリアルにテクスチャを適用

    earth = new THREE.Mesh(geometry, material);

    // 球体をシーンに追加
    scene.add(earth);

    // 地球の周りにテキストを配置するためのグループ
    const textGroup = new THREE.Group();
    scene.add(textGroup);

    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font: Font) => { // Replace with the path to your font file
        const textGeometry = new TextGeometry('Hello, World', {
          font: font,
          size: 0.2,
          height: 0.02,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 白色のマテリアル
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(1.5, 0, 0); // テキストの位置を地球から適切な位置に設定
    
        textGroup.add(textMesh);
    });


    // アニメーションのループ処理
    const animate = () => {
      requestAnimationFrame(animate);

      // ライトを回転させる（不要になるのでコメントアウト）
      // const time = Date.now() * 0.001;
      // const radius = 3;
      // light.position.x = Math.cos(time) * radius;
      // light.position.z = Math.sin(time) * radius;
      // lightSphere.position.copy(light.position);

      // 球体を回転させる
      earth.rotation.y += 0.005;

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
}

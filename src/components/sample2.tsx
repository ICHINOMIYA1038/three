import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader , Font} from 'three/examples/jsm/loaders/FontLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';



export default function EarthTextureSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let mixer: THREE.AnimationMixer | null = null;
  let animations: THREE.AnimationClip[] = [];


  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let sphere: THREE.Mesh;

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
    const texture = textureLoader.load('textures/earth.jpg'); // 地球のテクスチャ画像へのパスを指定
    const material = new THREE.MeshPhongMaterial({ map: texture }); // マテリアルにテクスチャを適用

    sphere = new THREE.Mesh(geometry, material);

    // 球体をシーンに追加
    scene.add(sphere);

    // 回転するライトの作成
    const light = new THREE.PointLight(0xffffff, 1, 100);
    scene.add(light);

    //上からのライト
    const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
    topLight.position.set(0, 1, 0); // 上方向からの光源
    scene.add(topLight);


    // ライトの位置を制御する球体の作成（回転させることは無くなるので、コメントアウト）
    const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    //scene.add(lightSphere);

    //テキストの作成
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/gentilis_regular.typeface.json', (font: Font) => { 
        const textGeometry = new TextGeometry('Hello,World', {
          font: font,
          size: 1,
          height: 0.02,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 白色のマテリアル
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-3, 3, -5); // テキストの位置を地球から適切な位置に設定
    
        textGroup.add(textMesh);
    });

    //fbxモデルの表示
    const fbxLoader = new FBXLoader();
    fbxLoader.load('/model/Walking.fbx', (fbxModel) => {
    // You can adjust the position, rotation, and scale of the model as needed.
    fbxModel.position.set(0, 0, 0);
    fbxModel.rotation.set(0, 0, 0);
    fbxModel.scale.set(0.01, 0.01, 0.01);

    // Add the FBX model to the scene
    scene.add(fbxModel);

    mixer = new THREE.AnimationMixer(fbxModel);
    animations = fbxModel.animations;
    if (animations && animations.length > 0) {
      mixer.clipAction(animations[0]).play(); // Start with Animation 0
    }
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'a':
        if (mixer && animations.length >= 1) {
          mixer.stopAllAction();
          mixer.clipAction(animations[0]).play();
        }
        break;
      case 'b':
        if (mixer && animations.length >= 2) {
          mixer.stopAllAction();
          mixer.clipAction(animations[1]).play();
        }
        break;
      default:
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);



    // アニメーションのループ処理
    const animate = () => {
      requestAnimationFrame(animate);

      // ライトを回転させる（不要になるのでコメントアウト）
     const time = Date.now() * 0.001;
    const radius = 3;
     light.position.x = Math.cos(time) * radius;
      light.position.z = Math.sin(time) * radius;
     lightSphere.position.copy(light.position);

      // 球体を回転させる
      sphere.rotation.y += 0.005;

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
      window.removeEventListener('keydown', handleKeyDown);

    };
  }, []);

  return <canvas ref={canvasRef} />;
}

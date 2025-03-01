import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls = ({ focusMode = 'galaxy', solarSystemPosition = [3, 0, 5] }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();
  
  // カメラの初期位置を設定
  useEffect(() => {
    camera.position.set(25, 15, 25);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // マウスの状態を管理
  const mouse = useRef({
    down: false,
    prevX: 0,
    prevY: 0,
    button: -1
  });
  
  // ズーム状態
  const zoom = useRef({
    value: 30,
    target: 30,
    min: 5,
    max: 100
  });
  
  // フォーカスターゲット
  const target = useRef(new THREE.Vector3(0, 0, 0));
  
  // 回転角度
  const rotation = useRef({
    azimuth: Math.PI / 4,
    zenith: Math.PI / 6,
    target: {
      azimuth: Math.PI / 4,
      zenith: Math.PI / 6
    }
  });
  
  // フォーカスモードが変更されたときにカメラパラメータを更新
  useEffect(() => {
    if (focusMode === 'galaxy') {
      // 銀河系にフォーカスする場合
      zoom.current.target = 30;
      target.current.set(0, 0, 0);
    } else if (focusMode === 'solarSystem') {
      // 太陽系にフォーカスする場合
      zoom.current.target = 10;
      target.current.set(
        solarSystemPosition[0],
        solarSystemPosition[1],
        solarSystemPosition[2]
      );
    }
  }, [focusMode, solarSystemPosition]);
  
  // マウスイベントハンドラを設定
  useEffect(() => {
    const canvas = gl.domElement;
    
    const onMouseDown = (e) => {
      mouse.current.down = true;
      mouse.current.prevX = e.clientX;
      mouse.current.prevY = e.clientY;
      mouse.current.button = e.button;
    };
    
    const onMouseUp = () => {
      mouse.current.down = false;
      mouse.current.button = -1;
    };
    
    const onMouseMove = (e) => {
      if (mouse.current.down) {
        const deltaX = e.clientX - mouse.current.prevX;
        const deltaY = e.clientY - mouse.current.prevY;
        
        // 左ボタンドラッグで回転
        if (mouse.current.button === 0) {
          rotation.current.target.azimuth -= deltaX * 0.01;
          rotation.current.target.zenith = Math.max(
            0.1, 
            Math.min(Math.PI / 2 - 0.1, rotation.current.target.zenith - deltaY * 0.01)
          );
        }
        
        mouse.current.prevX = e.clientX;
        mouse.current.prevY = e.clientY;
      }
    };
    
    const onWheel = (e) => {
      zoom.current.target = Math.max(
        zoom.current.min,
        Math.min(zoom.current.max, zoom.current.target + e.deltaY * 0.05)
      );
    };
    
    // イベントリスナーを追加
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel);
    
    // クリーンアップ
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [gl]);
  
  // アニメーションフレームごとにカメラを更新
  useFrame(() => {
    // イージングを適用して滑らかに動かす
    rotation.current.azimuth += (rotation.current.target.azimuth - rotation.current.azimuth) * 0.1;
    rotation.current.zenith += (rotation.current.target.zenith - rotation.current.zenith) * 0.1;
    zoom.current.value += (zoom.current.target - zoom.current.value) * 0.1;
    
    // 球面座標をXYZに変換
    const r = zoom.current.value;
    const phi = rotation.current.zenith;
    const theta = rotation.current.azimuth;
    
    // 現在のフォーカスターゲットを中心にカメラを配置
    camera.position.x = target.current.x + r * Math.sin(phi) * Math.cos(theta);
    camera.position.y = target.current.y + r * Math.cos(phi);
    camera.position.z = target.current.z + r * Math.sin(phi) * Math.sin(theta);
    
    // フォーカスターゲットを見る
    camera.lookAt(target.current);
  });
  
  return null;
};

export default CameraControls; 
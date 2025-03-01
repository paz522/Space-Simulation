import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Planet = ({ 
  position = [0, 0, 0], 
  size = 1, 
  color = '#ffffff', 
  orbitRadius = 10,
  orbitSpeed = 0.01,
  rotationSpeed = 0.01,
  initialAngle = 0,
  textureMap = null,
  showOrbit = true,
  name = '',
  tilt = 0, // 惑星の軸の傾き（ラジアン）
  emissive = false, // 発光機能（太陽など）
  parentPlanet = null // 親惑星（衛星の場合）
}) => {
  const planetRef = useRef();
  const orbitRef = useRef();
  const planetGroupRef = useRef();
  const [planetPosition, setPlanetPosition] = useState([0, 0, 0]);
  
  // 軌道上の位置を計算
  const angle = useRef(initialAngle);
  const parentAngle = useRef(parentPlanet?.initialAngle || 0);
  
  useFrame(() => {
    if (planetGroupRef.current && planetRef.current) {
      // 親惑星がある場合（衛星）、親惑星の動きに合わせて衛星の位置を調整
      if (parentPlanet) {
        parentAngle.current += parentPlanet.orbitSpeed;
        
        // 親惑星の位置を計算
        const parentX = Math.cos(parentAngle.current) * parentPlanet.orbitRadius;
        const parentZ = Math.sin(parentAngle.current) * parentPlanet.orbitRadius;
        
        // 惑星グループの位置を親惑星の位置に設定
        planetGroupRef.current.position.x = parentX;
        planetGroupRef.current.position.z = parentZ;
      }
      
      // 軌道上の位置を更新
      angle.current += orbitSpeed;
      
      const x = Math.cos(angle.current) * orbitRadius;
      const z = Math.sin(angle.current) * orbitRadius;
      
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;
      
      // 惑星の位置を状態として保存（名前表示のため）
      const worldPosition = new THREE.Vector3();
      planetRef.current.getWorldPosition(worldPosition);
      setPlanetPosition([worldPosition.x, worldPosition.y, worldPosition.z]);
      
      // 自転（軸の傾きを考慮）
      // まず軸の傾きを設定
      planetRef.current.rotation.x = tilt;
      
      // 次に軸を中心に回転
      planetRef.current.rotation.y += rotationSpeed;
    }
  });
  
  // 軌道を描画する円を作成
  const orbitPoints = [];
  const orbitSegments = 128;
  for (let i = 0; i <= orbitSegments; i++) {
    const theta = (i / orbitSegments) * Math.PI * 2;
    orbitPoints.push(
      new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius)
    );
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  
  return (
    <group ref={planetGroupRef}>
      {/* 惑星 */}
      <mesh ref={planetRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          map={textureMap}
          metalness={0.05}
          roughness={0.6}
          emissive={emissive ? color : '#111111'}
          emissiveIntensity={emissive ? 1.0 : 0.05}
        />
      </mesh>
      
      {/* 惑星名 */}
      {name && (
        <group position={[planetPosition[0], size + 0.5, planetPosition[2]]}>
          <mesh>
            <sphereGeometry args={[size * 0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
      
      {/* 軌道 */}
      {showOrbit && (
        <line ref={orbitRef} geometry={orbitGeometry}>
          <lineBasicMaterial attach="material" color="#444455" transparent opacity={0.2} />
        </line>
      )}
    </group>
  );
};

export default Planet; 
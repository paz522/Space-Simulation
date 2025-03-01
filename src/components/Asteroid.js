import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const Asteroid = ({ 
  name = '小惑星',
  size = 0.2, 
  orbitRadius = 25, 
  orbitSpeed = 0.005, 
  rotationSpeed = 0.02,
  color = '#8B8B8B',
  irregularShape = true,
  initialAngle = Math.random() * Math.PI * 2,
  inclination = Math.random() * 0.4,
  showOrbit = true
}) => {
  const asteroidRef = useRef();
  const groupRef = useRef();
  
  // 角度を追跡する状態
  const angleRef = useRef(initialAngle);
  
  // 不規則な形状のジオメトリを生成
  const geometry = useMemo(() => {
    if (irregularShape) {
      // 不規則な形状の小惑星を作成
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const positions = geo.attributes.position;
      
      // 頂点をランダムに変位させて不規則な形状にする
      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        
        const distortion = 0.2 + Math.random() * 0.3;
        vertex.multiplyScalar(1 + distortion);
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      positions.needsUpdate = true;
      geo.computeVertexNormals();
      return geo;
    } else {
      // 通常の球体の小惑星
      return new THREE.SphereGeometry(size, 16, 16);
    }
  }, [size, irregularShape]);
  
  // 軌道を描画
  const orbitGeometry = useMemo(() => {
    if (!showOrbit) return null;
    
    const curve = new THREE.EllipseCurve(
      0, 0,                       // 中心
      orbitRadius, orbitRadius,   // x半径、y半径
      0, 2 * Math.PI,             // 開始角度、終了角度
      false,                      // 時計回り
      0                           // 回転
    );
    
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // 軌道の傾きを適用
    const matrix = new THREE.Matrix4().makeRotationX(inclination);
    geometry.applyMatrix4(matrix);
    
    return geometry;
  }, [orbitRadius, showOrbit, inclination]);
  
  // フレームごとに位置と回転を更新
  useFrame((_, delta) => {
    if (asteroidRef.current && groupRef.current) {
      // 角度を更新
      angleRef.current += orbitSpeed * delta;
      
      // 小惑星の軌道上の位置を計算
      const x = Math.cos(angleRef.current) * orbitRadius;
      const z = Math.sin(angleRef.current) * orbitRadius;
      const y = Math.sin(angleRef.current) * orbitRadius * Math.sin(inclination);
      
      groupRef.current.position.set(x, y, z);
      
      // 小惑星自体の回転
      asteroidRef.current.rotation.x += rotationSpeed * delta;
      asteroidRef.current.rotation.y += rotationSpeed * 0.7 * delta;
      asteroidRef.current.rotation.z += rotationSpeed * 0.5 * delta;
    }
  });
  
  return (
    <>
      {/* 軌道を描画 */}
      {showOrbit && (
        <Line
          points={orbitGeometry.attributes.position.array.length > 0 
            ? Array.from({ length: orbitGeometry.attributes.position.count }, (_, i) => {
                return [
                  orbitGeometry.attributes.position.array[i * 3],
                  orbitGeometry.attributes.position.array[i * 3 + 1],
                  orbitGeometry.attributes.position.array[i * 3 + 2]
                ];
              })
            : [[0, 0, 0]]}
          color="#444444"
          opacity={0.5}
          transparent
          lineWidth={1}
        />
      )}
      
      {/* 小惑星グループ */}
      <group ref={groupRef}>
        {/* 小惑星の名前 */}
        <Html position={[0, size * 1.5, 0]} center distanceFactor={10}>
          <div className="asteroid-label" style={{
            fontSize: '8px',
            color: 'white',
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 5px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            {name}
          </div>
        </Html>
        
        {/* 小惑星のメッシュ */}
        <mesh ref={asteroidRef}>
          <bufferGeometry attach="geometry" attributes={geometry.attributes} index={geometry.index} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </group>
    </>
  );
};

export default Asteroid; 
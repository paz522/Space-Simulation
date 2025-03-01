import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCircleTexture } from '../utils/createCircleTexture';

const GalaxySimulation = ({ particleCount = 10000, galaxyRadius = 10, galaxyThickness = 2, rotationSpeed = 0.05 }) => {
  const points = useRef();
  
  // 円形のテクスチャを生成
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  // 星の位置と色を生成
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // 銀河の腕の数
      const armCount = 2;
      
      // 銀河中心からの距離（0から銀河半径まで）
      const radius = Math.random() * galaxyRadius;
      
      // 腕の形状を決める角度
      const branchAngle = (i % armCount) * Math.PI * 2 / armCount;
      
      // 螺旋形状を作るための角度
      const spinAngle = radius * 0.5;
      
      // 最終的な角度
      const randomAngle = Math.random() * Math.PI * 2;
      const mixedAngle = branchAngle + spinAngle + randomAngle * 0.3;
      
      // 銀河平面からの高さ（z軸）- ガウス分布に近い形で厚さを設定
      const randomZ = Math.random() * 2 - 1;
      const z = randomZ * galaxyThickness * (1 - Math.pow(radius / galaxyRadius, 2) * 0.8);
      
      // 位置の設定
      const i3 = i * 3;
      positions[i3] = Math.cos(mixedAngle) * radius;     // x
      positions[i3 + 1] = Math.sin(mixedAngle) * radius; // y
      positions[i3 + 2] = z;                            // z
      
      // 色の設定 - 中心は黄色/白、外側は青
      const centerColor = new THREE.Color('#ffffaa');
      const edgeColor = new THREE.Color('#4444ff');
      const mixedColor = centerColor.clone().lerp(edgeColor, radius / galaxyRadius);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, [particleCount, galaxyRadius, galaxyThickness]);
  
  // 銀河の回転アニメーション
  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += rotationSpeed * 0.01;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        vertexColors
        transparent={true}
        alphaTest={0.01}
        depthWrite={false}
        map={circleTexture}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default GalaxySimulation; 
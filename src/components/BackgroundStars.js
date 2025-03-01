import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createCircleTexture } from '../utils/createCircleTexture';

const BackgroundStars = ({ count = 5000, radius = 100 }) => {
  // 円形のテクスチャを生成
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  // 星の位置と色を生成
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // 均一に分布した点を球面上に配置
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random()); // 立方根で分布を調整して遠い星も見えるようにする
      
      const i3 = i * 3;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // ランダムな色（青白色を基調に）
      const brightness = 0.5 + Math.random() * 0.5;
      const color = new THREE.Color();
      
      // 青白色から淡い黄色までの星をランダムに
      if (Math.random() > 0.8) {
        // 黄色っぽい星（少数）
        color.setRGB(brightness, brightness * 0.9, brightness * 0.6);
      } else if (Math.random() > 0.6) {
        // 白色の星
        color.setRGB(brightness, brightness, brightness);
      } else {
        // 青白色の星（多数）
        color.setRGB(brightness * 0.8, brightness * 0.9, brightness);
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count, radius]);
  
  return (
    <points>
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
        size={0.7}
        sizeAttenuation={true}
        vertexColors
        transparent={true}
        opacity={0.8}
        depthWrite={false}
        map={circleTexture}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default BackgroundStars; 
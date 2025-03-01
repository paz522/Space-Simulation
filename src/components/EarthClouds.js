import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EarthClouds = ({
  size = 1.02,
  orbitRadius = 10,
  orbitSpeed = 0.01,
  rotationSpeed = 0.024,
  textureMap = null,
  initialAngle = 0,
  tilt = 0.41 // 約23.5度
}) => {
  const cloudsRef = useRef();
  const cloudsGroupRef = useRef();
  const angle = useRef(initialAngle);
  
  useFrame(() => {
    if (cloudsGroupRef.current && cloudsRef.current) {
      // 地球の軌道に合わせて雲も回転
      angle.current += orbitSpeed;
      
      // 地球の位置を計算
      const x = Math.cos(angle.current) * orbitRadius;
      const z = Math.sin(angle.current) * orbitRadius;
      
      // グループの位置を更新
      cloudsGroupRef.current.position.x = x;
      cloudsGroupRef.current.position.z = z;
      
      // 雲の傾きを設定
      cloudsRef.current.rotation.x = tilt;
      
      // 雲の自転（地球より少し速く）
      cloudsRef.current.rotation.y += rotationSpeed;
    }
  });
  
  return (
    <group ref={cloudsGroupRef}>
      <mesh ref={cloudsRef} rotation={[tilt, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={textureMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default EarthClouds; 
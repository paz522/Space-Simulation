import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SaturnRings = ({ 
  innerRadius = 2.0, 
  outerRadius = 4.0, 
  texture = null,
  orbitRadius = 30,
  orbitSpeed = 0.0025,
  initialAngle = 0,
  tilt = 0.47 // 約27度
}) => {
  const ringsRef = useRef();
  const ringsGroupRef = useRef();
  const angle = useRef(initialAngle);
  
  useFrame(() => {
    if (ringsGroupRef.current && ringsRef.current) {
      // 惑星の軌道に合わせて環も回転
      angle.current += orbitSpeed;
      
      // 土星の位置を計算
      const x = Math.cos(angle.current) * orbitRadius;
      const z = Math.sin(angle.current) * orbitRadius;
      
      // グループの位置を更新
      ringsGroupRef.current.position.x = x;
      ringsGroupRef.current.position.z = z;
      
      // 環の傾きを設定
      ringsRef.current.rotation.x = tilt;
    }
  });
  
  return (
    <group ref={ringsGroupRef}>
      <mesh ref={ringsRef} rotation={[tilt, 0, 0]}>
        <ringGeometry args={[innerRadius, outerRadius, 64]} />
        <meshStandardMaterial 
          map={texture}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.9}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export default SaturnRings; 
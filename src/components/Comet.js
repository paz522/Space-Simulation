import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line, Points, Point } from '@react-three/drei';
import * as THREE from 'three';

const Comet = ({ 
  position = [0, 0, 0], 
  size = 0.2, 
  color = '#FFFFFF', 
  orbitRadius = 30,
  perihelion = 20, // 近日点距離
  aphelion = 50,   // 遠日点距離
  orbitSpeed = 0.001,
  rotationSpeed = 0.01,
  initialAngle = 0,
  showOrbit = true,
  name = '',
  tailLength = 5,  // 尾の長さ
  tailColor = '#88CCFF', // 尾の色
  inclination = 0.3, // 軌道傾斜角（ラジアン）
  textureMap = null
}) => {
  const cometRef = useRef();
  const cometTailRef = useRef();
  const orbitRef = useRef();
  const cometGroupRef = useRef();
  
  // 軌道上の位置を計算
  const angle = useRef(initialAngle);
  
  // 楕円軌道のパラメータを計算
  const semiMajorAxis = useMemo(() => (perihelion + aphelion) / 2, [perihelion, aphelion]);
  const eccentricity = useMemo(() => (aphelion - perihelion) / (aphelion + perihelion), [aphelion, perihelion]);
  const focus = useMemo(() => Math.sqrt(semiMajorAxis * semiMajorAxis * eccentricity * eccentricity), [semiMajorAxis, eccentricity]);
  
  // 尾のパーティクル生成
  const tailParticles = useMemo(() => {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color(tailColor);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // 尾の位置（後でupdateで更新）
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // 色（中心から離れるほど薄くなる）
      const alpha = 1 - (i / particleCount);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // サイズ（ランダム）
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return {
      positions,
      colors,
      sizes
    };
  }, [tailColor]);
  
  // 尾のジオメトリとマテリアル
  const tailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(tailParticles.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(tailParticles.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(tailParticles.sizes, 1));
    return geometry;
  }, [tailParticles]);
  
  const tailMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);
  
  useFrame(() => {
    if (cometGroupRef.current && cometRef.current) {
      // 軌道上の位置を更新
      angle.current += orbitSpeed;
      
      // 楕円軌道の計算
      const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle.current));
      
      // 傾斜角を考慮した軌道計算
      const x = r * Math.cos(angle.current);
      const y = r * Math.sin(angle.current) * Math.sin(inclination);
      const z = r * Math.sin(angle.current) * Math.cos(inclination);
      
      cometRef.current.position.x = x;
      cometRef.current.position.y = y;
      cometRef.current.position.z = z;
      
      // 自転
      cometRef.current.rotation.y += rotationSpeed;
      
      // 尾の更新
      if (cometTailRef.current) {
        // 太陽からの距離を計算
        const distanceFromSun = Math.sqrt(x * x + y * y + z * z);
        
        // 太陽に近いほど尾が長くなる
        const currentTailLength = tailLength * (1 - Math.min(1, distanceFromSun / aphelion) * 0.7);
        
        // 太陽の方向とは反対に尾を伸ばす
        const tailDirection = new THREE.Vector3(-x, -y, -z).normalize();
        
        // パーティクルの位置を更新
        const positions = tailGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          const ratio = i / (positions.length / 3);
          
          // 彗星の位置
          positions[i3] = x;
          positions[i3 + 1] = y;
          positions[i3 + 2] = z;
          
          // 尾の方向に伸ばす
          positions[i3] += tailDirection.x * currentTailLength * ratio;
          positions[i3 + 1] += tailDirection.y * currentTailLength * ratio;
          positions[i3 + 2] += tailDirection.z * currentTailLength * ratio;
          
          // ランダム性を追加
          positions[i3] += (Math.random() - 0.5) * ratio * 0.5;
          positions[i3 + 1] += (Math.random() - 0.5) * ratio * 0.5;
          positions[i3 + 2] += (Math.random() - 0.5) * ratio * 0.5;
        }
        
        tailGeometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  // 軌道を描画する楕円を作成
  const orbitPoints = [];
  const orbitSegments = 128;
  for (let i = 0; i <= orbitSegments; i++) {
    const theta = (i / orbitSegments) * Math.PI * 2;
    const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
    
    orbitPoints.push(
      new THREE.Vector3(
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(inclination),
        r * Math.sin(theta) * Math.cos(inclination)
      )
    );
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  
  return (
    <group ref={cometGroupRef}>
      {/* 彗星の核 */}
      <group ref={cometRef} position={position}>
        {/* 彗星の名前 */}
        {name && (
          <Html position={[0, size * 2, 0]} center distanceFactor={10}>
            <div className="comet-label" style={{
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
        )}
        
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            map={textureMap}
            metalness={0.1}
            roughness={0.6}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* 彗星の尾（パーティクル） */}
      <Points ref={cometTailRef}>
        <bufferGeometry
          attributes={{
            position: new THREE.BufferAttribute(tailGeometry.attributes.position.array, 3),
            color: new THREE.BufferAttribute(tailGeometry.attributes.color.array, 3),
          }}
        />
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
      
      {/* 軌道 */}
      {showOrbit && (
        <Line
          ref={orbitRef}
          points={orbitPoints.map(v => [v.x, v.y, v.z])}
          color="#555566"
          transparent
          opacity={0.2}
        />
      )}
    </group>
  );
};

export default Comet; 
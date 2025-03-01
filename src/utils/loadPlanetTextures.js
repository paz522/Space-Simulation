import * as THREE from 'three';
import { createPlanetTexture } from './createPlanetTexture';

// テクスチャのロード関数
const loadTexture = (path) => {
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// デフォルトのテクスチャを生成する関数（テクスチャが利用できない場合のフォールバック）
const createDefaultTexture = (color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // 惑星らしさを出すためにテクスチャに多少のノイズを追加
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 0.5 + 0.5;
    const brightness = Math.random() * 0.3 + 0.7;
    
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${brightness * 0.2})`;
    context.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// 惑星ごとのカラーマップ (フォールバック用)
const planetColors = {
  sun: '#FDB813',
  mercury: '#B7B7B7',
  venus: '#E6CA9A',
  earth: '#3B8CF2',
  mars: '#B22E1C',
  jupiter: '#B5975A',
  saturn: '#E9D496',
  uranus: '#CAEAE8',
  neptune: '#3D58E5',
  moon: '#CCCCCC'
};

// 実際のテクスチャのURL (Solar System Scopeからのテクスチャをローカルに保存したと仮定)
const textureUrls = {
  sun: '/textures/sun.jpg',
  mercury: '/textures/mercury.jpg',
  venus: '/textures/venus.jpg',
  earth: '/textures/earth.jpg',
  earthClouds: '/textures/earth_clouds.jpg',
  mars: '/textures/mars.jpg',
  jupiter: '/textures/jupiter.jpg',
  saturn: '/textures/saturn.jpg',
  saturnRings: '/textures/saturn_rings.png',
  uranus: '/textures/uranus.jpg',
  neptune: '/textures/neptune.jpg',
  moon: '/textures/moon.jpg'
};

// テクスチャのロードを試み、失敗した場合はプログラムで生成したテクスチャを返す
export const loadPlanetTexture = (planet) => {
  console.log(`惑星 ${planet} のテクスチャをロード中...`);
  
  // すべての惑星に対して、常に生成テクスチャを使用する
  // これにより、テクスチャファイルの有無に関わらず一貫した表示が可能
  try {
    console.log(`${planet} の生成テクスチャを使用します`);
    return createPlanetTexture(planet);
  } catch (error) {
    console.error(`${planet} のテクスチャ生成に失敗しました:`, error);
    // 最後の手段としてデフォルトカラーのテクスチャを返す
    return createDefaultTexture(planetColors[planet] || '#FFFFFF');
  }
};

// 全ての惑星のテクスチャをロードする
export const loadAllPlanetTextures = () => {
  console.log('全惑星のテクスチャをロード中...');
  const textures = {};
  
  // 通常の惑星テクスチャをロード
  Object.keys(planetColors).forEach(planet => {
    textures[planet] = loadPlanetTexture(planet);
  });
  
  // 追加のテクスチャをロード
  if (!textures.earthClouds) {
    textures.earthClouds = loadPlanetTexture('earthClouds');
  }
  
  if (!textures.saturnRings) {
    textures.saturnRings = loadPlanetTexture('saturnRings');
  }
  
  return textures;
}; 
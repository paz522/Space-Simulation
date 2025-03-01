import * as THREE from 'three';

// 惑星テクスチャをプログラムで生成するユーティリティ関数
export const createPlanetTexture = (planet, options = {}) => {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 512;
  canvas.height = options.height || 512;
  
  const context = canvas.getContext('2d');
  
  // 惑星の種類に応じて異なるテクスチャを生成
  switch(planet) {
    case 'sun':
      createSunTexture(context, canvas.width, canvas.height);
      break;
    case 'mercury':
      createMercuryTexture(context, canvas.width, canvas.height);
      break;
    case 'venus':
      createVenusTexture(context, canvas.width, canvas.height);
      break;
    case 'earth':
      createEarthTexture(context, canvas.width, canvas.height);
      break;
    case 'earthClouds':
      createEarthCloudsTexture(context, canvas.width, canvas.height);
      break;
    case 'mars':
      createMarsTexture(context, canvas.width, canvas.height);
      break;
    case 'jupiter':
      createJupiterTexture(context, canvas.width, canvas.height);
      break;
    case 'saturn':
      createSaturnTexture(context, canvas.width, canvas.height);
      break;
    case 'saturnRings':
      createSaturnRingsTexture(context, canvas.width, canvas.height);
      break;
    case 'uranus':
      createUranusTexture(context, canvas.width, canvas.height);
      break;
    case 'neptune':
      createNeptuneTexture(context, canvas.width, canvas.height);
      break;
    case 'moon':
      createMoonTexture(context, canvas.width, canvas.height);
      break;
    default:
      createDefaultTexture(context, canvas.width, canvas.height, options.color || '#FFFFFF');
  }
  
  return new THREE.CanvasTexture(canvas);
};

// 太陽のテクスチャ
function createSunTexture(ctx, width, height) {
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  gradient.addColorStop(0, '#FFF3B0');
  gradient.addColorStop(0.5, '#FDB813');
  gradient.addColorStop(1, '#FF7B00');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 太陽の表面の特徴（フレア）
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 40 + 10;
    
    const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    flareGradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    flareGradient.addColorStop(1, 'rgba(255,200,0,0)');
    
    ctx.fillStyle = flareGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 水星のテクスチャ
function createMercuryTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#B7B7B7';
  ctx.fillRect(0, 0, width, height);
  
  // クレーター
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 5 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(80, 80, 80, ${Math.random() * 0.5 + 0.2})`;
    ctx.fill();
  }
}

// 金星のテクスチャ
function createVenusTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#E6CA9A';
  ctx.fillRect(0, 0, width, height);
  
  // 大気の渦
  for (let i = 0; i < 10; i++) {
    const centerX = Math.random() * width;
    const centerY = Math.random() * height;
    const radius = Math.random() * 100 + 50;
    
    const vortexGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    vortexGradient.addColorStop(0, 'rgba(255,215,155,0.7)');
    vortexGradient.addColorStop(1, 'rgba(230,202,154,0)');
    
    ctx.fillStyle = vortexGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 地球のテクスチャ
function createEarthTexture(ctx, width, height) {
  // 海
  ctx.fillStyle = '#2756B2';
  ctx.fillRect(0, 0, width, height);
  
  // 大陸
  for (let i = 0; i < 7; i++) {
    drawContinent(ctx, width, height, '#4EA64E');
  }
  
  // 極地
  drawPolarCap(ctx, width, height, 0, 0.1);
  drawPolarCap(ctx, width, height, 0.9, 1.0);
}

// 地球の雲のテクスチャ
function createEarthCloudsTexture(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  
  // 雲の生成
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 50 + 20;
    
    const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    cloudGradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    cloudGradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = cloudGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 火星のテクスチャ
function createMarsTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#B22E1C';
  ctx.fillRect(0, 0, width, height);
  
  // 砂漠と火星の特徴
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 10 + 2;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(170, 60, 30, ${Math.random() * 0.5 + 0.2})`;
    ctx.fill();
  }
  
  // 極冠
  drawPolarCap(ctx, width, height, 0, 0.1, '#FFFFFF');
  drawPolarCap(ctx, width, height, 0.9, 1.0, '#FFFFFF');
}

// 木星のテクスチャ
function createJupiterTexture(ctx, width, height) {
  // ベースグラデーション
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#B5975A');
  gradient.addColorStop(0.2, '#D9C7A0');
  gradient.addColorStop(0.3, '#B5975A');
  gradient.addColorStop(0.5, '#A97A47');
  gradient.addColorStop(0.7, '#B5975A');
  gradient.addColorStop(0.8, '#D9C7A0');
  gradient.addColorStop(1, '#B5975A');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 大赤斑
  const spotX = width * 0.7;
  const spotY = height * 0.4;
  const spotWidth = width * 0.15;
  const spotHeight = height * 0.08;
  
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, spotWidth, spotHeight, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#CF6B42';
  ctx.fill();
}

// 土星のテクスチャ
function createSaturnTexture(ctx, width, height) {
  // ベースグラデーション
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#E9D496');
  gradient.addColorStop(0.2, '#F0E6B0');
  gradient.addColorStop(0.3, '#E9D496');
  gradient.addColorStop(0.5, '#D9BC69');
  gradient.addColorStop(0.7, '#E9D496');
  gradient.addColorStop(0.8, '#F0E6B0');
  gradient.addColorStop(1, '#E9D496');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// 土星の環のテクスチャ
function createSaturnRingsTexture(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  
  // 環の模様
  for (let i = 0; i < height; i++) {
    const opacity = Math.random() * 0.3 + 0.7;
    ctx.fillStyle = `rgba(230, 220, 180, ${opacity})`;
    ctx.fillRect(0, i, width, 1);
    
    // 環の隙間
    if (Math.random() < 0.05) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, i, width, 1);
    }
  }
}

// 天王星のテクスチャ
function createUranusTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#CAEAE8';
  ctx.fillRect(0, 0, width, height);
  
  // 微かな雲模様
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * height;
    const height = Math.random() * 20 + 5;
    
    ctx.fillStyle = 'rgba(180, 240, 235, 0.3)';
    ctx.fillRect(0, y, width, height);
  }
}

// 海王星のテクスチャ
function createNeptuneTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#3D58E5';
  ctx.fillRect(0, 0, width, height);
  
  // 大きな暗い斑点
  const spotX = width * 0.3;
  const spotY = height * 0.6;
  const spotRadius = width * 0.1;
  
  ctx.beginPath();
  ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#20379C';
  ctx.fill();
  
  // 雲のような模様
  for (let i = 0; i < 30; i++) {
    const y = Math.random() * height;
    const height = Math.random() * 15 + 3;
    
    ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.fillRect(0, y, width, height);
  }
}

// 月のテクスチャ
function createMoonTexture(ctx, width, height) {
  // ベースカラー
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(0, 0, width, height);
  
  // クレーター
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 8 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(90, 90, 90, ${Math.random() * 0.6 + 0.2})`;
    ctx.fill();
  }
}

// デフォルトのテクスチャ
function createDefaultTexture(ctx, width, height, color) {
  // ベースカラー
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // ノイズを追加
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2 + 0.5;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
    ctx.fill();
  }
}

// 大陸を描画
function drawContinent(ctx, width, height, color) {
  const centerX = Math.random() * width;
  const centerY = Math.random() * height;
  const continentPoints = [];
  const pointCount = Math.floor(Math.random() * 10) + 10;
  const maxRadius = Math.random() * 150 + 50;
  
  // 大陸の形状のポイントを生成
  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2;
    const radius = Math.random() * maxRadius + maxRadius / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    continentPoints.push({ x, y });
  }
  
  // 大陸を描画
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(continentPoints[0].x, continentPoints[0].y);
  
  for (let i = 1; i < continentPoints.length; i++) {
    ctx.lineTo(continentPoints[i].x, continentPoints[i].y);
  }
  
  ctx.closePath();
  ctx.fill();
}

// 極冠を描画
function drawPolarCap(ctx, width, height, startY, endY, color = '#FFFFFF') {
  ctx.fillStyle = color;
  ctx.fillRect(0, startY * height, width, (endY - startY) * height);
} 
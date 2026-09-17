import * as THREE from "three";

// Qo'shrabot vodiysi: Nurota tog'lari orasidan o'tuvchi yo'l.
// Har sahifa vodiyning o'z joyidan ochiladi (station), sahifa almashganda kamera o'sha joyga uchadi.
// Scroll 0 → sahifaning o'z ko'rinishi, scroll 1 → yo'l ustida, mashinalar yonida.

export interface LandscapeOptions {
  reducedMotion: boolean;
  lowPower: boolean;
  pathname: string;
}

export interface Landscape {
  setProgress(p: number): void;
  setRoute(pathname: string): void;
  dispose(): void;
}

const Z_START = 260;
const Z_END = -1400;
const ROAD_HALF_WIDTH = 5;
const LANE_OFFSET = 2.4;

// ---------- Sahifalar uchun kamera nuqtalari ----------
interface Station {
  z0: number; // scroll 0 dagi yo'l bo'yidagi joy
  travel: number; // scroll davomida yo'l bo'ylab siljish
  height: number; // boshlang'ich balandlik
  side: number; // yo'ldan yon tomonga siljish
  lookDist: number; // qanchalik uzoqqa qaraydi
  pitch: number; // qarash nuqtasi kameradan qancha past
  lookSide: number; // qarash nuqtasining yon siljishi
}
const STATION_KEYS = ["z0", "travel", "height", "side", "lookDist", "pitch", "lookSide"] as const;

const STATIONS = {
  // Vodiy tepasidan umumiy ko'rinish
  home: { z0: 70, travel: 590, height: 165, side: -20, lookDist: 240, pitch: 26, lookSide: 0 },
  // Temir Darvoza qal'alari turgan tepalik
  // (qal'alar sarlavha va kartalar bilan to'silmasligi uchun ekranning o'ng-yuqorisiga tushadi)
  tarix: { z0: -560, travel: 360, height: 70, side: -35, lookDist: 190, pitch: 40, lookSide: -150 },
  // Yo'l bo'yidagi qishloq
  kishilar: { z0: -40, travel: 320, height: 55, side: -28, lookDist: 170, pitch: 26, lookSide: 8 },
  // Baland cho'qqilar orasidan
  joylar: { z0: -300, travel: 420, height: 215, side: 140, lookDist: 320, pitch: 42, lookSide: -40 },
  // Eng balanddan panorama
  galereya: { z0: 220, travel: 640, height: 270, side: 0, lookDist: 440, pitch: 36, lookSide: -80 },
  // Yo'l ustidan, mashinalar oqimi yonida
  yangiliklar: { z0: -380, travel: 300, height: 36, side: 24, lookDist: 110, pitch: 18, lookSide: 0 },
  // Chiroqlar yonida, past
  aloqa: { z0: -190, travel: 260, height: 20, side: -12, lookDist: 80, pitch: 9, lookSide: 0 },
} satisfies Record<string, Station>;

const ROUTE_STATIONS: [string, keyof typeof STATIONS][] = [
  ["/tarix", "tarix"],
  ["/mashhur-kishilar", "kishilar"],
  ["/diqqatga-sazovor-joylar", "joylar"],
  ["/galereya", "galereya"],
  ["/yangiliklar", "yangiliklar"],
  ["/aloqa", "aloqa"],
];

function stationFor(pathname: string): Station {
  for (const [prefix, key] of ROUTE_STATIONS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return STATIONS[key];
  }
  return STATIONS.home;
}

// ---------- Yo'l egri chizig'i ----------
function roadX(z: number) {
  return Math.sin(z * 0.011) * 22 + Math.sin(z * 0.0037 + 1.3) * 46;
}
// roadX(z) ning hosilasi
function roadSlope(z: number) {
  return Math.cos(z * 0.011) * 0.242 + Math.cos(z * 0.0037 + 1.3) * 0.1702;
}

// ---------- Shovqin (value noise + fbm) ----------
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    sum += amp * noise(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}
function ridged(x: number, y: number) {
  let sum = 0;
  let amp = 0.55;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    const n = 1 - Math.abs(noise(x * freq, y * freq) * 2 - 1);
    sum += amp * n * n;
    freq *= 2.1;
    amp *= 0.48;
  }
  return sum;
}
function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function terrainHeight(x: number, z: number) {
  const d = Math.abs(x - roadX(z));
  const valley = smoothstep(12, 130, d);
  const mountains = ridged(x * 0.0065 + 11.3, z * 0.0065) * 150;
  const hills = fbm(x * 0.022, z * 0.022) * 14;
  const far = smoothstep(160, 460, d) * ridged(x * 0.003 + 4, z * 0.003) * 120;
  const h = valley * valley * mountains + hills * smoothstep(8, 26, d) + far;
  // Yo'l atrofi tekis bo'lishi uchun
  return h * smoothstep(7, 16, d);
}

// Takrorlanadigan "tasodifiy" sonlar — qishloq har safar bir xil joylashsin
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

// ---------- Ranglar ----------
const C_STEPPE = new THREE.Color("#8a7a52");
const C_GRASS = new THREE.Color("#5f6443");
const C_ROCK = new THREE.Color("#5b5570");
const C_ROCK_DARK = new THREE.Color("#3e3a55");
const C_SNOW = new THREE.Color("#e4e6f0");

function buildTerrain(lowPower: boolean) {
  const width = 1500;
  const depth = Z_START - Z_END;
  // Kattaroq qirralar: low-poly ko'rinishga mos va GPU uchun ~2 barobar yengil
  const plane = new THREE.PlaneGeometry(width, depth, lowPower ? 90 : 150, lowPower ? 100 : 170);
  plane.rotateX(-Math.PI / 2);
  plane.translate(0, 0, (Z_START + Z_END) / 2);

  const pos = plane.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
  }

  // Low-poly ko'rinish uchun har bir uchburchak alohida rang oladi
  const geo = plane.toNonIndexed();
  plane.dispose();
  geo.computeVertexNormals();

  const p = geo.attributes.position as THREE.BufferAttribute;
  const n = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const h = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    const ny = n.getY(i);
    const jitter = hash(p.getX(i) * 0.37, p.getZ(i) * 0.37) * 0.12 - 0.06;

    if (h < 4) c.copy(C_STEPPE);
    else if (h < 30) c.copy(C_STEPPE).lerp(C_GRASS, smoothstep(4, 30, h));
    else c.copy(C_GRASS).lerp(C_ROCK, smoothstep(30, 70, h));
    if (ny < 0.72) c.lerp(C_ROCK_DARK, smoothstep(0.72, 0.45, ny));
    if (h > 105 && ny > 0.6) c.lerp(C_SNOW, smoothstep(105, 135, h));
    c.offsetHSL(0, 0, jitter);

    for (let k = 0; k < 3; k++) {
      colors[(i + k) * 3] = c.r;
      colors[(i + k) * 3 + 1] = c.g;
      colors[(i + k) * 3 + 2] = c.b;
    }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0 });
  return new THREE.Mesh(geo, mat);
}

// ---------- Temir Darvoza qal'alari (Tarix sahifasi) ----------
function buildFortresses() {
  const group = new THREE.Group();
  const wallMat = new THREE.MeshStandardMaterial({ color: "#b08b5e", flatShading: true, roughness: 1 });
  const gateMat = new THREE.MeshStandardMaterial({ color: "#2e241e", roughness: 1 });

  const wall = new THREE.BoxGeometry(32, 9, 26);
  wall.translate(0, 4.5, 0);
  const keep = new THREE.BoxGeometry(12, 17, 10);
  keep.translate(-4, 8.5, -3);
  const tower = new THREE.CylinderGeometry(3.2, 3.9, 13, 6);
  tower.translate(0, 6.5, 0);
  const gate = new THREE.BoxGeometry(5, 6, 0.6);
  gate.translate(0, 3, 13.1);

  const addFort = (z: number, sideOffset: number, scale: number) => {
    const x = roadX(z) + sideOffset;
    const half = 17 * scale;
    // Qiyalikda osilib qolmasligi uchun eng past nuqtaga o'tqazamiz
    const baseY =
      Math.min(
        ...[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
          [0, 0],
        ].map(([a, b]) => terrainHeight(x + a * half, z + b * half)),
      ) - 1;
    const fort = new THREE.Group();
    fort.position.set(x, baseY, z);
    fort.scale.setScalar(scale);
    fort.rotation.y = 0.3;
    fort.add(new THREE.Mesh(wall, wallMat), new THREE.Mesh(keep, wallMat), new THREE.Mesh(gate, gateMat));
    for (const [tx, tz] of [
      [-16, -13],
      [16, -13],
      [-16, 13],
      [16, 13],
    ]) {
      const t = new THREE.Mesh(tower, wallMat);
      t.position.set(tx, 0, tz);
      fort.add(t);
    }
    group.add(fort);
  };

  // Pastdagi katta qal'a va tepadagi kichigi
  addFort(-760, 42, 1);
  addFort(-830, 78, 0.7);

  return {
    object: group,
    dispose() {
      [wall, keep, tower, gate, wallMat, gateMat].forEach((d) => d.dispose());
    },
  };
}

// ---------- Qishloq (Mashhur kishilar sahifasi) ----------
function buildVillage(lowPower: boolean) {
  const rand = seededRandom(7);
  const group = new THREE.Group();

  const houseCount = lowPower ? 32 : 54;
  const houseGeo = new THREE.BoxGeometry(1, 1, 1);
  houseGeo.translate(0, 0.5, 0);
  const houseMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 });
  const houses = new THREE.InstancedMesh(houseGeo, houseMat, houseCount);

  // Teraklar: baland va ingichka
  const treeCount = lowPower ? 36 : 70;
  const treeGeo = new THREE.ConeGeometry(1.3, 1, 5);
  treeGeo.translate(0, 0.5, 0);
  const treeMat = new THREE.MeshStandardMaterial({ color: "#4f6b3d", flatShading: true, roughness: 1 });
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, treeCount);

  const wallColors = ["#dccfb2", "#e8dfca", "#c9b48f", "#efe8d8"];
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < houseCount; i++) {
    const z = -110 - rand() * 240;
    const side = rand() < 0.5 ? -1 : 1;
    const x = roadX(z) + side * (15 + rand() * 42);
    dummy.position.set(x, terrainHeight(x, z) - 0.4, z);
    dummy.rotation.set(0, -Math.atan(roadSlope(z)) + (rand() - 0.5) * 0.3, 0);
    dummy.scale.set(5 + rand() * 4, 3 + rand() * 1.4, 5 + rand() * 5);
    dummy.updateMatrix();
    houses.setMatrixAt(i, dummy.matrix);
    houses.setColorAt(i, color.set(wallColors[i % wallColors.length]));
  }
  for (let i = 0; i < treeCount; i++) {
    const z = -100 - rand() * 260;
    const side = rand() < 0.5 ? -1 : 1;
    const x = roadX(z) + side * (9 + rand() * 55);
    const h = 7 + rand() * 5;
    dummy.position.set(x, terrainHeight(x, z) - 0.2, z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, h, 1);
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
  }
  group.add(houses, trees);

  return {
    object: group,
    dispose() {
      [houseGeo, houseMat, treeGeo, treeMat, houses, trees].forEach((d) => d.dispose());
    },
  };
}

// ---------- Osmon ----------
function buildSky(sunDir: THREE.Vector3) {
  const geo = new THREE.SphereGeometry(1800, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color("#0c1230") },
      mid: { value: new THREE.Color("#343a72") },
      horizon: { value: new THREE.Color("#e0976c") },
      sunDir: { value: sunDir },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 sunDir;
      varying vec3 vDir;
      void main() {
        vec3 dir = normalize(vDir);
        float h = dir.y;
        vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.22, h));
        col = mix(col, top, smoothstep(0.2, 0.7, h));
        float s = max(dot(dir, sunDir), 0.0);
        col += vec3(1.0, 0.78, 0.5) * pow(s, 900.0) * 1.4;
        col += vec3(1.0, 0.58, 0.32) * pow(s, 12.0) * 0.35;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  return new THREE.Mesh(geo, mat);
}

function buildStars(lowPower: boolean) {
  const count = lowPower ? 350 : 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const y = 0.25 + Math.random() * 0.75;
    const r = Math.sqrt(1 - y * y);
    positions[i * 3] = Math.cos(theta) * r * 1700;
    positions[i * 3 + 1] = y * 1700;
    positions[i * 3 + 2] = Math.sin(theta) * r * 1700;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: "#dfe6ff",
    size: 1.6,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.7,
    fog: false,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

// ---------- Yo'l ----------
// Yo'l markazidan offsetA..offsetB oralig'idagi lenta; dash berilsa uzuq-uzuq chiziladi
function ribbon(offsetA: number, offsetB: number, y: number, step: number, dash?: { on: number; off: number }) {
  const verts: number[] = [];
  const period = dash ? dash.on + dash.off : 0;
  for (let z = Z_START; z > Z_END; z -= step) {
    if (dash && (Z_START - z) % period >= dash.on) continue;
    const corners = [z, z - step].map((zz) => {
      const cx = roadX(zz);
      const s = roadSlope(zz);
      const len = Math.hypot(1, s);
      const nx = 1 / len;
      const nz = -s / len;
      return [
        [cx + nx * offsetA, y, zz + nz * offsetA],
        [cx + nx * offsetB, y, zz + nz * offsetB],
      ];
    });
    const [[a1, b1], [a2, b2]] = corners;
    verts.push(...a1, ...b1, ...a2, ...b1, ...b2, ...a2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Mashinalar ----------
interface Car {
  dir: 1 | -1; // -1: oldinga (−z), 1: qarshi yo'nalish
  phase: number;
  speed: number;
}

// O'zbekiston yo'llaridagidek: oq va kumushrang ko'p
const CAR_COLORS = ["#ecebe6", "#ecebe6", "#ecebe6", "#b4b8c2", "#b4b8c2", "#2a2d38", "#d7a33f", "#3f66b8", "#8e2d3a"];
const WHEEL_OFFSETS = [
  [1.0, 0.38, 1.4],
  [-1.0, 0.38, 1.4],
  [1.0, 0.38, -1.4],
  [-1.0, 0.38, -1.4],
];

export function createLandscape(canvas: HTMLCanvasElement, opts: LandscapeOptions): Landscape {
  // Fon dekorativ, kontent ostida turadi: MSAA va yuqori DPR shart emas, ularni o'chirish FPS'ni keskin oshiradi
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  const basePixelRatio = Math.min(window.devicePixelRatio, 1);
  let renderScale = opts.lowPower ? 0.7 : 1;
  renderer.setPixelRatio(basePixelRatio * renderScale);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#8a6f86", 0.0019);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 2000);

  const sunDir = new THREE.Vector3(-0.55, 0.06, -1).normalize();
  const sky = buildSky(sunDir);
  const stars = buildStars(opts.lowPower);
  scene.add(sky, stars);

  scene.add(new THREE.HemisphereLight("#9aa6e0", "#4a3a44", 1.7));
  const sun = new THREE.DirectionalLight("#ffbd85", 2.4);
  sun.position.copy(sunDir).multiplyScalar(500);
  scene.add(sun);

  const terrain = buildTerrain(opts.lowPower);
  const fortresses = buildFortresses();
  const village = buildVillage(opts.lowPower);
  scene.add(terrain, fortresses.object, village.object);

  // Asfalt, chekka chiziqlar va o'rtadagi uzuq chiziq
  const road = new THREE.Mesh(
    ribbon(-ROAD_HALF_WIDTH, ROAD_HALF_WIDTH, 0.35, 4),
    new THREE.MeshStandardMaterial({ color: "#2b2d39", roughness: 0.95 }),
  );
  const lineMat = new THREE.MeshBasicMaterial({ color: "#d9cfae" });
  const edgeL = new THREE.Mesh(ribbon(-4.5, -4.25, 0.4, 4), lineMat);
  const edgeR = new THREE.Mesh(ribbon(4.25, 4.5, 0.4, 4), lineMat);
  const centerMat = new THREE.MeshBasicMaterial({ color: "#f0c35a" });
  const center = new THREE.Mesh(ribbon(-0.12, 0.12, 0.4, 2, { on: 4, off: 6 }), centerMat);
  scene.add(road, edgeL, edgeR, center);

  // Chiroq ustunlari
  const lampSpacing = 46;
  const lampCount = Math.floor((Z_START - Z_END) / lampSpacing);
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7, 5);
  poleGeo.translate(0, 3.5, 0);
  const poleMat = new THREE.MeshStandardMaterial({ color: "#3a3d4c" });
  const poles = new THREE.InstancedMesh(poleGeo, poleMat, lampCount);
  const lampPositions = new Float32Array(lampCount * 3);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < lampCount; i++) {
    const z = Z_START - i * lampSpacing;
    const side = i % 2 === 0 ? 1 : -1;
    const x = roadX(z) + side * 6.6;
    dummy.position.set(x, 0.3, z);
    dummy.updateMatrix();
    poles.setMatrixAt(i, dummy.matrix);
    lampPositions.set([x - side * 0.8, 7.2, z], i * 3);
  }
  scene.add(poles);

  const glow = glowTexture();
  const glowMaterial = (color: string, size: number) =>
    new THREE.PointsMaterial({ map: glow, color, size, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });

  const lampGeo = new THREE.BufferGeometry();
  lampGeo.setAttribute("position", new THREE.BufferAttribute(lampPositions, 3));
  const lampMat = glowMaterial("#ffd38a", 5);
  scene.add(new THREE.Points(lampGeo, lampMat));

  // Mashinalar — instanced, shuning uchun o'nlab mashina ham bir necha draw call
  const carCount = opts.lowPower ? 30 : 56;
  const cars: Car[] = Array.from({ length: carCount }, (_, i) => ({
    dir: i % 2 === 0 ? -1 : 1,
    phase: Math.random(),
    speed: 14 + Math.random() * 10,
  }));

  const bodyGeo = new THREE.BoxGeometry(2, 0.72, 4.3);
  bodyGeo.translate(0, 0.78, 0);
  const cabinGeo = new THREE.BoxGeometry(1.72, 0.62, 2.2);
  cabinGeo.translate(0, 1.44, -0.25);
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 8);
  wheelGeo.rotateZ(Math.PI / 2);
  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.3 });
  const cabinMat = new THREE.MeshStandardMaterial({ color: "#1a2032", roughness: 0.2, metalness: 0.6 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: "#121318", roughness: 0.9 });

  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, carCount);
  const cabins = new THREE.InstancedMesh(cabinGeo, cabinMat, carCount);
  const wheels = new THREE.InstancedMesh(wheelGeo, wheelMat, carCount * 4);
  const carColor = new THREE.Color();
  for (let i = 0; i < carCount; i++) bodies.setColorAt(i, carColor.set(CAR_COLORS[i % CAR_COLORS.length]));
  for (const m of [bodies, cabins, wheels]) {
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.frustumCulled = false;
  }
  scene.add(bodies, cabins, wheels);

  const headPos = new Float32Array(carCount * 6);
  const tailPos = new Float32Array(carCount * 6);
  const headGeo = new THREE.BufferGeometry();
  headGeo.setAttribute("position", new THREE.BufferAttribute(headPos, 3));
  const tailGeo = new THREE.BufferGeometry();
  tailGeo.setAttribute("position", new THREE.BufferAttribute(tailPos, 3));
  const headMat = glowMaterial("#fff4d6", 3.2);
  const tailMat = glowMaterial("#ff3a3a", 2.2);
  const headlights = new THREE.Points(headGeo, headMat);
  const taillights = new THREE.Points(tailGeo, tailMat);
  headlights.frustumCulled = false;
  taillights.frustumCulled = false;
  scene.add(headlights, taillights);

  const carMatrix = new THREE.Matrix4();
  const partMatrix = new THREE.Matrix4();
  const tmp = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const one = new THREE.Vector3(1, 1, 1);
  // Barcha sahifalarning yo'l qismini qamrab oladi
  const loopLength = 1150;
  const loopStart = 150;

  function updateCars(time: number) {
    for (let i = 0; i < carCount; i++) {
      const car = cars[i];
      const travelled = (car.phase * loopLength + car.speed * time) % loopLength;
      const z = car.dir === -1 ? loopStart - travelled : loopStart - loopLength + travelled;
      const s = roadSlope(z);
      const len = Math.hypot(1, s);
      // O'ng tomonlama harakat: −z ga ketayotganlar yo'lning +normal tomonida
      const lane = car.dir === -1 ? LANE_OFFSET : -LANE_OFFSET;
      const x = roadX(z) + lane / len;
      const zz = z - (lane * s) / len;
      // Mashinaning oldi lokal +z, harakat yo'nalishiga buramiz
      quat.setFromAxisAngle(yAxis, Math.atan2(car.dir * s, car.dir));
      carMatrix.compose(tmp.set(x, 0.35, zz), quat, one);

      bodies.setMatrixAt(i, carMatrix);
      cabins.setMatrixAt(i, carMatrix);
      for (let w = 0; w < 4; w++) {
        const [ox, oy, oz] = WHEEL_OFFSETS[w];
        partMatrix.makeTranslation(ox, oy, oz).premultiply(carMatrix);
        wheels.setMatrixAt(i * 4 + w, partMatrix);
      }
      for (let side = 0; side < 2; side++) {
        const ox = side === 0 ? 0.68 : -0.68;
        tmp.set(ox, 0.85, 2.2).applyMatrix4(carMatrix);
        headPos.set([tmp.x, tmp.y, tmp.z], (i * 2 + side) * 3);
        tmp.set(ox, 0.9, -2.2).applyMatrix4(carMatrix);
        tailPos.set([tmp.x, tmp.y, tmp.z], (i * 2 + side) * 3);
      }
    }
    bodies.instanceMatrix.needsUpdate = true;
    cabins.instanceMatrix.needsUpdate = true;
    wheels.instanceMatrix.needsUpdate = true;
    headGeo.attributes.position.needsUpdate = true;
    tailGeo.attributes.position.needsUpdate = true;
  }

  const disposables: { dispose(): void }[] = [
    terrain.geometry, terrain.material as THREE.Material, sky.geometry, sky.material as THREE.Material,
    stars.geometry, stars.material as THREE.Material, road.geometry, road.material as THREE.Material,
    edgeL.geometry, edgeR.geometry, lineMat, center.geometry, centerMat, poleGeo, poleMat, lampGeo,
    lampMat, glow, bodyGeo, cabinGeo, wheelGeo, bodyMat, cabinMat, wheelMat, headGeo, tailGeo, headMat, tailMat,
    poles, bodies, cabins, wheels, fortresses, village,
  ];

  // ---------- Kamera ----------
  let target = 0;
  let current = 0;
  const targetStation: Station = { ...stationFor(opts.pathname) };
  const station: Station = { ...targetStation };
  const lookAt = new THREE.Vector3();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function placeCamera(p: number, time: number) {
    const s = station;
    const e = ease(p);
    const z = s.z0 - p * s.travel;
    // Sahifadan sahifaga uchayotganda tog'lar ustidan oshib o'tish uchun ko'tariladi
    const flight = Math.abs(targetStation.z0 - s.z0) + Math.abs(targetStation.side - s.side);
    const lift = Math.min(flight * 0.3, 120);
    const camY = s.height - e * (s.height - 7.5) + lift;
    const sway = opts.reducedMotion ? 0 : Math.sin(time * 0.15) * 1.5 * (1 - p);
    camera.position.set(roadX(z) + s.side * (1 - e) + sway, camY, z);
    const lz = z - (s.lookDist - e * (s.lookDist - 45));
    lookAt.set(roadX(lz) + s.lookSide * (1 - e), camY - lift - (s.pitch - e * (s.pitch - 5)), lz);
    camera.lookAt(lookAt);
    sky.position.copy(camera.position);
    stars.position.copy(camera.position);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Tor ekranlarda (telefon) kengroq ko'rinish
    camera.fov = w / h < 0.8 ? 68 : 55;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const clock = new THREE.Clock();
  let frame = 0;
  let running = true;
  const FROZEN_TIME = 30;

  function drawStatic() {
    current = target;
    Object.assign(station, targetStation);
    resize();
    placeCamera(current, 0);
    updateCars(FROZEN_TIME);
    renderer.render(scene, camera);
  }

  // Adaptiv sifat: kadrlar sekinlashsa render o'lchamini kamaytiramiz, tez bo'lsa asta qaytaramiz
  let frameTimeSum = 0;
  let frameCount = 0;
  function adaptQuality(dt: number) {
    frameTimeSum += dt;
    frameCount++;
    if (frameCount < 45) return;
    const avgMs = (frameTimeSum / frameCount) * 1000;
    frameTimeSum = 0;
    frameCount = 0;
    let next = renderScale;
    if (avgMs > 20 && renderScale > 0.5) next = Math.max(0.5, renderScale - 0.15);
    else if (avgMs < 15 && renderScale < 1) next = Math.min(1, renderScale + 0.05);
    if (next !== renderScale) {
      renderScale = next;
      renderer.setPixelRatio(basePixelRatio * renderScale);
      resize();
    }
  }

  function loop() {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    if (document.hidden) {
      clock.getDelta();
      return;
    }
    const dt = Math.min(clock.getDelta(), 0.1);
    const time = clock.elapsedTime;
    adaptQuality(dt);
    current += (target - current) * (1 - Math.exp(-dt * 6));
    // Sahifalar orasida uchish ~1 soniyada yakunlanadi
    const k = 1 - Math.exp(-dt * 3.2);
    for (const key of STATION_KEYS) station[key] += (targetStation[key] - station[key]) * k;
    placeCamera(current, time);
    updateCars(time);
    renderer.render(scene, camera);
  }

  const disposeAll = () => {
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };

  if (opts.reducedMotion) {
    // Harakatni kamaytirish yoqilgan: uchish ham, mashinalar ham yo'q — faqat kerak bo'lganda chizamiz
    running = false;
    drawStatic();
    ro.disconnect();
    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(drawStatic);
    };
    window.addEventListener("resize", redraw);
    return {
      setProgress(p) {
        target = p;
        redraw();
      },
      setRoute(pathname) {
        Object.assign(targetStation, stationFor(pathname));
        redraw();
      },
      dispose() {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", redraw);
        disposeAll();
      },
    };
  }

  loop();

  return {
    setProgress(p) {
      target = p;
    },
    setRoute(pathname) {
      Object.assign(targetStation, stationFor(pathname));
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      disposeAll();
    },
  };
}

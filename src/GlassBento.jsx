import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
function createShape(pts) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}
 
function centroid(pts) {
  let cx = 0, cy = 0;
  pts.forEach(([x, y]) => { cx += x; cy += y; });
  return [cx / pts.length, cy / pts.length];
}
 
// ─── Panel kaca ───────────────────────────────────────────────────────────────
function GlassShard({ points, onClick, pointerRef, children }) {
  const meshRef   = useRef();
  const matRef    = useRef();
  const groupRef  = useRef();
  const smooth    = useRef({ rx: 0, rz: 0, pz: 0, bright: 0 });
  const phase     = useMemo(() => Math.random() * Math.PI * 2, []);
  const [cx, cy]  = useMemo(() => centroid(points), [points]);
 
  const geo = useMemo(() => {
    const shape = createShape(points);
    return new THREE.ExtrudeGeometry(shape, {
      depth:          0.22,
      bevelEnabled:   true,
      bevelThickness: 0.055,
      bevelSize:      0.05,
      bevelSegments:  8,
    });
  }, [points]);
 
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    // Warna dasar: near-black kebiruan sangat gelap — blends dengan bg hitam
    color:              new THREE.Color('#04080c'),
    metalness:          0.0,
    roughness:          0.02,         // super smooth
    transmission:       0.18,         // low transmission = lebih opaque & gelap
    thickness:          0.8,
    ior:                1.56,
    reflectivity:       1.0,
    clearcoat:          1.0,
    clearcoatRoughness: 0.01,
    transparent:        true,
    envMapIntensity:    1.6,
    side:               THREE.FrontSide,
  }), []);
 
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const p = pointerRef.current;
 
    const px = p.x * 5.2;
    const py = p.y * 2.93;
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
 
    const RADIUS   = 2.4;
    const strength = Math.max(0, 1 - dist / RADIUS);
 
    // Ditekan ke dalam — pZ negatif, tilt ke arah kursor
    const tRX = -dy * strength * 0.18;
    const tRZ =  dx * strength * 0.12;
    const tPZ = -strength * 0.18;
 
    const s   = smooth.current;
    const spd = 0.065;
    s.rx     += (tRX     - s.rx)    * spd;
    s.rz     += (tRZ     - s.rz)    * spd;
    s.pz     += (tPZ     - s.pz)    * spd;
    s.bright += (strength - s.bright) * spd;
 
    // Idle breath
    const bY = Math.cos(t * 0.28 + phase) * 0.004;
    const bX = Math.sin(t * 0.20 + phase) * 0.003;
 
    groupRef.current.position.set(bX, bY, s.pz);
    groupRef.current.rotation.x = s.rx;
    groupRef.current.rotation.z = s.rz;
 
    if (matRef.current) {
      const b = 0.028 + s.bright * 0.04;
      matRef.current.color.setRGB(b * 0.65, b * 0.80, b);
      matRef.current.clearcoatRoughness = 0.01 + s.bright * 0.012;
    }
  });
 
  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={geo}
        onClick={onClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={()  => (document.body.style.cursor = 'default')}
      >
        <primitive object={mat} ref={matRef} attach="material" />
      </mesh>
      {children}
    </group>
  );
}
 
// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ shards, onSelectShard, pointerRef }) {
  const { pointer } = useThree();
  useFrame(() => {
    pointerRef.current.x = pointer.x;
    pointerRef.current.y = pointer.y;
  });
 
  return (
    <Center>
      {shards.map((s) => (
        <GlassShard
          key={s.id}
          points={s.points}
          pointerRef={pointerRef}
          onClick={() => onSelectShard?.(s.id)}
        >
          {/* Teks hanya di panel kiri (id: 'main') */}
          {s.id === 'main' && (
            <Html
              position={[
                // Centroid X panel kiri ≈ -3.6, tapi kita mau teks di area tengah panel
                // Panel kiri: x dari -4.16 sampai ~-0.19, centroid ≈ -2.2
                // Kita anchor di pojok kiri-atas dalam
                -3.85, 1.55, 0.12
              ]}
              style={{ width: '260px', pointerEvents: 'none' }}
              zIndexRange={[0, 0]}
              occlude={false}
            >
              <div style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: 'rgba(255,255,255,0.92)',
                userSelect: 'none',
              }}>
                <p style={{
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  margin: '0 0 10px 0',
                  fontWeight: 400,
                }}>
                  enjoy my portofolio (emot senyum)
                </p>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 300,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px 0',
                  color: 'rgba(255,255,255,0.95)',
                }}>
                  Robeen<br />
                  <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.70)', fontWeight: 300 }}>
                    Charloss.
                  </em>
                </h1>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.40)',
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                  maxWidth: '200px',
                }}>
                  The creator will sell this website, you can send a message through the "Hubungi Saya" page.
                </p>
                <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                  <button
                    onClick={() => onSelectShard?.('main')}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'inherit',
                      background: 'rgba(255,255,255,0.95)',
                      color: '#000',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Open studio
                  </button>
                  <button style={{
                    fontSize: '10px',
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    letterSpacing: '0.01em',
                  }}>
                    Read paper ↗
                  </button>
                </div>
              </div>
            </Html>
          )}
        </GlassShard>
      ))}
    </Center>
  );
}
 
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GlassBento({ onSelectShard }) {
  const pointerRef = useRef({ x: 0, y: 0 });
 
  const G = 0.052;
 
  // Camera fov=38, z=8.5 → frustum W≈10.4, H≈5.85
  // Panel group mengisi layar dengan margin hitam tipis di sisi
  const L = -4.20, R = 4.40, T = 2.00, B = -2.50;
 
  // ── Retakan mengikuti referensi video ──────────────────────────────────────
  // Dari video:
  //  · Garis vertikal kiri yang sedikit miring: dari atas ke bawah, geser sedikit ke kiri
  //  · Garis vertikal kanan: lurus / sedikit miring
  //  · Garis horizontal di ~1/3 dari atas (memotong bagian kanan)
  //  · Diagonal kecil di sudut kanan bawah
  //
  // Hasil: 5 pecahan
  //  1. KIRI       : panel besar kiri (± 40% lebar) — tempat teks
  //  2. TENGAH ATAS : atas tengah  
  //  3. TENGAH BAWAH: bawah tengah (sedikit lebih pendek)
  //  4. KANAN ATAS  : trapesium kanan atas (terpotong diagonal)
  //  5. KANAN BAWAH : segitiga/trapesium kanan bawah
 
  // Titik split
  const xL  = -0.85;   // garis vertikal kiri (sedikit miring)
  const xLb = -0.90;   // ujung bawah garis kiri (lebih miring)
  const xR  =  1.55;   // garis vertikal kanan
  const yH  =  0.30;   // garis horizontal (1/3 atas, di kanan saja)
  const xD  =  3.80;   // ujung diagonal kanan bawah X
  const yD  = -0.75;   // ujung diagonal kanan bawah Y
 
  const shards = useMemo(() => [
    // ── 1. PANEL KIRI — besar, vertikal, sedikit trapezoidal ─────────────
    {
      id: 'main',
      points: [
        [L,        T - G],
        [xL - G,   T - G],
        [xLb - G,  B + G],
        [L,        B + G],
      ],
    },
 
    // ── 2. TENGAH ATAS — dari garis kiri ke garis kanan, atas ke yH ──────
    {
      id: 'dispersion',
      points: [
        [xL  + G,  T  - G],
        [xR  - G,  T  - G],
        [xR  - G,  yH - G],
        [xLb + G,  yH - G],
      ],
    },
 
    // ── 3. TENGAH BAWAH — dari garis kiri ke garis kanan, yH ke bawah ───
    {
      id: 'transmission',
      points: [
        [xLb + G,  yH + G],
        [xR  - G,  yH + G],
        [xR  - G,  B  + G],
        [xLb + G,  B  + G],
      ],
    },
 
    // ── 4. KANAN ATAS — trapesium, sisi bawah terpotong diagonal ─────────
    {
      id: 'iridescence',
      points: [
        [xR  + G,  T  - G],
        [R,        T  - G],
        [R,        yD - G],
        [xD  + G,  yD - G],
        [xR  + G,  yH - G],
      ],
    },
 
    // ── 5. KANAN BAWAH — dari diagonal ke sudut kanan bawah ──────────────
    {
      id: 'refraction',
      points: [
        [xR  + G,  yH + G],
        [xD  + G,  yD + G],
        [R,        yD + G],
        [R,        B  + G],
        [xR  + G,  B  + G],
      ],
    },
  ], []);
 
  return (
    <div style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0,
      // Background pure dark — selaras dengan pecahan kaca yang gelap
      background: '#040608',
    }}>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{
          antialias:           true,
          powerPreference:     'high-performance',
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
      >
        {/*
          Environment 'night' — gelap, langit malam, tidak ada warna kuning/cokelat
          Hanya ada biru gelap & cahaya bintang → refleksi elegan tanpa kontaminasi warna hangat
        */}
        <Environment preset="night" environmentIntensity={0.55} />
 
        <ambientLight intensity={0.025} />
 
        {/*
          Key light: putih sangat dingin dari kiri atas
          → satu garis specular panjang di tepi atas tiap panel
        */}
        <directionalLight
          position={[-6, 8, 5]}
          intensity={2.2}
          color="#ddeeff"
        />
 
        {/*
          Soft fill dari kanan — sangat tipis, cuma biar panel kanan tidak all-black
        */}
        <directionalLight
          position={[5, -3, 3]}
          intensity={0.12}
          color="#8899aa"
        />
 
        {/*
          Rim teal gelap dari kiri tengah — memberikan shimmer tipis di sisi kiri panel
          warna sangat gelap supaya tidak "glow" tapi tetap bikin edge ada warnanya
        */}
        <pointLight
          position={[-5, 1, 3]}
          intensity={3.0}
          color="#061a10"
          distance={12}
          decay={2}
        />

        {/*
          Blue-navy dari kanan bawah — bikin panel kanan punya rim gelap elegan
        */}
        <pointLight
          position={[5, -2, 4]}
          intensity={1.5}
          color="#06101e"
          distance={10}
          decay={2}
        />
 
        <Scene shards={shards} onSelectShard={onSelectShard} pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
 
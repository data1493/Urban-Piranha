import { Canvas } from "@react-three/fiber";
import { ContactShadows, Decal, Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";

const PANELS = 6;
const SEAM = 0.008;

function visorGeometry() {
  const shape = new THREE.Shape();
  const half = 0.98;
  const depth = 0.7;
  shape.moveTo(-half, 0);
  shape.lineTo(-half, 0.06);
  shape.bezierCurveTo(-half * 0.92, depth, half * 0.92, depth, half, 0.06);
  shape.lineTo(half, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.046,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 56,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.01, 0.42);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const y = pos.getY(i);
    const t = Math.max(0, (z - 0.5) / 0.65);
    pos.setY(i, y - 0.045 * t * t);
  }
  geo.computeVertexNormals();
  return geo;
}

function CrownPanel({
  index,
  wool,
  woolN,
  woolR,
}: {
  index: number;
  wool: THREE.Texture;
  woolN: THREE.Texture;
  woolR: THREE.Texture;
}) {
  const phiStart = (index / PANELS) * Math.PI * 2 + SEAM;
  const phiLength = (Math.PI * 2) / PANELS - SEAM * 2;
  const front = index === 1;
  const side = index === 2;
  const [emb, embN, embR, word] = useTexture([
    "/brand/up/tex/emb-albedo.png",
    "/brand/up/tex/emb-nml.png",
    "/brand/up/tex/emb-rgh.png",
    "/brand/up/tex/wordmark.png",
  ]);
  emb.colorSpace = THREE.SRGBColorSpace;
  word.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      castShadow
      receiveShadow
      scale={[1, 0.7, 1]}
      position={[0, 0.18, 0]}
      rotation={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 18, 32, phiStart, phiLength, 0.02, Math.PI * 0.5]} />
      <meshPhysicalMaterial
        map={wool}
        normalMap={woolN}
        roughnessMap={woolR}
        color="#161616"
        roughness={0.92}
        metalness={0}
        sheen={0.55}
        sheenRoughness={0.85}
        sheenColor="#2a2a2a"
        normalScale={new THREE.Vector2(0.45, 0.45)}
      />
      {front ? (
        <Decal position={[0, 0.15, 0.78]} rotation={[0.2, 0, 0]} scale={[0.7, 0.78, 0.5]}>
          <meshPhysicalMaterial
            map={emb}
            normalMap={embN}
            roughnessMap={embR}
            transparent
            roughness={0.45}
            metalness={0.12}
            sheen={0.35}
            sheenColor="#c45a18"
            polygonOffset
            polygonOffsetFactor={-4}
            normalScale={new THREE.Vector2(1.1, 1.1)}
          />
        </Decal>
      ) : null}
      {side ? (
        <Decal position={[0.72, 0.05, 0.28]} rotation={[0.1, Math.PI / 2.2, 0]} scale={[0.52, 0.26, 0.4]}>
          <meshPhysicalMaterial
            map={word}
            transparent
            roughness={0.5}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-4}
          />
        </Decal>
      ) : null}
    </mesh>
  );
}

function FittedCap() {
  const [wool, woolN, woolR, brimAlb] = useTexture([
    "/brand/up/tex/fabric-wool.png",
    "/brand/up/tex/fabric-nml.png",
    "/brand/up/tex/fabric-rgh.png",
    "/brand/up/tex/brim-alb.png",
  ]);
  for (const t of [wool, brimAlb]) t.colorSpace = THREE.SRGBColorSpace;
  wool.wrapS = wool.wrapT = woolN.wrapS = woolN.wrapT = woolR.wrapS = woolR.wrapT = THREE.RepeatWrapping;
  wool.repeat.set(3.2, 3.2);
  woolN.repeat.set(3.2, 3.2);
  woolR.repeat.set(3.2, 3.2);
  wool.anisotropy = woolN.anisotropy = 8;

  const visor = useMemo(() => visorGeometry(), []);

  return (
    <group>
      {Array.from({ length: PANELS }, (_, i) => (
        <CrownPanel key={i} index={i} wool={wool} woolN={woolN} woolR={woolR} />
      ))}

      <mesh geometry={visor} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={brimAlb}
          normalMap={woolN}
          color="#111"
          roughness={0.88}
          metalness={0.02}
          sheen={0.2}
        />
      </mesh>
      <mesh geometry={visor} position={[0, -0.012, 0]}>
        <meshPhysicalMaterial color="#1a4630" roughness={0.28} metalness={0.08} side={THREE.BackSide} />
      </mesh>

      {/* top button */}
      <mesh position={[0, 0.89, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.028, 24]} />
        <meshPhysicalMaterial map={wool} color="#151515" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <sphereGeometry args={[0.038, 20, 12]} />
        <meshPhysicalMaterial map={wool} color="#141414" roughness={0.86} />
      </mesh>

      {/* eyelets */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const r = 0.62;
        const y = 0.68;
        return (
          <mesh key={`e${i}`} position={[Math.sin(a) * r, y, Math.cos(a) * r]} rotation={[1.1, a, 0]}>
            <torusGeometry args={[0.022, 0.006, 8, 16]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.35} />
          </mesh>
        );
      })}

      {/* sweatband */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.86, 0.88, 0.07, 64, 1, true]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>

      {/* New Era flag */}
      <mesh position={[-0.78, 0.28, 0.22]} rotation={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[0.01, 0.07, 0.046]} />
        <meshPhysicalMaterial color="#c4122f" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Controls() {
  const [auto, setAuto] = useState(true);
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.8}
      zoomSpeed={0.65}
      minDistance={1.75}
      maxDistance={4}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI - 0.35}
      autoRotate={auto}
      autoRotateSpeed={0.4}
      onStart={() => setAuto(false)}
      target={[0, 0.38, 0]}
    />
  );
}

export default function Hat3D() {
  return (
    <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-up-line bg-[#070707] touch-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0.55, 0.72, 2.15], fov: 34, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#070707"]} />
        <ambientLight intensity={0.18} />
        <spotLight
          position={[1.8, 3.2, 2.4]}
          intensity={20}
          angle={0.4}
          penumbra={1}
          castShadow
          shadow-mapSize={1024}
        />
        <spotLight position={[-1.6, 1.4, 2.2]} intensity={4} angle={0.55} penumbra={1} />
        <Environment preset="warehouse" environmentIntensity={0.22} />
        <FittedCap />
        <ContactShadows position={[0, -0.021, 0]} opacity={0.42} scale={3} blur={2.6} far={2} />
        <Controls />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold tracking-[0.18em] text-white/65 uppercase">
        Drag to spin · scroll to zoom
      </p>
    </div>
  );
}

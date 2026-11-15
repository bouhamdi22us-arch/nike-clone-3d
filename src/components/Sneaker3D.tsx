import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei/core/RoundedBox'
import * as THREE from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'

const BACKGROUND = '#111111'
const VOLT = '#d4ff3f'
const UPPER_COLOR = '#151515'
const SOLE_COLOR = '#1f1f1f'

interface SneakerRigProps {
  reducedMotion: boolean
}

/** Static volt line-art sneaker used as the WebGL fallback. */
function SneakerLineArt() {
  return (
    <svg
      viewBox="0 0 220 120"
      role="img"
      aria-label="Sneaker line illustration"
      className="hero__fallback-art"
    >
      {/* sole */}
      <path
        d="M14 86 C60 92 120 92 206 80 C210 88 208 96 196 100 C120 108 52 104 16 100 C6 96 8 90 14 86 Z"
        fill="none"
        stroke={VOLT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* upper */}
      <path
        d="M30 84 C34 60 52 46 84 40 C110 35 132 40 150 54 C172 66 190 72 204 76"
        fill="none"
        stroke={VOLT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* check */}
      <path d="M70 66 L94 78 L126 44" fill="none" stroke={VOLT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SneakerRig({ reducedMotion }: SneakerRigProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useThree((state) => state.pointer)

  // Standard product-shot base yaw (~-0.5 rad) so the side + toe read from the default camera.
  useEffect(() => {
    const group = groupRef.current
    if (group) {
      group.rotation.y = -0.5
      group.rotation.x = 0
    }
  }, [])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    if (reducedMotion) {
      group.rotation.x = 0
      group.rotation.y = -0.5
      group.position.y = 0
      return
    }

    // Idle float: sine on the elapsed clock.
    group.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.18

    const lerpFactor = Math.min(1, delta * 4)
    const targetY = -0.5 + pointer.x * 0.55
    group.rotation.y += (targetY - group.rotation.y) * lerpFactor
    const targetX = pointer.y * 0.2
    group.rotation.x += (targetX - group.rotation.x) * lerpFactor
  })

  const checkShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.55)
    shape.lineTo(0.34, 0.12)
    shape.lineTo(0.58, 0.62)
    shape.lineTo(0.84, 0.02)
    shape.lineTo(1.06, 0.55)
    return shape
  }, [])

  // Laces ride the vamp surface; slope increases toward the toe.
  const laces = useMemo(
    () => [
      { z: -0.6, y: 0.82, tilt: 0.08 },
      { z: -0.3, y: 0.86, tilt: 0.05 },
      { z: 0, y: 0.88, tilt: 0 },
      { z: 0.3, y: 0.86, tilt: -0.05 },
      { z: 0.6, y: 0.8, tilt: -0.1 },
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {/* Sole: extruded rounded slab. */}
      <RoundedBox args={[0.95, 0.26, 2.3]} radius={0.1} smoothness={6} position={[0, 0.13, 0.05]}>
        <meshStandardMaterial color={SOLE_COLOR} roughness={0.65} />
      </RoundedBox>

      {/* Upper: flattened ellipsoid, widened for a fuller silhouette. */}
      <mesh position={[0, 0.55, 0.05]} scale={[1.05, 0.45, 1.65]}>
        <sphereGeometry args={[0.8, 48, 32]} />
        <meshStandardMaterial color={UPPER_COLOR} roughness={0.5} />
      </mesh>

      {/* Toe cap: flattened sphere segment at the front. */}
      <mesh position={[0, 0.38, 1.35]} scale={[1.02, 0.32, 0.55]}>
        <sphereGeometry args={[0.5, 32, 24]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.55} />
      </mesh>

      {/* Heel counter: blocky extruded heel at the back. */}
      <RoundedBox args={[0.82, 0.42, 0.34]} radius={0.09} smoothness={4} position={[0, 0.62, -1.18]}>
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} />
      </RoundedBox>

      {/* Swoosh-like check facing the side face. */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.78, 0.45, 0]} scale={0.7}>
        <extrudeGeometry args={[checkShape, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color={VOLT} roughness={0.35} />
      </mesh>

      {/* Laces: toruses tilted to follow the vamp slope. */}
      {laces.map(({ z, y, tilt }) => (
        <mesh key={z} rotation={[Math.PI / 2 + tilt, 0, 0]} position={[0, y, z]}>
          <torusGeometry args={[0.075, 0.02, 12, 24]} />
          <meshStandardMaterial color={VOLT} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export default function Sneaker3D() {
  const reducedMotion = useReducedMotion()
  const scene = useMemo(() => {
    const newScene = new THREE.Scene()
    newScene.background = new THREE.Color(BACKGROUND)
    return newScene
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 42 }}
      scene={scene}
      dpr={[1, 2]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      fallback={
        <div className="hero__canvas-fallback">
          <SneakerLineArt />
        </div>
      }
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={0.7} />
      <spotLight position={[-2, 5, 4]} angle={0.5} penumbra={0.8} intensity={80} color="#ffffff" />
      <pointLight position={[-2, 3, 2]} intensity={2.5} color={VOLT} />
      {/* Ground contact shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <SneakerRig reducedMotion={reducedMotion} />
    </Canvas>
  )
}

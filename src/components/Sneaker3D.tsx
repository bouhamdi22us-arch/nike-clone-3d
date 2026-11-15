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
      // Reduced motion: static product pose, skip idle/pointer writes.
      group.rotation.x = 0
      group.rotation.y = -0.5
      group.position.y = 0
      return
    }

    // Idle float: sine on the elapsed clock.
    group.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.18

    // Pointer parallax with damped lerp toward pointer-derived targets, anchored to the base yaw.
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

  return (
    <group ref={groupRef}>
      {/* Sole: extruded rounded slab. */}
      <RoundedBox args={[0.95, 0.26, 2.3]} radius={0.1} smoothness={6} position={[0, 0.13, 0.05]}>
        <meshStandardMaterial color={SOLE_COLOR} roughness={0.65} />
      </RoundedBox>

      {/* Upper: scaled sphere (flattened ellipsoid). */}
      <mesh position={[0, 0.55, 0.05]} scale={[0.95, 0.45, 1.65]}>
        <sphereGeometry args={[0.8, 48, 32]} />
        <meshStandardMaterial color={UPPER_COLOR} roughness={0.5} />
      </mesh>

      {/* Swoosh-like check: generic check path, extruded, facing sideways on the upper side. */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.7, 0.45, 0]} scale={0.7}>
        <extrudeGeometry args={[checkShape, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color={VOLT} roughness={0.35} />
      </mesh>

      {/* Laces: small toruses standing vertically across the vamp, tube tops above the upper surface. */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((z) => (
        <mesh key={z} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.94, z]}>
          <torusGeometry args={[0.05, 0.016, 12, 24]} />
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
      camera={{ position: [0, 0, 6], fov: 45 }}
      scene={scene}
      dpr={[1, 2]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      fallback={<p className="hero__canvas-fallback">Loading the drop…</p>}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <pointLight position={[2, 2, 2]} intensity={6} color={VOLT} />
      <SneakerRig reducedMotion={reducedMotion} />
    </Canvas>
  )
}

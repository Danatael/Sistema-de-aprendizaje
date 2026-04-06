"use client"

import { useRef, useState } from "react"
import type { PCPart } from "@/lib/pc-parts"

interface PCPartMeshProps {
  part: PCPart
  isPlaced: boolean
  isAnimating: boolean
  isNextToPlace: boolean
  onSelect?: () => void
  ghostMode?: boolean
  positionOverride?: [number, number, number]
  forceVisible?: boolean
  draggable?: boolean
  onDragStart?: (partId: string) => void
  onDragMove?: (partId: string, position: [number, number, number]) => void
  onDragEnd?: (partId: string, position: [number, number, number]) => void
}

function CaseMesh() {
  return (
    <group scale={2.5}>
      {/* Back panel */}
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshStandardMaterial color="#1e1e30" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left panel */}
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.02, 1, 1]} />
        <meshStandardMaterial color="#24243a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right panel (transparent) */}
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.02, 1, 1]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshStandardMaterial color="#20203a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Front panel with mesh */}
      <mesh position={[0, 0.25, 0.5]}>
        <boxGeometry args={[1, 0.5, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Front ventilation */}
      <mesh position={[0, -0.15, 0.5]}>
        <boxGeometry args={[0.9, 0.6, 0.01]} />
        <meshStandardMaterial color="#111125" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Power button */}
      <mesh position={[0.3, 0.48, 0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function CPUMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 0.15]} />
        <meshStandardMaterial color="#8a8a9e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* IHS (heat spreader) */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.75, 0.75, 0.05]} />
        <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.05} />
      </mesh>
      {/* Corner triangle mark */}
      <mesh position={[-0.38, -0.38, 0.1]}>
        <coneGeometry args={[0.04, 0.04, 3]} />
        <meshStandardMaterial color="#f5a623" emissive="#f5a623" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function RAMMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.15, 1, 0.5]} />
        <meshStandardMaterial color="#1b5e20" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Chips on RAM */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <mesh key={i} position={[0.076, y, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.35]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Heat spreader top */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.17, 0.06, 0.52]} />
        <meshStandardMaterial color="#2e7d32" emissive="#4ade80" emissiveIntensity={0.15} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function GPUMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.25, 0.6]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Fans */}
      {[-0.25, 0.25].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.13, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[x, 0.14, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* PCIe connector */}
      <mesh position={[0, -0.13, -0.28]}>
        <boxGeometry args={[0.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Power connector */}
      <mesh position={[0.48, 0, 0]}>
        <boxGeometry args={[0.05, 0.15, 0.3]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

function PSUMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.5, 0.7]} />
        <meshStandardMaterial color="#3a3a4e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Fan grille */}
      <mesh position={[0, -0.26, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.01, 24]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Power switch */}
      <mesh position={[-0.4, 0, 0.36]}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshStandardMaterial color="#e53935" emissive="#e53935" emissiveIntensity={0.3} />
      </mesh>
      {/* Label */}
      <mesh position={[0.1, 0.1, 0.351]}>
        <boxGeometry args={[0.5, 0.2, 0.01]} />
        <meshStandardMaterial color="#444" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  )
}

function FanMesh() {
  const { useFrame } = require("@react-three/fiber")
  const fanRef = useRef<import("three").Mesh>(null)
  useFrame((_: unknown, delta: number) => {
    if (fanRef.current) {
      fanRef.current.rotation.z += delta * 4
    }
  })

  return (
    <group>
      {/* Heatsink base */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[0.8, 0.8, 0.15]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Heatsink fins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.1, 0, -0.05]}>
          <boxGeometry args={[0.02, 0.7, 0.3]} />
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Fan frame */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.85, 0.85, 0.08]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Fan blades */}
      <mesh ref={fanRef} position={[0, 0, 0.2]}>
        <torusGeometry args={[0.25, 0.08, 4, 6]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

function StorageMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.08, 0.35]} />
        <meshStandardMaterial color="#0d47a1" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* NAND chips */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.045, 0]}>
          <boxGeometry args={[0.15, 0.01, 0.2]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Connector */}
      <mesh position={[0.48, 0, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.15]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Label */}
      <mesh position={[-0.1, 0.045, 0.12]}>
        <boxGeometry args={[0.3, 0.005, 0.08]} />
        <meshStandardMaterial color="#1565c0" emissive="#2196f3" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

function MotherboardMesh() {
  return (
    <group scale={[2.3, 2.3, 1]}>
      {/* Main PCB */}
      <mesh>
        <boxGeometry args={[1, 1, 0.15]} />
        <meshStandardMaterial color="#0d4a2d" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* CPU Socket */}
      <mesh position={[0, 0.2, 0.08]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* RAM Slots */}
      {[0.25, 0.3, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.08]}>
          <boxGeometry args={[0.02, 0.4, 0.03]} />
          <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* PCIe Slots */}
      <mesh position={[0, -0.15, 0.08]}>
        <boxGeometry args={[0.5, 0.03, 0.02]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.25, 0.08]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Chipset heatsink */}
      <mesh position={[-0.15, -0.15, 0.09]}>
        <boxGeometry args={[0.12, 0.12, 0.03]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* I/O Panel */}
      <mesh position={[-0.45, 0.4, 0.08]}>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* VRM Heatsink */}
      <mesh position={[-0.05, 0.48, 0.09]}>
        <boxGeometry args={[0.4, 0.06, 0.03]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Traces (decorative lines) */}
      {[0.05, 0.15, -0.05, -0.35].map((y, i) => (
        <mesh key={i} position={[0.08 * (i % 2 === 0 ? 1 : -1), y, 0.076]}>
          <boxGeometry args={[0.25, 0.002, 0.001]} />
          <meshStandardMaterial color="#2e7d32" emissive="#4ade80" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function getPartMesh(shape: PCPart["shape"]) {
  switch (shape) {
    case "case":
      return <CaseMesh />
    case "cpu":
      return <CPUMesh />
    case "ram":
      return <RAMMesh />
    case "gpu":
      return <GPUMesh />
    case "psu":
      return <PSUMesh />
    case "fan":
      return <FanMesh />
    case "storage":
      return <StorageMesh />
    case "box":
      return <MotherboardMesh />
    default:
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      )
  }
}

export function PCPartMesh({
  part,
  isPlaced,
  isAnimating,
  isNextToPlace,
  onSelect,
  ghostMode,
  positionOverride,
  forceVisible,
  draggable,
  onDragStart,
  onDragMove,
  onDragEnd,
}: PCPartMeshProps) {
  const { useFrame } = require("@react-three/fiber")
  const groupRef = useRef<import("three").Group>(null)
  const [hovered, setHovered] = useState(false)
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const dragOffsetRef = useRef<[number, number, number]>([0, 0, 0])

  const displayPosition = positionOverride ?? part.position

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!groupRef.current) return

    if (isAnimating) {
      groupRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 8) * 0.05
      )
    } else if (hovered && isNextToPlace) {
      groupRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.03
      )
    } else {
      groupRef.current.scale.lerp(
        { x: 1, y: 1, z: 1 } as import("three").Vector3,
        0.1
      )
    }

    if (ghostMode && !isPlaced) {
      groupRef.current.position.y =
        displayPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  if (!isPlaced && !ghostMode && !forceVisible) return null

  return (
    <group
      ref={groupRef}
      position={displayPosition}
      scale={
        part.shape === "case" 
          ? [
              part.scale[0] / 3,
              part.scale[1] / 4,
              part.scale[2] / 2,
            ]
          : part.shape === "box"
          ? [1, 1, 1]
          : [
              part.scale[0] / Math.max(...part.scale),
              part.scale[1] / Math.max(...part.scale),
              part.scale[2] / Math.max(...part.scale),
            ]
      }
      onClick={(e) => {
        e.stopPropagation()
        if (didDragRef.current) {
          didDragRef.current = false
          return
        }
        onSelect?.()
      }}
      onPointerDown={(e) => {
        if (!draggable) return
        e.stopPropagation()
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        isDraggingRef.current = true
        didDragRef.current = false
        dragOffsetRef.current = [
          displayPosition[0] - e.point.x,
          displayPosition[1] - e.point.y,
          0,
        ]
        onDragStart?.(part.id)
      }}
      onPointerMove={(e) => {
        if (!draggable || !isDraggingRef.current) return
        e.stopPropagation()
        didDragRef.current = true
        const nextPosition: [number, number, number] = [
          e.point.x + dragOffsetRef.current[0],
          e.point.y + dragOffsetRef.current[1],
          displayPosition[2],
        ]
        onDragMove?.(part.id, nextPosition)
      }}
      onPointerUp={(e) => {
        if (!draggable || !isDraggingRef.current) return
        e.stopPropagation()
        ;(e.target as Element).releasePointerCapture?.(e.pointerId)
        isDraggingRef.current = false
        const finalPosition: [number, number, number] = [
          e.point.x + dragOffsetRef.current[0],
          e.point.y + dragOffsetRef.current[1],
          displayPosition[2],
        ]
        onDragEnd?.(part.id, finalPosition)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
    >
      {ghostMode && !isPlaced ? (
        <group>
          <mesh>
            <boxGeometry
              args={
                part.shape === "box" 
                  ? [part.scale[0], part.scale[1], part.scale[2]]
                  : [
                      part.scale[0] / Math.max(...part.scale),
                      part.scale[1] / Math.max(...part.scale),
                      part.scale[2] / Math.max(...part.scale),
                    ]
              }
            />
            <meshStandardMaterial
              color={isNextToPlace ? "#4ade80" : "#666"}
              transparent
              opacity={isNextToPlace ? 0.4 : 0.15}
              wireframe
            />
          </mesh>
        </group>
      ) : (
        getPartMesh(part.shape)
      )}
    </group>
  )
}

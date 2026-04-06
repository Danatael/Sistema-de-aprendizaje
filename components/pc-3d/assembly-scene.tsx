"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { PC_PARTS } from "@/lib/pc-parts"
import { useGameStore } from "@/lib/game-store"
import { PCPartMesh } from "./pc-part-mesh"

const SNAP_DISTANCE = 0.9

function getStagingPosition(index: number): [number, number, number] {
  const columns = 4
  const spacingX = 2
  const spacingY = 1.6
  const baseX = -4.4
  const baseY = 2
  const z = 3
  const col = index % columns
  const row = Math.floor(index / columns)

  return [baseX + col * spacingX, baseY - row * spacingY, z]
}

function AssemblyModel() {
  const {
    placedParts,
    animatingPart,
    currentStep,
    selectPart,
    placePart,
    setAnimatingPart,
  } = useGameStore()

  const initialDragPositions = useMemo(() => {
    return Object.fromEntries(
      PC_PARTS.map((part, index) => [part.id, getStagingPosition(index)])
    ) as Record<string, [number, number, number]>
  }, [])

  const [dragPositions, setDragPositions] = useState<Record<string, [number, number, number]>>(initialDragPositions)

  useEffect(() => {
    if (placedParts.length === 0) {
      setDragPositions(initialDragPositions)
    }
  }, [initialDragPositions, placedParts.length])

  const updatePartPosition = (partId: string, position: [number, number, number]) => {
    setDragPositions((prev) => ({
      ...prev,
      [partId]: position,
    }))
  }

  const resetPartPosition = (partId: string) => {
    setDragPositions((prev) => ({
      ...prev,
      [partId]: initialDragPositions[partId],
    }))
  }

  const handleDrop = (partId: string, position: [number, number, number]) => {
    const part = PC_PARTS.find((candidate) => candidate.id === partId)
    if (!part) return

    const isExpectedPart = part.step === currentStep
    if (!isExpectedPart) {
      resetPartPosition(partId)
      return
    }

    const [tx, ty, tz] = part.position
    const [x, y, z] = position
    const distance = Math.sqrt((tx - x) ** 2 + (ty - y) ** 2 + (tz - z) ** 2)

    if (distance <= SNAP_DISTANCE) {
      updatePartPosition(partId, part.position)
      placePart(partId)
      return
    }

    setAnimatingPart(partId)
    setTimeout(() => setAnimatingPart(null), 400)
    resetPartPosition(partId)
  }

  return (
    <group position={[0, 0, 0]}>
      {PC_PARTS.map((part) => (
        <group key={part.id}>
          {!placedParts.includes(part.id) && (
            <PCPartMesh
              part={part}
              isPlaced={false}
              isAnimating={false}
              isNextToPlace={part.step === currentStep}
              ghostMode
            />
          )}

          <PCPartMesh
            part={part}
            isPlaced={placedParts.includes(part.id)}
            isAnimating={animatingPart === part.id}
            isNextToPlace={part.step === currentStep}
            onSelect={() => selectPart(part)}
            ghostMode={false}
            forceVisible={!placedParts.includes(part.id)}
            positionOverride={
              placedParts.includes(part.id)
                ? part.position
                : dragPositions[part.id] ?? initialDragPositions[part.id]
            }
            draggable={!placedParts.includes(part.id)}
            onDragStart={() => selectPart(part)}
            onDragMove={updatePartPosition}
            onDragEnd={handleDrop}
          />
        </group>
      ))}
    </group>
  )
}

function CameraController({ zoom }: { zoom: number }) {
  const { useFrame, useThree } = require("@react-three/fiber")
  const { camera } = useThree()
  
  useFrame(() => {
    const angle = Math.atan2(camera.position.z, camera.position.x)
    const height = camera.position.y
    camera.position.x = Math.cos(angle) * zoom
    camera.position.z = Math.sin(angle) * zoom
    camera.position.y = height
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

export default function AssemblyScene({ zoom = 8 }: { zoom?: number }) {
  const [modules, setModules] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    Promise.all([
      import("@react-three/fiber"),
      import("@react-three/drei"),
    ]).then(([fiber, drei]) => {
      setModules({
        Canvas: fiber.Canvas,
        OrbitControls: drei.OrbitControls,
        Environment: drei.Environment,
        ContactShadows: drei.ContactShadows,
      })
    }).catch((error) => {
      console.error("Error loading Three.js modules:", error)
    })
  }, [])

  if (!modules) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const { Canvas, OrbitControls, Environment, ContactShadows } = modules

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <CameraController zoom={zoom} />
          <Environment preset="studio" />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.4} color="#4ade80" />
          <pointLight position={[3, -1, 3]} intensity={0.2} color="#f5a623" />

          <AssemblyModel />

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={8}
          />

          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

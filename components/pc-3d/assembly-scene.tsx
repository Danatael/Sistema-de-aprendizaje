"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { PC_PARTS } from "@/lib/pc-parts"
import { useGameStore } from "@/lib/game-store"
import { PCPartMesh } from "./pc-part-mesh"

function AssemblyModel() {
  const { placedParts, animatingPart, currentStep, selectPart } = useGameStore()

  return (
    <group position={[0, 0, 0]}>
      {PC_PARTS.map((part) => (
        <PCPartMesh
          key={part.id}
          part={part}
          isPlaced={placedParts.includes(part.id)}
          isAnimating={animatingPart === part.id}
          isNextToPlace={part.step === currentStep}
          onSelect={() => selectPart(part)}
          ghostMode={!placedParts.includes(part.id)}
        />
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

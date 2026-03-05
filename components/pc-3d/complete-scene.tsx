"use client"

import { Suspense, useEffect, useState } from "react"
import { PC_PARTS } from "@/lib/pc-parts"
import { PCPartMesh } from "@/components/pc-3d/pc-part-mesh"

function CompletedPC() {
  return (
    <group position={[0, 0, 0]}>
      {PC_PARTS.map((part) => (
        <PCPartMesh
          key={part.id}
          part={part}
          isPlaced={true}
          isAnimating={false}
          isNextToPlace={false}
          onSelect={() => {}}
        />
      ))}
    </group>
  )
}

export default function CompleteScene() {
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
    <Canvas camera={{ position: [8, 5, 8], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, -3]} intensity={0.4} color="#4ade80" />

        <CompletedPC />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
        />

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
        />
      </Suspense>
    </Canvas>
  )
}

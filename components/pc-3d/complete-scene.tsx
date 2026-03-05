"use client"

import { Suspense, useEffect, useState } from "react"
import { PC_PARTS } from "@/lib/pc-parts"
import { PCPartMesh } from "@/components/pc-3d/pc-part-mesh"

function CompletedPC() {
  return (
    <group position={[0, -0.5, 0]}>
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
    Promise.all([
      import("@react-three/fiber"),
      import("@react-three/drei"),
    ]).then(([fiber, drei]) => {
      setModules({
        Canvas: fiber.Canvas,
        OrbitControls: drei.OrbitControls,
        Environment: drei.Environment,
        ContactShadows: drei.ContactShadows,
        Float: drei.Float,
        Text: drei.Text,
      })
    })
  }, [])

  if (!modules) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const { Canvas, OrbitControls, Environment, ContactShadows, Float, Text } = modules

  return (
    <Canvas camera={{ position: [4, 3, 4], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, -3]} intensity={0.4} color="#4ade80" />

        <CompletedPC />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.8}>
          <Text
            position={[0, 2.8, 0]}
            fontSize={0.25}
            color="#4ade80"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
          >
            {"PC Completada!"}
          </Text>
        </Float>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
        />

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          minDistance={3}
          maxDistance={8}
        />
      </Suspense>
    </Canvas>
  )
}

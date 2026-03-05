"use client"

import { Suspense, useEffect, useState } from "react"
import { PC_PARTS } from "@/lib/pc-parts"
import { useGameStore } from "@/lib/game-store"
import { PCPartMesh } from "./pc-part-mesh"

function AssemblyModel() {
  const { placedParts, animatingPart, currentStep, selectPart } = useGameStore()

  return (
    <group position={[0, -0.5, 0]}>
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

function StepLabel({ Float, Text }: { Float: any; Text: any }) {
  const { currentStep } = useGameStore()
  const step = currentStep <= 8 ? currentStep : 8

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {`Paso ${step} de 8`}
      </Text>
    </Float>
  )
}

export default function AssemblyScene() {
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
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.4} color="#4ade80" />
          <pointLight position={[3, -1, 3]} intensity={0.2} color="#f5a623" />

          <AssemblyModel />
          <StepLabel Float={Float} Text={Text} />

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

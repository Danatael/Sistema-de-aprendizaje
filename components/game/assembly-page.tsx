"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useGameStore } from "@/lib/game-store"
import { StepPanel, ResetButton } from "@/components/game/step-panel"
import { ASSEMBLY_STEPS } from "@/lib/pc-parts"
import { Button } from "@/components/ui/button"
import { Cpu, ArrowLeft, Brain, ZoomIn, ZoomOut } from "lucide-react"

const AssemblyScene = dynamic(
  () => import("@/components/pc-3d/assembly-scene"),
  { ssr: false }
)

export function AssemblyPage() {
  const { setView, score, placedParts } = useGameStore()
  const [zoom, setZoom] = useState(8) // Distancia inicial de la cámara

  const handleZoomIn = () => {
    setZoom((prev) => Math.max(prev - 1, 5)) // Mínimo 5
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.min(prev + 1, 15)) // Máximo 15
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("landing")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">
              Modo Ensamblaje
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-primary">{score} pts</span>
          {placedParts.length === 8 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setView("quiz")}
              className="gap-1"
            >
              <Brain className="h-4 w-4" />
              Quiz
            </Button>
          )}
          <ResetButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Scene */}
        <div className="relative flex-1">
          <AssemblyScene zoom={zoom} />
          
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              className="h-10 w-10 rounded-full shadow-lg"
              title="Acercar zoom"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              className="h-10 w-10 rounded-full shadow-lg"
              title="Alejar zoom"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="hidden w-80 overflow-y-auto border-l border-border bg-card/50 lg:block">
          <StepPanel />
        </div>
      </div>

      {/* Mobile bottom panel */}
      <div className="block lg:hidden">
        <MobileStepBar />
      </div>
    </div>
  )
}

function MobileStepBar() {
  const { currentStep, placedParts, toggleHint, showHint, placePart, getNextPart } = useGameStore()
  const nextPart = getNextPart()
  const stepInfo = ASSEMBLY_STEPS.find(
    (s) => s.step === currentStep
  )

  return (
    <div className="border-t border-border bg-card p-4">
      {stepInfo && nextPart && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-bold">{currentStep}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {stepInfo.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {placedParts.length}/8 componentes
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={toggleHint}>
            Pista
          </Button>
          <Button size="sm" onClick={() => placePart(nextPart.id)}>
            Colocar
          </Button>
        </div>
      )}
      {showHint && nextPart && (
        <p className="mt-2 text-xs text-accent">{nextPart.hint}</p>
      )}
      {!nextPart && (
        <p className="text-center text-sm text-primary font-semibold">
          Todos los componentes instalados!
        </p>
      )}
    </div>
  )
}

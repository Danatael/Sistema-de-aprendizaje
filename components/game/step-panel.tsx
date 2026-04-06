"use client"

import { useGameStore } from "@/lib/game-store"
import { ASSEMBLY_STEPS, PC_PARTS } from "@/lib/pc-parts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Cpu,
  HardDrive,
  MonitorSpeaker,
  CircuitBoard,
  Fan,
  MemoryStick,
  Box,
  Zap,
} from "lucide-react"

const partIcons: Record<string, React.ReactNode> = {
  case: <Box className="h-5 w-5" />,
  psu: <Zap className="h-5 w-5" />,
  motherboard: <CircuitBoard className="h-5 w-5" />,
  cpu: <Cpu className="h-5 w-5" />,
  cooler: <Fan className="h-5 w-5" />,
  ram: <MemoryStick className="h-5 w-5" />,
  storage: <HardDrive className="h-5 w-5" />,
  gpu: <MonitorSpeaker className="h-5 w-5" />,
}

export function StepPanel() {
  const {
    currentStep,
    placedParts,
    showHint,
    score,
    toggleHint,
    placePart,
    getNextPart,
    selectedPart,
    selectPart,
    currentView,
  } = useGameStore()

  const nextPart = getNextPart()
  const currentStepInfo = ASSEMBLY_STEPS.find((s) => s.step === currentStep)
  const progress = (placedParts.length / PC_PARTS.length) * 100

  if (currentView === "complete") return null

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* Score & Progress */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Progreso</span>
          <span className="font-mono text-sm text-primary">{score} pts</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {placedParts.length} de {PC_PARTS.length} componentes
        </p>
      </div>

      {/* Current Step */}
      {currentStepInfo && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-bold">{currentStep}</span>
            </div>
            <h3 className="font-semibold text-foreground">
              {currentStepInfo.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {currentStepInfo.instruction}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Arrastra la pieza desde la zona externa y sueltala dentro del gabinete para colocarla.
          </p>

          {nextPart && (
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => placePart(nextPart.id)}
                className="flex-1 gap-2"
              >
                {partIcons[nextPart.id]}
                Auto colocar {nextPart.nameEs}
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleHint}
                className="gap-1"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showHint && nextPart && (
            <div className="mt-3 rounded-md border border-accent/30 bg-accent/10 p-3">
              <p className="text-xs font-medium text-accent">
                Pista: {nextPart.hint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Component Info */}
      {selectedPart && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {partIcons[selectedPart.id]}
              <h3 className="font-semibold text-foreground">{selectedPart.nameEs}</h3>
            </div>
            <button
              onClick={() => selectPart(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
          <p className="mb-3 text-xs font-mono text-muted-foreground">
            {selectedPart.name}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {selectedPart.description}
          </p>
          <div className="mt-3 rounded-md border border-chart-3/30 bg-chart-3/10 p-3">
            <p className="text-xs text-chart-3">
              Dato curioso: {selectedPart.funFact}
            </p>
          </div>
        </div>
      )}

      {/* Parts List */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Componentes
        </h3>
        <div className="flex flex-col gap-2">
          {PC_PARTS.map((part) => {
            const isPlaced = placedParts.includes(part.id)
            const isNext = part.step === currentStep
            return (
              <button
                key={part.id}
                onClick={() => selectPart(part)}
                className={`flex items-center gap-3 rounded-md p-2 text-left transition-colors ${
                  isPlaced
                    ? "bg-primary/10 text-primary"
                    : isNext
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isPlaced
                      ? "bg-primary text-primary-foreground"
                      : isNext
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {isPlaced ? "\u2713" : part.step}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{part.nameEs}</span>
                </div>
                {partIcons[part.id]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ResetButton() {
  const { resetGame } = useGameStore()
  return (
    <Button variant="outline" size="sm" onClick={resetGame} className="gap-2">
      <RotateCcw className="h-4 w-4" />
      Reiniciar
    </Button>
  )
}

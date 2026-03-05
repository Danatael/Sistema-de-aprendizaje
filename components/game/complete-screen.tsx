"use client"

import dynamic from "next/dynamic"
import { useGameStore } from "@/lib/game-store"
import { PC_PARTS } from "@/lib/pc-parts"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Gamepad2 } from "lucide-react"

const CompleteScene = dynamic(
  () => import("@/components/pc-3d/complete-scene"),
  { ssr: false }
)

export function CompleteScreen() {
  const { score, quizAnswers, resetGame, setView } = useGameStore()
  const correctQuizzes = Object.values(quizAnswers).filter(Boolean).length
  const totalQuizzes = Object.keys(quizAnswers).length

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* 3D View */}
      <div className="flex-1">
        <CompleteScene />
      </div>

      {/* Results Panel */}
      <div className="flex w-full flex-col items-center justify-center gap-6 p-8 lg:w-96">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <Trophy className="h-10 w-10 text-primary" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Felicidades!
          </h2>
          <p className="mt-2 text-muted-foreground">
            Has completado el ensamblaje de tu PC
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-card p-4 border border-border">
            <span className="text-sm text-muted-foreground">Puntuacion total</span>
            <span className="text-xl font-bold font-mono text-primary">{score}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-card p-4 border border-border">
            <span className="text-sm text-muted-foreground">Componentes instalados</span>
            <span className="text-xl font-bold font-mono text-foreground">
              {PC_PARTS.length}/{PC_PARTS.length}
            </span>
          </div>
          {totalQuizzes > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-card p-4 border border-border">
              <span className="text-sm text-muted-foreground">Quiz correctos</span>
              <span className="text-xl font-bold font-mono text-chart-1">
                {correctQuizzes}/{totalQuizzes}
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => {
              resetGame()
              setView("assembly")
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Jugar de nuevo
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            size="lg"
            onClick={() => {
              resetGame()
              setView("landing")
            }}
          >
            <Gamepad2 className="h-4 w-4" />
            Menu principal
          </Button>
        </div>
      </div>
    </div>
  )
}

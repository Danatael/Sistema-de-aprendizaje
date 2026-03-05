"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { Gamepad2, BookOpen, Cpu, Wrench, Brain } from "lucide-react"

const LandingScene = dynamic(
  () => import("@/components/pc-3d/landing-scene"),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }
)

export function LandingPage() {
  const { setView } = useGameStore()

  console.log("LandingPage renderizado")

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      {/* 3D Background */}
      <LandingScene />

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              PC Builder Academy
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-end gap-8 pb-16">
          {/* Info Cards */}
          <div className="mx-4 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-md">
              <Wrench className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-1 font-semibold text-foreground">
                Aprende Haciendo
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ensambla una PC paso a paso con modelos 3D interactivos.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-md">
              <BookOpen className="mb-3 h-6 w-6 text-accent" />
              <h3 className="mb-1 font-semibold text-foreground">
                Informacion Detallada
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Conoce cada componente, su funcion y datos curiosos.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-md">
              <Brain className="mb-3 h-6 w-6 text-chart-1" />
              <h3 className="mb-1 font-semibold text-foreground">
                Pon a Prueba tu Saber
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Responde preguntas y gana puntos por cada respuesta.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 text-lg"
              onClick={() => setView("assembly")}
            >
              <Gamepad2 className="h-5 w-5" />
              Comenzar a Armar
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 text-lg"
              onClick={() => setView("quiz")}
            >
              <Brain className="h-5 w-5" />
              Modo Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

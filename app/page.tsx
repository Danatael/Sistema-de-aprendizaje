"use client"

import dynamic from "next/dynamic"
import { useGameStore } from "@/lib/game-store"

const LandingPage = dynamic(
  () => import("@/components/game/landing-page").then((m) => ({ default: m.LandingPage })),
  { ssr: false, loading: () => <LoadingScreen /> }
)

const AssemblyPage = dynamic(
  () => import("@/components/game/assembly-page").then((m) => ({ default: m.AssemblyPage })),
  { ssr: false, loading: () => <LoadingScreen /> }
)

const QuizPanel = dynamic(
  () => import("@/components/game/quiz-panel").then((m) => ({ default: m.QuizPanel })),
  { ssr: false, loading: () => <LoadingScreen /> }
)

const CompleteScreen = dynamic(
  () => import("@/components/game/complete-screen").then((m) => ({ default: m.CompleteScreen })),
  { ssr: false, loading: () => <LoadingScreen /> }
)

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { currentView, setView } = useGameStore()

  console.log("Home renderizado, currentView:", currentView)

  return (
    <main className="h-screen overflow-hidden bg-background">
      {currentView === "landing" && <LandingPage />}
      {currentView === "assembly" && <AssemblyPage />}
      {currentView === "quiz" && <QuizPage />}
      {currentView === "complete" && <CompleteScreen />}
    </main>
  )
}

function QuizPage() {
  const { setView } = useGameStore()
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <button
          onClick={() => setView("landing")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {"<- Volver"}
        </button>
        <h1 className="font-bold text-foreground">Modo Quiz</h1>
        <div />
      </header>
      <div className="flex-1 overflow-y-auto">
        <QuizPanel />
      </div>
    </div>
  )
}

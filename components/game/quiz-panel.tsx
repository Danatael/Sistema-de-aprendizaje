"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { PC_PARTS } from "@/lib/pc-parts"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Trophy, ArrowRight } from "lucide-react"

export function QuizPanel() {
  const { quizAnswers, answerQuiz, score, setView } = useGameStore()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const currentPart = PC_PARTS[currentQuizIndex]
  const quiz = currentPart?.quiz
  const isLastQuiz = currentQuizIndex >= PC_PARTS.length - 1
  const alreadyAnswered = quizAnswers[currentPart?.id] !== undefined

  const handleAnswer = (optionIndex: number) => {
    if (showResult || alreadyAnswered) return
    setSelectedAnswer(optionIndex)
    setShowResult(true)
    const isCorrect = optionIndex === quiz.correctIndex
    answerQuiz(currentPart.id, isCorrect)
  }

  const handleNext = () => {
    if (isLastQuiz) {
      setView("complete")
    } else {
      setCurrentQuizIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const correctCount = Object.values(quizAnswers).filter(Boolean).length

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Prueba tus Conocimientos
          </h2>
          <p className="text-sm text-muted-foreground">
            Pregunta {currentQuizIndex + 1} de {PC_PARTS.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm text-primary">{score} pts</span>
          </div>
          <div className="rounded-full bg-chart-1/10 px-3 py-1">
            <span className="text-sm text-chart-1">
              {correctCount}/{Object.keys(quizAnswers).length} correctas
            </span>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {PC_PARTS.map((part, i) => {
          const answered = quizAnswers[part.id] !== undefined
          const correct = quizAnswers[part.id] === true
          return (
            <div
              key={part.id}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i === currentQuizIndex
                  ? "bg-primary"
                  : answered
                    ? correct
                      ? "bg-chart-1"
                      : "bg-destructive"
                    : "bg-secondary"
              }`}
            />
          )
        })}
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: currentPart.color }}
          />
          <span className="text-sm font-medium text-primary">
            {currentPart.nameEs}
          </span>
        </div>

        <h3 className="mb-6 text-lg font-semibold text-foreground">
          {quiz.question}
        </h3>

        <div className="flex flex-col gap-3">
          {quiz.options.map((option, i) => {
            const isSelected = selectedAnswer === i
            const isCorrect = i === quiz.correctIndex
            let variant: "default" | "outline" | "secondary" | "destructive" = "outline"

            if (showResult) {
              if (isCorrect) variant = "default"
              else if (isSelected && !isCorrect) variant = "destructive"
            }

            return (
              <Button
                key={i}
                variant={variant}
                className={`h-auto justify-start px-4 py-3 text-left ${
                  showResult && isCorrect
                    ? "bg-primary text-primary-foreground"
                    : showResult && isSelected && !isCorrect
                      ? "bg-destructive text-destructive-foreground"
                      : ""
                }`}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
              >
                <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-current text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && (
                  <CheckCircle2 className="ml-2 h-5 w-5 flex-shrink-0" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="ml-2 h-5 w-5 flex-shrink-0" />
                )}
              </Button>
            )
          })}
        </div>

        {showResult && (
          <div className="mt-4 flex items-center justify-between">
            <p
              className={`text-sm font-medium ${
                selectedAnswer === quiz.correctIndex
                  ? "text-primary"
                  : "text-destructive"
              }`}
            >
              {selectedAnswer === quiz.correctIndex
                ? "+50 puntos!"
                : `La respuesta correcta era: ${quiz.options[quiz.correctIndex]}`}
            </p>
            <Button size="sm" onClick={handleNext} className="gap-2">
              {isLastQuiz ? "Ver resultados" : "Siguiente"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Fun fact */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
        <p className="text-xs font-medium text-accent">Dato curioso</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentPart.funFact}
        </p>
      </div>
    </div>
  )
}

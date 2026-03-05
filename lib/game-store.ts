import { create } from "zustand"
import { PC_PARTS, type PCPart } from "./pc-parts"

interface GameState {
  currentView: "landing" | "assembly" | "quiz" | "complete"
  currentStep: number
  placedParts: string[]
  selectedPart: PCPart | null
  showHint: boolean
  score: number
  quizAnswers: Record<string, boolean>
  animatingPart: string | null

  setView: (view: GameState["currentView"]) => void
  setCurrentStep: (step: number) => void
  placePart: (partId: string) => void
  selectPart: (part: PCPart | null) => void
  toggleHint: () => void
  addScore: (points: number) => void
  answerQuiz: (partId: string, correct: boolean) => void
  setAnimatingPart: (partId: string | null) => void
  resetGame: () => void
  getNextPart: () => PCPart | undefined
  isPartPlaced: (partId: string) => boolean
}

export const useGameStore = create<GameState>((set, get) => ({
  currentView: "landing",
  currentStep: 1,
  placedParts: [],
  selectedPart: null,
  showHint: false,
  score: 0,
  quizAnswers: {},
  animatingPart: null,

  setView: (view) => set({ currentView: view }),
  setCurrentStep: (step) => set({ currentStep: step }),

  placePart: (partId) => {
    const state = get()
    if (!state.placedParts.includes(partId)) {
      const newPlaced = [...state.placedParts, partId]
      const nextStep = state.currentStep + 1
      set({
        placedParts: newPlaced,
        currentStep: nextStep,
        score: state.score + 100,
        showHint: false,
        animatingPart: partId,
      })
      setTimeout(() => {
        set({ animatingPart: null })
        if (newPlaced.length === PC_PARTS.length) {
          set({ currentView: "complete" })
        }
      }, 1000)
    }
  },

  selectPart: (part) => set({ selectedPart: part }),
  toggleHint: () => set((s) => ({ showHint: !s.showHint })),
  addScore: (points) => set((s) => ({ score: s.score + points })),

  answerQuiz: (partId, correct) => {
    set((s) => ({
      quizAnswers: { ...s.quizAnswers, [partId]: correct },
      score: correct ? s.score + 50 : s.score,
    }))
  },

  setAnimatingPart: (partId) => set({ animatingPart: partId }),

  resetGame: () =>
    set({
      currentView: "landing",
      currentStep: 1,
      placedParts: [],
      selectedPart: null,
      showHint: false,
      score: 0,
      quizAnswers: {},
      animatingPart: null,
    }),

  getNextPart: () => {
    const state = get()
    return PC_PARTS.find((p) => p.step === state.currentStep)
  },

  isPartPlaced: (partId) => get().placedParts.includes(partId),
}))

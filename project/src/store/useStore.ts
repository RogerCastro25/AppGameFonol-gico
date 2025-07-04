import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameScore, GameSettings, Patient, Phoneme, Word } from '../types';

interface GameState {
  currentScore: GameScore;
  gameSettings: GameSettings;
  patients: Patient[];
  currentPatient: Patient | null;
  
  // Actions
  updateScore: (correct: boolean) => void;
  resetScore: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  saveGameResult: (gameType: keyof Patient['progress'], score: GameScore) => void;
}

const defaultPhonemes: Phoneme[] = [
  { id: '1', sound: '/p/', word: 'pato', image: '🦆' },
  { id: '2', sound: '/b/', word: 'bola', image: '⚽' },
  { id: '3', sound: '/t/', word: 'tigre', image: '🐅' },
  { id: '4', sound: '/d/', word: 'dado', image: '🎲' },
  { id: '5', sound: '/k/', word: 'casa', image: '🏠' },
  { id: '6', sound: '/g/', word: 'gato', image: '🐱' },
  { id: '7', sound: '/f/', word: 'foca', image: '🦭' },
  { id: '8', sound: '/v/', word: 'vaca', image: '🐄' },
  { id: '9', sound: '/s/', word: 'sapo', image: '🐸' },
  { id: '10', sound: '/z/', word: 'zebra', image: '🦓' },
];

const defaultWords: Word[] = [
  {
    id: '1',
    text: 'casa',
    parts: [
      { id: '1a', text: 'ca', type: 'syllable', order: 1 },
      { id: '1b', text: 'sa', type: 'syllable', order: 2 },
    ],
    image: '🏠'
  },
  {
    id: '2',
    text: 'bola',
    parts: [
      { id: '2a', text: 'bo', type: 'syllable', order: 1 },
      { id: '2b', text: 'la', type: 'syllable', order: 2 },
    ],
    image: '⚽'
  },
  {
    id: '3',
    text: 'gato',
    parts: [
      { id: '3a', text: 'ga', type: 'syllable', order: 1 },
      { id: '3b', text: 'to', type: 'syllable', order: 2 },
    ],
    image: '🐱'
  },
];

export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScore: { correct: 0, total: 0, percentage: 0 },
      gameSettings: {
        difficulty: 'medium',
        soundEnabled: true,
        timeLimit: 30,
        customPhonemes: defaultPhonemes,
        customWords: defaultWords,
      },
      patients: [],
      currentPatient: null,

      updateScore: (correct: boolean) => {
        set((state) => {
          const newTotal = state.currentScore.total + 1;
          const newCorrect = state.currentScore.correct + (correct ? 1 : 0);
          const newPercentage = Math.round((newCorrect / newTotal) * 100);
          
          return {
            currentScore: {
              correct: newCorrect,
              total: newTotal,
              percentage: newPercentage,
            },
          };
        });
      },

      resetScore: () => {
        set({ currentScore: { correct: 0, total: 0, percentage: 0 } });
      },

      updateSettings: (settings: Partial<GameSettings>) => {
        set((state) => ({
          gameSettings: { ...state.gameSettings, ...settings },
        }));
      },

      addPatient: (patient: Patient) => {
        set((state) => ({
          patients: [...state.patients, patient],
        }));
      },

      updatePatient: (id: string, updates: Partial<Patient>) => {
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      setCurrentPatient: (patient: Patient | null) => {
        set({ currentPatient: patient });
      },

      saveGameResult: (gameType: keyof Patient['progress'], score: GameScore) => {
        const { currentPatient } = get();
        if (currentPatient) {
          set((state) => ({
            patients: state.patients.map((p) =>
              p.id === currentPatient.id
                ? {
                    ...p,
                    progress: {
                      ...p.progress,
                      [gameType]: [...p.progress[gameType], score],
                    },
                  }
                : p
            ),
          }));
        }
      },
    }),
    {
      name: 'speech-therapy-storage',
    }
  )
);
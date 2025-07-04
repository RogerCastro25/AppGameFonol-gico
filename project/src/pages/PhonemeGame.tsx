import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, CheckCircle, XCircle, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Confetti } from '../components/Confetti';
import { Phoneme } from '../types';

export const PhonemeGame: React.FC = () => {
  const { 
    currentScore, 
    gameSettings, 
    updateScore, 
    resetScore, 
    saveGameResult,
    currentPatient 
  } = useStore();
  
  const [currentPhoneme, setCurrentPhoneme] = useState<Phoneme | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const phonemes = gameSettings.customPhonemes;

  useEffect(() => {
    if (gameStarted && phonemes.length > 0) {
      selectRandomPhoneme();
    }
  }, [gameStarted, phonemes]);

  const selectRandomPhoneme = () => {
    const randomIndex = Math.floor(Math.random() * phonemes.length);
    setCurrentPhoneme(phonemes[randomIndex]);
    setFeedback(null);
  };

  const playSound = () => {
    if (currentPhoneme && gameSettings.soundEnabled) {
      // Simular reprodução de som
      const utterance = new SpeechSynthesisUtterance(currentPhoneme.sound);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    setIsListening(true);
    
    // Simular reconhecimento de voz (em uma implementação real, usaria Web Speech API)
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3; // 70% de chance de acerto para demonstração
      handlePronunciation(isCorrect);
    }, 2000);
  };

  const handlePronunciation = (isCorrect: boolean) => {
    setIsListening(false);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateScore(isCorrect);

    if (isCorrect) {
      setShowConfetti(true);
    }

    setTimeout(() => {
      selectRandomPhoneme();
    }, 2000);
  };

  const resetGame = () => {
    resetScore();
    setGameStarted(false);
    setCurrentPhoneme(null);
    setFeedback(null);
  };

  const startGame = () => {
    setGameStarted(true);
    resetScore();
  };

  const endGame = () => {
    if (currentPatient) {
      saveGameResult('phonemeGame', currentScore);
    }
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🗣️ Jogo de Fonemas
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ouça o som e tente pronunciá-lo corretamente!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            <div className="text-6xl">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800">Como Jogar</h3>
            <div className="text-left space-y-3 text-gray-600">
              <p>• Clique no botão de som para ouvir o fonema</p>
              <p>• Clique em "Falar" e pronuncie o som</p>
              <p>• Receba feedback sobre sua pronúncia</p>
              <p>• Tente acertar o máximo de sons possível!</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <Play className="h-6 w-6" />
              <span>Começar Jogo</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Jogo de Fonemas</h1>
        <div className="flex space-x-4">
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar</span>
          </button>
          <button
            onClick={endGame}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* Score */}
      <ScoreDisplay score={currentScore} />

      {/* Game Area */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <AnimatePresence mode="wait">
          {currentPhoneme && (
            <motion.div
              key={currentPhoneme.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-8"
            >
              {/* Phoneme Display */}
              <div className="space-y-4">
                <div className="text-8xl">{currentPhoneme.image}</div>
                <div className="text-4xl font-bold text-purple-600">
                  {currentPhoneme.sound}
                </div>
                <div className="text-2xl text-gray-600">
                  {currentPhoneme.word}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={playSound}
                  className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Volume2 className="h-8 w-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startListening}
                  disabled={isListening}
                  className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isListening ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    <Volume2 className="h-8 w-8" />
                  )}
                </motion.button>
              </div>

              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-gray-600"
                >
                  🎤 Escutando... Fale agora!
                </motion.div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-center justify-center space-x-2 text-2xl font-bold ${
                      feedback === 'correct' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <>
                        <CheckCircle className="h-8 w-8" />
                        <span>Muito bem! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8" />
                        <span>Tente novamente! 💪</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
        <h3 className="font-semibold text-purple-800 mb-2">Instruções:</h3>
        <ul className="text-purple-700 space-y-1">
          <li>• Clique no botão azul para ouvir o som</li>
          <li>• Clique no botão verde e pronuncie o fonema</li>
          <li>• Tente imitar o som da melhor forma possível</li>
          <li>• Continue praticando para melhorar sua pontuação!</li>
        </ul>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, CheckCircle, XCircle, Play, Shuffle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Confetti } from '../components/Confetti';
import { Phoneme } from '../types';

export const AssociationGame: React.FC = () => {
  const { 
    currentScore, 
    gameSettings, 
    updateScore, 
    resetScore, 
    saveGameResult,
    currentPatient 
  } = useStore();
  
  const [currentSound, setCurrentSound] = useState<Phoneme | null>(null);
  const [options, setOptions] = useState<Phoneme[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const phonemes = gameSettings.customPhonemes;

  useEffect(() => {
    if (gameStarted && phonemes.length > 0) {
      generateNewRound();
    }
  }, [gameStarted, phonemes]);

  const generateNewRound = () => {
    const correctAnswer = phonemes[Math.floor(Math.random() * phonemes.length)];
    const wrongAnswers = phonemes
      .filter(p => p.id !== correctAnswer.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentSound(correctAnswer);
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback(null);
  };

  const playSound = () => {
    if (currentSound && gameSettings.soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(currentSound.sound);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption || !currentSound) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentSound.id;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateScore(isCorrect);

    if (isCorrect) {
      setShowConfetti(true);
    }

    setTimeout(() => {
      generateNewRound();
    }, 2000);
  };

  const resetGame = () => {
    resetScore();
    setGameStarted(false);
    setCurrentSound(null);
    setOptions([]);
    setFeedback(null);
  };

  const startGame = () => {
    setGameStarted(true);
    resetScore();
  };

  const endGame = () => {
    if (currentPatient) {
      saveGameResult('associationGame', currentScore);
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
            🔗 Jogo de Associação
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ouça o som e escolha a imagem correspondente!
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
              <p>• Ouça o som tocado automaticamente</p>
              <p>• Observe as três opções de imagens</p>
              <p>• Clique na imagem que corresponde ao som</p>
              <p>• Acerte o máximo de associações possível!</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
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
        <h1 className="text-3xl font-bold text-gray-800">Jogo de Associação</h1>
        <div className="flex space-x-4">
          <button
            onClick={generateNewRound}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span>Nova Rodada</span>
          </button>
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
        {currentSound && (
          <div className="space-y-8">
            {/* Sound Player */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Ouça o som e escolha a imagem correta:
              </h2>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={playSound}
                className="bg-blue-500 text-white p-6 rounded-full shadow-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <Volume2 className="h-12 w-12" />
              </motion.button>
              
              <p className="text-lg text-gray-600">
                Clique no alto-falante para ouvir novamente
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-6">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={selectedOption !== null}
                  className={`p-6 rounded-2xl border-4 transition-all duration-300 ${
                    selectedOption === option.id
                      ? feedback === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : selectedOption && option.id === currentSound.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  } ${selectedOption ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="space-y-3">
                    <div className="text-6xl">{option.image}</div>
                    <div className="text-xl font-semibold text-gray-800">
                      {option.word}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

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
                      <span>Perfeito! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8" />
                      <span>Ops! Tente novamente! 💪</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
        <h3 className="font-semibold text-green-800 mb-2">Instruções:</h3>
        <ul className="text-green-700 space-y-1">
          <li>• O som será tocado automaticamente no início de cada rodada</li>
          <li>• Clique no alto-falante para ouvir novamente</li>
          <li>• Escolha a imagem que melhor representa o som ouvido</li>
          <li>• Preste atenção aos detalhes para fazer a associação correta!</li>
        </ul>
      </div>
    </div>
  );
};
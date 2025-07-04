import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RotateCcw, CheckCircle, XCircle, Play, Shuffle, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Confetti } from '../components/Confetti';
import { Word, WordPart } from '../types';

export const WordBuildingGame: React.FC = () => {
  const { 
    currentScore, 
    gameSettings, 
    updateScore, 
    resetScore, 
    saveGameResult,
    currentPatient 
  } = useStore();
  
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [shuffledParts, setShuffledParts] = useState<WordPart[]>([]);
  const [arrangedParts, setArrangedParts] = useState<WordPart[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const words = gameSettings.customWords;

  useEffect(() => {
    if (gameStarted && words.length > 0) {
      generateNewRound();
    }
  }, [gameStarted, words]);

  const generateNewRound = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = [...randomWord.parts].sort(() => Math.random() - 0.5);
    
    setCurrentWord(randomWord);
    setShuffledParts(shuffled);
    setArrangedParts([]);
    setFeedback(null);
  };

  const playWordSound = () => {
    if (currentWord && gameSettings.soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(currentWord.text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'shuffled' && destination.droppableId === 'arranged') {
      // Move from shuffled to arranged
      const newShuffledParts = Array.from(shuffledParts);
      const newArrangedParts = Array.from(arrangedParts);
      const [movedPart] = newShuffledParts.splice(source.index, 1);
      newArrangedParts.splice(destination.index, 0, movedPart);
      
      setShuffledParts(newShuffledParts);
      setArrangedParts(newArrangedParts);
    } else if (source.droppableId === 'arranged' && destination.droppableId === 'shuffled') {
      // Move from arranged to shuffled
      const newArrangedParts = Array.from(arrangedParts);
      const newShuffledParts = Array.from(shuffledParts);
      const [movedPart] = newArrangedParts.splice(source.index, 1);
      newShuffledParts.splice(destination.index, 0, movedPart);
      
      setArrangedParts(newArrangedParts);
      setShuffledParts(newShuffledParts);
    } else if (source.droppableId === destination.droppableId) {
      // Reorder within the same list
      const items = source.droppableId === 'shuffled' ? shuffledParts : arrangedParts;
      const newItems = Array.from(items);
      const [movedPart] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedPart);
      
      if (source.droppableId === 'shuffled') {
        setShuffledParts(newItems);
      } else {
        setArrangedParts(newItems);
      }
    }
  };

  const checkAnswer = () => {
    if (!currentWord || arrangedParts.length !== currentWord.parts.length) return;
    
    const isCorrect = arrangedParts.every((part, index) => 
      part.order === index + 1
    );
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateScore(isCorrect);

    if (isCorrect) {
      setShowConfetti(true);
    }

    setTimeout(() => {
      generateNewRound();
    }, 2500);
  };

  const resetGame = () => {
    resetScore();
    setGameStarted(false);
    setCurrentWord(null);
    setShuffledParts([]);
    setArrangedParts([]);
    setFeedback(null);
  };

  const startGame = () => {
    setGameStarted(true);
    resetScore();
  };

  const endGame = () => {
    if (currentPatient) {
      saveGameResult('wordBuildingGame', currentScore);
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
            🧩 Jogo de Construção de Palavras
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Arraste as sílabas para formar a palavra correta!
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
              <p>• Observe a imagem da palavra a ser formada</p>
              <p>• Arraste as sílabas da área inferior para a superior</p>
              <p>• Organize as sílabas na ordem correta</p>
              <p>• Clique em "Verificar" para conferir sua resposta</p>
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
        <h1 className="text-3xl font-bold text-gray-800">Construção de Palavras</h1>
        <div className="flex space-x-4">
          <button
            onClick={generateNewRound}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span>Nova Palavra</span>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {currentWord && (
            <>
              {/* Word Target */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-8xl">{currentWord.image}</div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={playWordSound}
                    className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <Volume2 className="h-6 w-6" />
                  </motion.button>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Monte a palavra: <span className="text-purple-600">{currentWord.text}</span>
                </h2>
              </div>

              {/* Drop Zone for Arranged Parts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Arraste as sílabas aqui na ordem correta:
                </h3>
                <Droppable droppableId="arranged" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-20 p-4 border-4 border-dashed rounded-xl transition-colors ${
                        snapshot.isDraggingOver
                          ? 'border-purple-400 bg-purple-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex space-x-3 justify-center">
                        {arrangedParts.map((part, index) => (
                          <Draggable key={part.id} draggableId={part.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-purple-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transition-transform ${
                                  snapshot.isDragging ? 'rotate-3 scale-105' : ''
                                }`}
                              >
                                {part.text}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Available Parts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Sílabas disponíveis:
                </h3>
                <Droppable droppableId="shuffled" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-20 p-4 border-2 rounded-xl transition-colors ${
                        snapshot.isDraggingOver
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex space-x-3 justify-center flex-wrap">
                        {shuffledParts.map((part, index) => (
                          <Draggable key={part.id} draggableId={part.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transition-transform cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging ? 'rotate-3 scale-105' : 'hover:scale-105'
                                }`}
                              >
                                {part.text}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Check Button */}
              {arrangedParts.length === currentWord.parts.length && !feedback && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={checkAnswer}
                    className="bg-green-500 text-white px-8 py-3 rounded-full text-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
                  >
                    Verificar Resposta
                  </motion.button>
                </div>
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
                        <span>Excelente! Palavra formada corretamente! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8" />
                        <span>Quase lá! Tente reorganizar as sílabas! 💪</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </DragDropContext>

      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
        <h3 className="font-semibold text-purple-800 mb-2">Instruções:</h3>
        <ul className="text-purple-700 space-y-1">
          <li>• Observe a imagem e ouça a palavra clicando no alto-falante</li>
          <li>• Arraste as sílabas da área inferior para a superior</li>
          <li>• Organize as sílabas na ordem correta para formar a palavra</li>
          <li>• Clique em "Verificar Resposta" quando terminar</li>
        </ul>
      </div>
    </div>
  );
};
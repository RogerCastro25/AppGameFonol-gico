import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Users, Volume2, VolumeX, Clock, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Patient, Phoneme, Word } from '../types';

export const Settings: React.FC = () => {
  const { 
    gameSettings, 
    updateSettings, 
    patients, 
    addPatient, 
    currentPatient, 
    setCurrentPatient 
  } = useStore();
  
  const [newPatient, setNewPatient] = useState({ name: '', age: '', notes: '' });
  const [newPhoneme, setNewPhoneme] = useState({ sound: '', word: '', image: '' });
  const [newWord, setNewWord] = useState({ text: '', syllables: '', image: '' });
  const [activeTab, setActiveTab] = useState<'general' | 'patients' | 'content'>('general');

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age) {
      const patient: Patient = {
        id: Date.now().toString(),
        name: newPatient.name,
        age: parseInt(newPatient.age),
        notes: newPatient.notes,
        progress: {
          phonemeGame: [],
          associationGame: [],
          wordBuildingGame: [],
        },
      };
      addPatient(patient);
      setNewPatient({ name: '', age: '', notes: '' });
    }
  };

  const handleAddPhoneme = () => {
    if (newPhoneme.sound && newPhoneme.word && newPhoneme.image) {
      const phoneme: Phoneme = {
        id: Date.now().toString(),
        sound: newPhoneme.sound,
        word: newPhoneme.word,
        image: newPhoneme.image,
      };
      updateSettings({
        customPhonemes: [...gameSettings.customPhonemes, phoneme],
      });
      setNewPhoneme({ sound: '', word: '', image: '' });
    }
  };

  const handleAddWord = () => {
    if (newWord.text && newWord.syllables && newWord.image) {
      const syllables = newWord.syllables.split('-').map((syl, index) => ({
        id: `${Date.now()}-${index}`,
        text: syl.trim(),
        type: 'syllable' as const,
        order: index + 1,
      }));

      const word: Word = {
        id: Date.now().toString(),
        text: newWord.text,
        parts: syllables,
        image: newWord.image,
      };
      
      updateSettings({
        customWords: [...gameSettings.customWords, word],
      });
      setNewWord({ text: '', syllables: '', image: '' });
    }
  };

  const removePhoneme = (id: string) => {
    updateSettings({
      customPhonemes: gameSettings.customPhonemes.filter(p => p.id !== id),
    });
  };

  const removeWord = (id: string) => {
    updateSettings({
      customWords: gameSettings.customWords.filter(w => w.id !== id),
    });
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Volume2 },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'content', label: 'Conteúdo', icon: Plus },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">⚙️ Configurações</h1>
        <p className="text-xl text-gray-600">
          Personalize os jogos e gerencie pacientes
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                activeTab === id
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações Gerais</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">
                      Dificuldade
                    </span>
                    <select
                      value={gameSettings.difficulty}
                      onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">
                      Tempo Limite (segundos)
                    </span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={gameSettings.timeLimit}
                        onChange={(e) => updateSettings({ timeLimit: parseInt(e.target.value) })}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="10"
                        max="120"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {gameSettings.soundEnabled ? (
                        <Volume2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <VolumeX className="h-6 w-6 text-red-600" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">Som Habilitado</h3>
                        <p className="text-sm text-gray-600">
                          Reproduzir sons durante os jogos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings({ soundEnabled: !gameSettings.soundEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        gameSettings.soundEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          gameSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Patients Management */}
          {activeTab === 'patients' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Pacientes</h2>
              
              {/* Add New Patient */}
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Adicionar Novo Paciente</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do paciente"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Idade"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Observações"
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                    className="p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAddPatient}
                  className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Paciente</span>
                </button>
              </div>

              {/* Current Patient */}
              {currentPatient && (
                <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Paciente Atual</h3>
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{currentPatient.name}</p>
                      <p className="text-sm text-green-600">
                        {currentPatient.age} anos • {currentPatient.notes}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPatient(null)}
                    className="mt-3 text-sm text-green-700 hover:text-green-800 underline"
                  >
                    Remover seleção
                  </button>
                </div>
              )}

              {/* Patients List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Lista de Pacientes</h3>
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum paciente cadastrado ainda.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          currentPatient?.id === patient.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-800">{patient.name}</h4>
                              <p className="text-sm text-gray-600">
                                {patient.age} anos • {patient.notes}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentPatient(patient)}
                              className="text-blue-600 hover:text-blue-700 text-sm underline"
                            >
                              Selecionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Content Management */}
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Conteúdo</h2>
              
              {/* Add Phonemes */}
              <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Adicionar Fonema</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Som (ex: /p/)"
                    value={newPhoneme.sound}
                    onChange={(e) => setNewPhoneme({ ...newPhoneme, sound: e.target.value })}
                    className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Palavra (ex: pato)"
                    value={newPhoneme.word}
                    onChange={(e) => setNewPhoneme({ ...newPhoneme, word: e.target.value })}
                    className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Emoji (ex: 🦆)"
                    value={newPhoneme.image}
                    onChange={(e) => setNewPhoneme({ ...newPhoneme, image: e.target.value })}
                    className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAddPhoneme}
                  className="mt-4 flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Fonema</span>
                </button>
              </div>

              {/* Phonemes List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Fonemas Cadastrados</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameSettings.customPhonemes.map((phoneme) => (
                    <div key={phoneme.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{phoneme.image}</span>
                          <div>
                            <p className="font-medium text-gray-800">{phoneme.sound}</p>
                            <p className="text-sm text-gray-600">{phoneme.word}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePhoneme(phoneme.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Words */}
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Adicionar Palavra</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Palavra (ex: casa)"
                    value={newWord.text}
                    onChange={(e) => setNewWord({ ...newWord, text: e.target.value })}
                    className="p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Sílabas (ex: ca-sa)"
                    value={newWord.syllables}
                    onChange={(e) => setNewWord({ ...newWord, syllables: e.target.value })}
                    className="p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Emoji (ex: 🏠)"
                    value={newWord.image}
                    onChange={(e) => setNewWord({ ...newWord, image: e.target.value })}
                    className="p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAddWord}
                  className="mt-4 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Palavra</span>
                </button>
              </div>

              {/* Words List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Palavras Cadastradas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameSettings.customWords.map((word) => (
                    <div key={word.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{word.image}</span>
                          <div>
                            <p className="font-medium text-gray-800">{word.text}</p>
                            <p className="text-sm text-gray-600">
                              {word.parts.map(p => p.text).join('-')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeWord(word.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
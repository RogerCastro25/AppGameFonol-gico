import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, Settings, Play, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const Home: React.FC = () => {
  const { currentPatient, patients } = useStore();

  const games = [
    {
      title: 'Jogo de Fonemas',
      description: 'Pratique a pronúncia de sons específicos com feedback visual',
      path: '/phoneme',
      icon: '🗣️',
      color: 'from-blue-400 to-blue-600',
      difficulty: 'Fácil'
    },
    {
      title: 'Associação de Sons',
      description: 'Relacione sons com imagens correspondentes',
      path: '/association',
      icon: '🔗',
      color: 'from-green-400 to-green-600',
      difficulty: 'Médio'
    },
    {
      title: 'Construção de Palavras',
      description: 'Monte palavras arrastando sílabas e letras',
      path: '/word-building',
      icon: '🧩',
      color: 'from-purple-400 to-purple-600',
      difficulty: 'Difícil'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao FonoJogos! 🎮
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Jogos interativos para fonoaudiologia infantil que tornam o aprendizado divertido e eficaz
        </p>
      </motion.div>

      {/* Patient Info */}
      {currentPatient && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Paciente Atual: {currentPatient.name}
              </h3>
              <p className="text-gray-600">
                {currentPatient.age} anos • {currentPatient.notes}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Games Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={game.path} className="block">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                <div className={`bg-gradient-to-r ${game.color} p-4 rounded-xl mb-4 text-center`}>
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <div className="text-white font-semibold">{game.difficulty}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">Jogar Agora</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          Estatísticas Rápidas
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
            <div className="text-sm text-gray-600">Pacientes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Jogos</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-gray-600">Diversão</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">100%</div>
            <div className="text-sm text-gray-600">Educativo</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/settings"
          className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        <Link
          to="/phoneme"
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
        >
          <Gamepad2 className="h-5 w-5" />
          <span>Começar a Jogar</span>
        </Link>
      </div>
    </div>
  );
};
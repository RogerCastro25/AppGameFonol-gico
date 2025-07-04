import React from 'react';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { GameScore } from '../types';

interface ScoreDisplayProps {
  score: GameScore;
  showDetails?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  showDetails = true 
}) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className={`p-4 rounded-xl ${getScoreBackground(score.percentage)} border-2 border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getScoreBackground(score.percentage)}`}>
            <Trophy className={`h-6 w-6 ${getScoreColor(score.percentage)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Pontuação</h3>
            <p className={`text-2xl font-bold ${getScoreColor(score.percentage)}`}>
              {score.percentage}%
            </p>
          </div>
        </div>
        
        {showDetails && (
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              <span>{score.correct}/{score.total}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <TrendingUp className="h-4 w-4" />
              <span>Acertos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
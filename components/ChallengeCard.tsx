'use client';

import { Clock, Users, Star, ChevronRight, Zap } from 'lucide-react';
import { Challenge } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChallengeCardProps {
  challenge: Challenge;
  index?: number;
}

export default function ChallengeCard({ challenge, index = 0 }: ChallengeCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const categoryGradients: { [key: string]: string } = {
    'Writing': 'from-blue-500 to-purple-600',
    'Visual Arts': 'from-pink-500 to-rose-600',
    'Poetry': 'from-green-500 to-teal-600',
    'Music': 'from-yellow-500 to-orange-600',
    'Photography': 'from-indigo-500 to-blue-600',
    'Design': 'from-purple-500 to-pink-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        categoryGradients[challenge.category] || 'from-gray-500 to-gray-600'
      )} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                difficultyColors[challenge.difficulty]
              )}>
                {challenge.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {challenge.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {challenge.description}
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
            {challenge.points}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{challenge.duration}min</span>
            </div>
            {challenge.completedBy && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{challenge.completedBy}</span>
              </div>
            )}
            {challenge.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{challenge.rating}</span>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        </div>
      </div>

      {/* Quick start indicator for short challenges */}
      {challenge.duration <= 5 && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Zap className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Quick</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ChevronLeft, Play, Pause, CheckCircle, RefreshCw, Award, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { challenges } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challenge = challenges.find(c => c.id === params.id);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submission, setSubmission] = useState('');

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.duration * 60);
    }
  }, [challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Challenge not found</h2>
          <Link href="/challenges">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
              Back to Challenges
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(challenge.duration * 60);
    setIsCompleted(false);
    setSubmission('');
  };

  const handleComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/challenges">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Challenges
          </motion.button>
        </Link>

        {/* Challenge Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  difficultyColors[challenge.difficulty]
                )}>
                  {challenge.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {challenge.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {challenge.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {challenge.description}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                {challenge.points}
              </div>
              <span className="text-xs text-gray-500 mt-1">points</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{challenge.duration} minutes</span>
            </div>
            {challenge.completedBy && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{challenge.completedBy} completed</span>
              </div>
            )}
            {challenge.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{challenge.rating}/5</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Timer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Challenge Timer
            </h2>
            <div className={cn(
              "text-6xl font-bold mb-6",
              timeLeft === 0 ? "text-red-500" : isRunning ? "text-purple-600" : "text-gray-600 dark:text-gray-400"
            )}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center justify-center gap-4">
              {!isRunning && !isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Challenge
                </motion.button>
              )}
              {isRunning && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComplete}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete
                  </motion.button>
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Requirements & Tips */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {challenge.requirements && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Requirements
                </h3>
              </div>
              <ul className="space-y-2">
                {challenge.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {challenge.examples && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Example Ideas
                </h3>
              </div>
              <ul className="space-y-2">
                {challenge.examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Submission Section */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Challenge Completed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Great job! You've earned {challenge.points} points.
              </p>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Share your creation (optional)
              </label>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Describe what you created..."
                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Submit & Share
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
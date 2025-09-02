'use client';

import { motion } from 'framer-motion';
import { User, Trophy, Target, Clock, TrendingUp, Award, Calendar, Settings, LogOut, Star, Zap } from 'lucide-react';
import { achievements, challenges } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
  const userStats = {
    totalPoints: 1850,
    challengesCompleted: 33,
    currentStreak: 6,
    longestStreak: 15,
    rank: 8,
    joinedDate: 'October 2024',
    favoriteCategory: 'Visual Arts'
  };

  const recentActivity = [
    { id: '1', title: '30-Second Story', completed: true, date: 'Today', points: 50 },
    { id: '2', title: 'Abstract Emotion', completed: true, date: 'Yesterday', points: 100 },
    { id: '3', title: 'Haiku Chain', completed: true, date: '2 days ago', points: 75 },
    { id: '5', title: 'Photo Story Trilogy', completed: true, date: '3 days ago', points: 60 },
  ];

  const unlockedAchievements = ['first-challenge', 'versatile', 'speed-demon'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                🌈
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                {userStats.rank}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sophie Turner
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Creative enthusiast • Joined {userStats.joinedDate}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  {userStats.favoriteCategory}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                  Active Creator
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.challengesCompleted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.currentStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">#{userStats.rank}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ranking</div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <Link href={`/challenge/${activity.id}`}>
                        <p className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {activity.title}
                        </p>
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    +{activity.points}
                  </span>
                </motion.div>
              ))}
            </div>
            <Link href="/challenges">
              <button className="w-full mt-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                View All Activity
              </button>
            </Link>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement, index) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all",
                      isUnlocked
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30"
                        : "bg-gray-100 dark:bg-gray-700/50 opacity-50"
                    )}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                      {achievement.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <Zap className="inline w-4 h-4 mr-1" />
                {unlockedAchievements.length} of {achievements.length} achievements unlocked
              </p>
            </div>
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Weekly Progress
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const height = Math.random() * 100;
              const isToday = index === 5;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                    className={cn(
                      "w-full rounded-t-lg transition-colors",
                      isToday
                        ? "bg-gradient-to-t from-purple-600 to-pink-600"
                        : "bg-gradient-to-t from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"
                    )}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
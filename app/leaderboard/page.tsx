'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Star, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  challenges: number;
  streak: number;
  badge?: 'gold' | 'silver' | 'bronze';
}

export default function LeaderboardPage() {
  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: 'Alex Chen', avatar: '🎨', points: 2450, challenges: 48, streak: 15, badge: 'gold' },
    { rank: 2, name: 'Sarah Miller', avatar: '✨', points: 2380, challenges: 45, streak: 12, badge: 'silver' },
    { rank: 3, name: 'James Wilson', avatar: '🚀', points: 2290, challenges: 42, streak: 8, badge: 'bronze' },
    { rank: 4, name: 'Emma Davis', avatar: '🌟', points: 2150, challenges: 40, streak: 7 },
    { rank: 5, name: 'Michael Brown', avatar: '🎯', points: 2050, challenges: 38, streak: 5 },
    { rank: 6, name: 'Lisa Johnson', avatar: '💫', points: 1980, challenges: 36, streak: 10 },
    { rank: 7, name: 'David Lee', avatar: '🔥', points: 1920, challenges: 35, streak: 4 },
    { rank: 8, name: 'Sophie Turner', avatar: '🌈', points: 1850, challenges: 33, streak: 6 },
    { rank: 9, name: 'Ryan Garcia', avatar: '⚡', points: 1780, challenges: 31, streak: 3 },
    { rank: 10, name: 'Olivia White', avatar: '🦋', points: 1720, challenges: 30, streak: 9 },
  ];

  const timeFilters = ['Today', 'This Week', 'This Month', 'All Time'];
  const categoryFilters = ['All Categories', 'Writing', 'Visual Arts', 'Music', 'Poetry'];

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'gold':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'silver':
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 'bronze':
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Celebrating our most creative and dedicated creators
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <div className="flex gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all",
                  filter === 'All Time'
                    ? "bg-purple-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {/* Second Place */}
          <div className="mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl p-6 text-center text-white shadow-xl"
            >
              <div className="text-4xl mb-2">{leaderboardData[1].avatar}</div>
              <Medal className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold">{leaderboardData[1].name}</h3>
              <p className="text-2xl font-bold mt-2">{leaderboardData[1].points}</p>
              <p className="text-sm opacity-90">points</p>
            </motion.div>
          </div>

          {/* First Place */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-center text-white shadow-xl transform scale-110"
            >
              <div className="text-5xl mb-2">{leaderboardData[0].avatar}</div>
              <Trophy className="w-10 h-10 mx-auto mb-2" />
              <h3 className="font-bold text-lg">{leaderboardData[0].name}</h3>
              <p className="text-3xl font-bold mt-2">{leaderboardData[0].points}</p>
              <p className="text-sm opacity-90">points</p>
            </motion.div>
          </div>

          {/* Third Place */}
          <div className="mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-center text-white shadow-xl"
            >
              <div className="text-4xl mb-2">{leaderboardData[2].avatar}</div>
              <Award className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold">{leaderboardData[2].name}</h3>
              <p className="text-2xl font-bold mt-2">{leaderboardData[2].points}</p>
              <p className="text-sm opacity-90">points</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Challenges
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboardData.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          getRankStyle(user.rank)
                        )}>
                          {user.rank}
                        </span>
                        {getBadgeIcon(user.badge)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          {user.rank <= 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Top Creator
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.points}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {user.challenges}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {user.streak} days
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <Clock className="w-8 h-8 mb-3" />
            <h3 className="text-2xl font-bold mb-1">24h</h3>
            <p className="opacity-90">Most active time</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <Target className="w-8 h-8 mb-3" />
            <h3 className="text-2xl font-bold mb-1">523</h3>
            <p className="opacity-90">Challenges today</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-2xl font-bold mb-1">89%</h3>
            <p className="opacity-90">Completion rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
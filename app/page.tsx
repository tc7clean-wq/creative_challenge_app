'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { challenges, categories } from '@/lib/data';
import ChallengeCard from '@/components/ChallengeCard';

export default function Home() {
  const featuredChallenges = challenges.slice(0, 3);
  
  const stats = [
    { icon: Target, label: 'Active Challenges', value: challenges.length },
    { icon: Users, label: 'Creative Minds', value: '2.3k+' },
    { icon: Trophy, label: 'Completed', value: '15k+' },
    { icon: Zap, label: 'Daily Active', value: '500+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-blue-600/10 dark:from-orange-600/20 dark:to-blue-600/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-6xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900/30 dark:to-green-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-green-700 dark:from-orange-300 dark:to-green-300">
              Unleash Your Creative Potential
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Creative Challenges
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Every Single Day</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Push your creative boundaries with daily challenges in writing, art, music, and more. 
            Join thousands of creators on their journey to artistic excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/challenges">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/leaderboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                View Leaderboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 text-white mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Creative Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find challenges that match your creative interests
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-8 text-center text-white">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm opacity-90 mt-2">
                    {challenges.filter(c => c.category === category.name).length} challenges
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Challenges
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Hand-picked challenges to spark your creativity
              </p>
            </div>
            <Link href="/challenges">
              <button className="hidden md:flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium hover:gap-3 transition-all">
                View All
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredChallenges.map((challenge, index) => (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <ChallengeCard challenge={challenge} index={index} />
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link href="/challenges">
              <button className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                View All Challenges
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
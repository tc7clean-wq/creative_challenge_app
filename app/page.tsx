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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 paint-splash">
      {/* Paint Splash Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="paint-blob absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-400" />
        <div className="paint-blob absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400" style={{ animationDelay: '2s' }} />
        <div className="paint-blob absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400 to-teal-400" style={{ animationDelay: '4s' }} />
        <div className="paint-blob absolute bottom-40 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400" style={{ animationDelay: '6s' }} />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-6xl mx-auto text-center"
        >
          {/* Metallic Gold Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 metallic-gold tracking-tight">
            CREATIVE CHALLENGE
          </h1>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full mb-6 shadow-xl">
            <Sparkles className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unleash Your Artistic Potential with AI-Inspired Creativity
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Daily Artistic</span>
            <br />
            <span className="text-gray-700 dark:text-gray-300">Challenges</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Push your creative boundaries with daily challenges in writing, art, music, and more. 
            Join thousands of creators on their journey to artistic excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/challenges">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Start Creating</span>
                <ArrowRight className="w-5 h-5 relative" />
              </motion.button>
            </Link>
            <Link href="/leaderboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
              >
                View Leaderboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 mb-3 shadow-lg">
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
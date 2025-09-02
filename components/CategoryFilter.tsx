'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full font-medium transition-all relative overflow-hidden",
          selectedCategory === null
            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
            : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50"
        )}
      >
        All Challenges
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.name)}
          className={cn(
            "px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 relative overflow-hidden",
            selectedCategory === category.name
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
              : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
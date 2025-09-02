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
          "px-4 py-2 rounded-full font-medium transition-all",
          selectedCategory === null
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
            "px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2",
            selectedCategory === category.name
              ? "text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          style={{
            background: selectedCategory === category.name
              ? `linear-gradient(135deg, ${category.color.split(' ').join(', ')})`
              : undefined
          }}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
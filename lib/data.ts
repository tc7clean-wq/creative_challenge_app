export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  points: number;
  tags: string[];
  requirements?: string[];
  examples?: string[];
  image?: string;
  completedBy?: number;
  rating?: number;
}

export interface UserProgress {
  challengeId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent?: number;
  submission?: string;
  score?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: string;
}

export const challenges: Challenge[] = [
  {
    id: '1',
    title: '30-Second Story',
    description: 'Write a complete story in exactly 30 seconds. The story must have a beginning, middle, and end.',
    category: 'Writing',
    difficulty: 'beginner',
    duration: 0.5,
    points: 50,
    tags: ['creative-writing', 'speed', 'storytelling'],
    requirements: ['Must be between 50-100 words', 'Must have a clear narrative arc', 'Timer stops at 30 seconds'],
    examples: ['A lost key leads to an unexpected adventure', 'The last cookie in the jar has magical properties'],
    completedBy: 234,
    rating: 4.5
  },
  {
    id: '2',
    title: 'Abstract Emotion',
    description: 'Create an abstract drawing that represents a specific emotion without using recognizable objects or faces.',
    category: 'Visual Arts',
    difficulty: 'intermediate',
    duration: 15,
    points: 100,
    tags: ['drawing', 'abstract', 'emotional-expression'],
    requirements: ['No text or numbers', 'Use at least 3 colors', 'Focus on shapes, lines, and colors only'],
    completedBy: 156,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Haiku Chain',
    description: 'Write a series of 3 connected haikus that tell a story through the seasons.',
    category: 'Poetry',
    difficulty: 'intermediate',
    duration: 10,
    points: 75,
    tags: ['poetry', 'haiku', 'nature'],
    requirements: ['Follow 5-7-5 syllable structure', 'Each haiku represents a different season', 'They must connect to tell one story'],
    completedBy: 89,
    rating: 4.8
  },
  {
    id: '4',
    title: 'One-Minute Melody',
    description: 'Compose and record a complete musical piece in just one minute using any instrument or voice.',
    category: 'Music',
    difficulty: 'advanced',
    duration: 1,
    points: 150,
    tags: ['composition', 'music', 'speed-challenge'],
    requirements: ['Must be exactly 60 seconds', 'Include at least melody and rhythm', 'Can use any instrument or voice'],
    completedBy: 45,
    rating: 4.6
  },
  {
    id: '5',
    title: 'Photo Story Trilogy',
    description: 'Take three photos that together tell a complete story without any text.',
    category: 'Photography',
    difficulty: 'beginner',
    duration: 20,
    points: 60,
    tags: ['photography', 'storytelling', 'visual-narrative'],
    requirements: ['Exactly 3 photos', 'No text or captions', 'Clear narrative progression'],
    completedBy: 312,
    rating: 4.4
  },
  {
    id: '6',
    title: 'Character in Crisis',
    description: 'Design a unique character and show them dealing with an unexpected crisis in a single illustration.',
    category: 'Visual Arts',
    difficulty: 'advanced',
    duration: 30,
    points: 200,
    tags: ['character-design', 'illustration', 'storytelling'],
    requirements: ['Original character design', 'Clear crisis situation', 'Show emotion and action'],
    completedBy: 67,
    rating: 4.9
  },
  {
    id: '7',
    title: 'Reverse Poem',
    description: 'Write a poem that reads as two different poems - one when read top to bottom, another when read bottom to top.',
    category: 'Poetry',
    difficulty: 'advanced',
    duration: 25,
    points: 175,
    tags: ['poetry', 'wordplay', 'experimental'],
    requirements: ['Minimum 8 lines', 'Both directions must make sense', 'Different meanings in each direction'],
    completedBy: 34,
    rating: 4.8
  },
  {
    id: '8',
    title: 'Minimalist Logo',
    description: 'Design a logo for an imaginary company using only 3 geometric shapes.',
    category: 'Design',
    difficulty: 'beginner',
    duration: 10,
    points: 50,
    tags: ['logo-design', 'minimalism', 'branding'],
    requirements: ['Maximum 3 shapes', 'Maximum 2 colors', 'Must be memorable and unique'],
    completedBy: 423,
    rating: 4.3
  },
  {
    id: '9',
    title: 'Stream of Consciousness',
    description: 'Write continuously for 5 minutes without stopping, editing, or planning. Let your thoughts flow freely.',
    category: 'Writing',
    difficulty: 'beginner',
    duration: 5,
    points: 40,
    tags: ['free-writing', 'experimental', 'mindfulness'],
    requirements: ['No stopping for 5 minutes', 'No editing allowed', 'Minimum 300 words'],
    completedBy: 567,
    rating: 4.2
  },
  {
    id: '10',
    title: 'Color Gradient Story',
    description: 'Create a visual story using only color gradients - no lines, shapes, or recognizable forms.',
    category: 'Visual Arts',
    difficulty: 'intermediate',
    duration: 20,
    points: 125,
    tags: ['abstract', 'color-theory', 'experimental'],
    requirements: ['Only color gradients allowed', 'Must tell a story or convey emotion', 'At least 5 distinct gradient transitions'],
    completedBy: 98,
    rating: 4.7
  }
];

export const achievements: Achievement[] = [
  {
    id: 'first-challenge',
    title: 'First Steps',
    description: 'Complete your first creative challenge',
    icon: '🎯',
    requirement: 'Complete 1 challenge'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 challenges under 5 minutes each',
    icon: '⚡',
    requirement: 'Complete 5 speed challenges'
  },
  {
    id: 'versatile',
    title: 'Renaissance Soul',
    description: 'Complete challenges in 5 different categories',
    icon: '🎨',
    requirement: 'Try 5 different categories'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieve maximum points in 3 challenges',
    icon: '⭐',
    requirement: 'Perfect score in 3 challenges'
  },
  {
    id: 'dedicated',
    title: 'Dedicated Creator',
    description: 'Complete challenges 7 days in a row',
    icon: '🔥',
    requirement: '7-day streak'
  }
];

export const categories = [
  { name: 'Writing', icon: '✍️', color: 'from-blue-500 to-purple-600' },
  { name: 'Visual Arts', icon: '🎨', color: 'from-pink-500 to-rose-600' },
  { name: 'Poetry', icon: '📝', color: 'from-green-500 to-teal-600' },
  { name: 'Music', icon: '🎵', color: 'from-yellow-500 to-orange-600' },
  { name: 'Photography', icon: '📸', color: 'from-indigo-500 to-blue-600' },
  { name: 'Design', icon: '🎯', color: 'from-purple-500 to-pink-600' }
];
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

interface CategoryVote {
  id: string
  category: string
  vote_count: number
}

interface UserVote {
  id: string
  category_id: string
  user_id: string
}

export default function CategoryVoting() {
  const [categories, setCategories] = useState<CategoryVote[]>([])
  const [userVotes, setUserVotes] = useState<UserVote[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('category_votes')
          .select('*')
          .order('vote_count', { ascending: false })

        setCategories(categoriesData || [])

        // Fetch user's votes
        const { data: votesData } = await supabase
          .from('user_category_votes')
          .select('*')
          .eq('user_id', user.id)

        setUserVotes(votesData || [])
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const handleVote = async (categoryId: string) => {
    if (!user) return

    setVoting(categoryId)
    try {
      // Check if user already voted for this category
      const existingVote = userVotes.find(vote => vote.category_id === categoryId)
      
      if (existingVote) {
        // Remove vote
        await supabase
          .from('user_category_votes')
          .delete()
          .eq('id', existingVote.id)

        // Decrease vote count
        await supabase
          .from('category_votes')
          .update({ vote_count: Math.max(0, categories.find(c => c.id === categoryId)?.vote_count || 0 - 1) })
          .eq('id', categoryId)

        setUserVotes(prev => prev.filter(vote => vote.id !== existingVote.id))
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, vote_count: Math.max(0, cat.vote_count - 1) }
            : cat
        ))
      } else {
        // Add vote
        const { data: newVote } = await supabase
          .from('user_category_votes')
          .insert([{ category_id: categoryId, user_id: user.id }])
          .select()
          .single()

        if (newVote) {
          // Increase vote count
          await supabase
            .from('category_votes')
            .update({ vote_count: (categories.find(c => c.id === categoryId)?.vote_count || 0) + 1 })
            .eq('id', categoryId)

          setUserVotes(prev => [...prev, newVote])
          setCategories(prev => prev.map(cat => 
            cat.id === categoryId 
              ? { ...cat, vote_count: cat.vote_count + 1 }
              : cat
          ))
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(null)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-4">
        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Vote for Next Contest Theme
        </span>
      </h3>
      <p className="text-white/60 mb-6">
        Help us decide what the next creative challenge should be! Your vote matters in shaping our community. <strong className="text-green-400">Voting is completely free!</strong>
      </p>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const hasVoted = userVotes.some(vote => vote.category_id === category.id)
          const isVoting = voting === category.id
          
          return (
            <div
              key={category.id}
              className="group relative bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(category.id)}
                    disabled={isVoting}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      hasVoted
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent'
                        : 'border-white/40 hover:border-white/80'
                    }`}
                  >
                    {isVoting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : hasVoted ? (
                      <span className="text-white text-sm">✓</span>
                    ) : null}
                  </button>
                  
                  <div>
                    <h4 className="text-white font-medium">{category.category}</h4>
                    <p className="text-white/60 text-sm">
                      {category.vote_count} {category.vote_count === 1 ? 'vote' : 'votes'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((category.vote_count / Math.max(...categories.map(c => c.vote_count), 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-white/60 text-sm w-8 text-right">
                    {Math.round((category.vote_count / Math.max(...categories.map(c => c.vote_count), 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🗳️</div>
          <p className="text-white/60">No categories available for voting yet.</p>
          <p className="text-white/40 text-sm">Check back soon for new contest themes!</p>
        </div>
      )}
    </div>
  )
}

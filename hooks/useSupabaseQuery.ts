'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { queryKeys } from '@/lib/react-query'
import type { PostgrestError } from '@supabase/supabase-js'

// Custom hook for user authentication state
export function useUser() {
  return useQuery({
    queryKey: queryKeys.user(),
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Custom hook for user profile data
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: async () => {
      if (!userId) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

// Custom hook for contests list
export function useContests(filters?: any) {
  return useQuery({
    queryKey: queryKeys.contestList(filters),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.active) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

// Custom hook for contest details
export function useContest(contestId: string) {
  return useQuery({
    queryKey: queryKeys.contest(contestId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          submissions (
            id,
            title,
            image_url,
            user_id,
            profiles (username, display_name)
          )
        `)
        .eq('id', contestId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!contestId,
  })
}

// Custom hook for user submissions
export function useUserSubmissions(userId?: string) {
  return useQuery({
    queryKey: queryKeys.userSubmissions(userId || ''),
    queryFn: async () => {
      if (!userId) return []
      const supabase = createClient()
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          contests (title, theme),
          votes (score, category)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

// Custom hook for gallery artwork
export function useGalleryArtwork(filters?: any) {
  return useQuery({
    queryKey: queryKeys.galleryArtwork(filters),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('submissions')
        .select(`
          *,
          profiles (username, display_name, avatar_url),
          contests (title, theme),
          likes:likes(count),
          comments:comments(count)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (filters?.contest_id) {
        query = query.eq('contest_id', filters.contest_id)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

// Mutation hook for liking submissions
export function useLikeSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ submissionId, userId }: { submissionId: string; userId: string }) => {
      const supabase = createClient()

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('user_id', userId)
        .single()

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('submission_id', submissionId)
          .eq('user_id', userId)

        if (error) throw error
        return { action: 'unliked' }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ submission_id: submissionId, user_id: userId })

        if (error) throw error
        return { action: 'liked' }
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.likes(variables.submissionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryArtwork() })
    },
  })
}

// Mutation hook for creating submissions
export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (submissionData: any) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('submissions')
        .insert(submissionData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.userSubmissions(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.contest(variables.contest_id) })
    },
  })
}

// Mutation hook for voting on submissions
export function useVoteSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (voteData: { submission_id: string; voter_id: string; category: string; score: number }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('votes')
        .upsert(voteData, { onConflict: 'submission_id,voter_id,category' })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.contestSubmissions(variables.submission_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.submission(variables.submission_id) })
    },
  })
}
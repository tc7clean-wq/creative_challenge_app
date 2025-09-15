// React Query configuration and utilities
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status?: number }).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Query keys factory
export const queryKeys = {
  all: ['artverse'] as const,
  submissions: () => [...queryKeys.all, 'submissions'] as const,
  submission: (id: string) => [...queryKeys.submissions(), id] as const,
  contests: () => [...queryKeys.all, 'contests'] as const,
  contest: (id: string) => [...queryKeys.contests(), id] as const,
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  votes: () => [...queryKeys.all, 'votes'] as const,
  comments: () => [...queryKeys.all, 'comments'] as const,
  leaderboard: () => [...queryKeys.all, 'leaderboard'] as const,
}

// Custom hooks for common queries
export function useSubmissions(options: { contestId?: string; limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: [...queryKeys.submissions(), options],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options.contestId) params.append('contestId', options.contestId)
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.offset) params.append('offset', options.offset.toString())
      
      const response = await fetch(`/api/submissions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch submissions')
      return response.json()
    },
  })
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: queryKeys.submission(id),
    queryFn: async () => {
      const response = await fetch(`/api/submissions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch submission')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useContests() {
  return useQuery({
    queryKey: queryKeys.contests(),
    queryFn: async () => {
      const response = await fetch('/api/contests')
      if (!response.ok) throw new Error('Failed to fetch contests')
      return response.json()
    },
  })
}

export function useContest(id: string) {
  return useQuery({
    queryKey: queryKeys.contest(id),
    queryFn: async () => {
      const response = await fetch(`/api/contests/${id}`)
      if (!response.ok) throw new Error('Failed to fetch contest')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useLeaderboard(contestId?: string) {
  return useQuery({
    queryKey: [...queryKeys.leaderboard(), contestId],
    queryFn: async () => {
      const params = contestId ? `?contestId=${contestId}` : ''
      const response = await fetch(`/api/leaderboard${params}`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      return response.json()
    },
  })
}

// Custom hooks for mutations
export function useVoteSubmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ submissionId, category }: { submissionId: string; category: string }) => {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, category }),
      })
      if (!response.ok) throw new Error('Failed to vote')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard() })
    },
  })
}

export function useLikeSubmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ submissionId }: { submissionId: string }) => {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      })
      if (!response.ok) throw new Error('Failed to like submission')
      return response.json()
    },
    onSuccess: (_, { submissionId }) => {
      // Invalidate specific submission and list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.submission(submissionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions() })
    },
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      image_url: string
      ai_model: string
      prompt: string
      contest_id?: string
    }) => {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create submission')
      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalidate submissions and contest queries
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions() })
      if (variables.contest_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.contest(variables.contest_id) })
      }
    },
  })
}

export function useCreateContest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      theme: string
      start_date: string
      end_date: string
      max_submissions?: number
      prize_pool?: number
    }) => {
      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create contest')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contests() })
    },
  })
}

// Provider component factory (for use in .tsx files)
export function createQueryProvider(React: unknown) {
  return function QueryProvider({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, [
      children,
      React.createElement(ReactQueryDevtools, { initialIsOpen: false })
    ])
  }
}

// Utility functions
export function prefetchSubmission(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.submission(id),
    queryFn: async () => {
      const response = await fetch(`/api/submissions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch submission')
      return response.json()
    },
  })
}

export function prefetchContest(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.contest(id),
    queryFn: async () => {
      const response = await fetch(`/api/contests/${id}`)
      if (!response.ok) throw new Error('Failed to fetch contest')
      return response.json()
    },
  })
}

// Error handling utilities
export function isQueryError(error: unknown): error is { message: string; status?: number } {
  return error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)
}

export function getErrorMessage(error: unknown): string {
  if (isQueryError(error)) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export { queryClient }
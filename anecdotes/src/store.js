
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    updateVote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, {...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
      }))
    },
    deleteAnecdote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      if (!anecdote || anecdote.votes !== 0) {
        return
      }
      await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(a => a.id !== id)}))
    }
  },
}))

let notificationTimeout


const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (message) => {
      clearTimeout(notificationTimeout)

      set({ notification: message })

      notificationTimeout = setTimeout(() => {
        set({ notification: null })
      }, 5000)
    },
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()))

  return [...filteredAnecdotes].sort((a,b) => b.votes - a.votes)
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state => state.actions))

export const useNotifications = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions )

export default useAnecdoteStore

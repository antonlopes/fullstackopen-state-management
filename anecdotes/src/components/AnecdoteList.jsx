import { useAnecdoteActions, useAnecdotes, useFilter, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes  = useAnecdotes()
  const { updateVote, deleteAnecdote } = useAnecdoteActions()
  const filter = useFilter()
  const { setNotification } = useNotificationActions()


  const anecdoteToShow = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  const sortedAnecdotes = anecdoteToShow.toSorted((a, b) => b.votes - a.votes);

  const handleVote = async (anecdote) => {
    await updateVote(anecdote.id)
    setNotification(`you voted '${anecdote.content}'`)
  }

  const handleRemove = async (anecdote) => {
    await deleteAnecdote(anecdote.id)
    setNotification(`you removed '${anecdote.content}'`)
  }


  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleRemove(anecdote)}>delete</button>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;

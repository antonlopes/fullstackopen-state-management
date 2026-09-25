import { useAnecdoteActions, useAnecdotes, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes  = useAnecdotes()
  const { updateVote, deleteAnecdote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()


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
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} data-testid="anecdote">
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

import { useAnecdoteActions, useNotificationActions } from '../store';

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleAddAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value
    await add(content)
    e.target.reset();

    setNotification(`you added '${content}'`)

  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div>
          <input data-testid="new" name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );


}

export default AnecdoteForm

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, renderHook, act, cleanup } from '@testing-library/react'
import AnecdoteList from './components/AnecdoteList'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import anecdoteService from './services/anecdotes';
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store';

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' });
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);
    const { result } = renderHook(() => useAnecdoteActions());
    await act(async () => {
      await result.current.initialize();
    });
    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toEqual(mockAnecdotes);
  });
});

describe('useAnecdotes', () => {
  const anecdotes = [
    {
      id: 1,
      content: 'Learning Zustand is interesting',
      votes: 3,
    },
    {
      id: 2,
      content: 'Testing makes applications more reliable',
      votes: 10,
    },
    {
      id: 3,
      content: 'React components should stay simple',
      votes: 1,
    },
    {
      id: 4,
      content: 'State management can simplify complex apps',
      votes: 7,
    },
  ];

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes, filter: '' });
  });

  it('returns anecdotes sorted by votes', () => {
    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toEqual([anecdotes[1], anecdotes[3], anecdotes[0], anecdotes[2]]);
  });

  it('displays anecdotes from the store sorted by votes', () => {
    const { getAllByTestId } = render(<AnecdoteList />);

    const renderedAnecdotes = getAllByTestId('anecdote');

    expect(renderedAnecdotes[0].textContent).toContain('Testing makes applications more reliable');

    expect(renderedAnecdotes[1].textContent).toContain(
      'State management can simplify complex apps'
    );

    expect(renderedAnecdotes[2].textContent).toContain('Learning Zustand is interesting');

    expect(renderedAnecdotes[3].textContent).toContain('React components should stay simple');
  });

  it('displays a properly filtered list of anecdotes', () => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: 'React',
    });

    const { getAllByTestId, container } = render(<AnecdoteList />);

    const renderedAnecdotes = getAllByTestId('anecdote');

    expect(renderedAnecdotes).toHaveLength(1);

    expect(renderedAnecdotes[0].textContent).toContain('React components should stay simple');

    expect(container.textContent).not.toContain('Learning Zustand is interesting');

    expect(container.textContent).not.toContain('Testing makes applications more reliable');

    expect(container.textContent).not.toContain('State management can simplify complex apps');
  });
});

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);
    const { result } = renderHook(() => useAnecdoteActions());
    await act(async () => {
      await result.current.initialize();
    });
    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toEqual(mockAnecdotes);
  });
});


describe('useAnecdoteActions', () => {
  it('voting increases the number of votes for an anecdote', async () => {
    const anecdote = {
      id: 1,
      content: 'Learning Zustand is interesting',
      votes: 3,
    };

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
    });

    anecdoteService.update.mockResolvedValue({
      ...anecdote,
      votes: 4,
    });

    const { result: actions } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await actions.current.updateVote(anecdote.id);
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());

    expect(anecdotesResult.current[0].votes).toBe(4);
  });
})

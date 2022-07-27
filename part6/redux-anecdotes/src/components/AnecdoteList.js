import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeAnecdotes, voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => [...state.anecdotes].filter(anec => anec.content.toLowerCase().includes(state.filter.toLowerCase())).sort((a, b) => b.votes - a.votes))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const vote = (id) => {
    // console.log('vote', id)
    dispatch(voteAnecdote(id))
    const anecdote = anecdotes.find(anec => anec.id === id)
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList

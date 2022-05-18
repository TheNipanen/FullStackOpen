import { useState } from 'react'

const Day = ({anecdotes, votes, selected}) => (
  <>
    <h1>Anecdote of the day</h1>
    {anecdotes[selected]}
    <div>has {votes[selected]} votes</div>
  </>
)

const Most = ({mostVotes, maxVotes}) => (
  <>
    <h1>Anecdote with most votes</h1>
    {mostVotes()}
    <div>has {maxVotes()} votes</div>
  </>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0])

  const l = anecdotes.length
  const generate = () => {
    setSelected(Math.floor(Math.random() * l))
  }
  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  const mostVotes = () => {
    let maxV = 0
    let best = anecdotes[0]
    for (let i = 0; i < l; i++) {
      if (votes[i] > maxV) {
        maxV = votes[i]
        best = anecdotes[i]
      }
    }
    return best
  }
  const maxVotes = () => {
    let maxV = 0
    for (let i = 0; i < l; i++) {
      if (votes[i] > maxV) {
        maxV = votes[i]
      }
    }
    return maxV
  }

  return (
    <div>
      <Day anecdotes={anecdotes} votes={votes} selected={selected} />
      <div>
        <button onClick={vote}>vote</button>
        <button onClick={generate}>next anecdote</button>
      </div>
      <Most mostVotes={mostVotes} maxVotes={maxVotes} />
    </div>
  )
}

export default App
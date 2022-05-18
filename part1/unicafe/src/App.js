import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)
const Buttons = ({increaseGood, increaseNeutral, increaseBad}) => (
  <>
    <Button handleClick={increaseGood} text='good' />
    <Button handleClick={increaseNeutral} text='neutral' />
    <Button handleClick={increaseBad} text='bad' />
  </>
)

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}{props.end}</td>
  </tr>
)
const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  const average = (good - bad) / all
  const positive = good / all * 100
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} end='' />
        <StatisticLine text='neutral' value={neutral} end='' />
        <StatisticLine text='bad' value={bad} end='' />
        <StatisticLine text='all' value={all} end='' />
        <StatisticLine text='average' value={average} end='' />
        <StatisticLine text='positive' value={positive} end=' %' />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Buttons increaseGood={increaseGood} increaseNeutral={increaseNeutral} increaseBad={increaseBad} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
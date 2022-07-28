import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BORN_TO } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [setBornTo] = useMutation(SET_BORN_TO, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const authors = result.loading ? [] : result.data.allAuthors

  useEffect(() => {
    if (!result.loading) {
      setName(authors[0].name)
    }
  }, [authors, result.loading])

  if (!props.show) {
    return null
  }

  const setYear = async (event) => {
    event.preventDefault()

    setBornTo({
      variables: { name, setBornTo: Number(born) },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={setYear}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((au, i) => (
              <option key={i} value={au.name}>
                {au.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors

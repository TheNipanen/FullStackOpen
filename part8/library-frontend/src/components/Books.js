import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_BOOKS_OF_GENRE } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  const result = useQuery(ALL_BOOKS)
  const genreResult = useQuery(ALL_BOOKS_OF_GENRE, {
    variables: { genre },
  })
  useEffect(() => {
    genreResult.refetch({ genre })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre])
  if (!props.show) {
    return null
  }

  const books = result.loading ? [] : result.data.allBooks
  const genreBooks = genreResult.loading ? [] : genreResult.data.allBooks
  const genres = books.flatMap((b) => b.genres)
  const uniqueGenres = genres.filter((g, i, self) => self.indexOf(g) === i)

  const filter = (filterGenre) => {
    setGenre(filterGenre)
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <strong>{genre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {(genre === 'all genres' ? books : genreBooks).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {uniqueGenres.map((g, i) => (
          <button key={i} onClick={() => filter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => filter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books

import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS_OF_GENRE, ME } from '../queries'

const Recommendations = (props) => {
  const [genre, setGenre] = useState('placeholder')
  const me = useQuery(ME)
  const bookResult = useQuery(ALL_BOOKS_OF_GENRE, {
    variables: { genre: 'placeholder' },
  })
  useEffect(() => {
    if (me.data?.me?.favoriteGenre) {
      const g = me.data.me.favoriteGenre
      bookResult.refetch({ genre: g })
      setGenre(g)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.data])
  useEffect(() => {
    me.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.token])
  if (!props.show) {
    return null
  }

  const books = bookResult.loading ? [] : bookResult.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{genre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => b.genres.includes(genre))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations

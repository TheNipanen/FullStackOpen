import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const CreateBlog = ({ callBack, closeForm, testCreate }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      dispatch(
        setNotification(
          {
            message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
            color: 'green',
          },
          3
        )
      )
      closeForm()
    } catch (exception) {
      dispatch(
        setNotification(
          { message: 'Error while creating blog', color: 'red' },
          3
        )
      )
    }
    callBack()
  }

  return (
    <>
      <h2>create new</h2>
      {/* Testing assignment wanted the callback function */}
      <form
        onSubmit={
          testCreate
            ? (event) => {
                event.preventDefault()
                testCreate({ title, author, url })
              }
            : handleCreateBlog
        }
      >
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create" type="submit">
          create
        </button>
        <button onClick={() => closeForm()}>cancel</button>
      </form>
    </>
  )
}

export default CreateBlog

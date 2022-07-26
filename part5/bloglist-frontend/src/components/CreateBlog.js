import { useState } from 'react'
import blogService from '../services/blogs'

const CreateBlog = ({ callBack, setNotification, closeForm, testCreate }) => {
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
      setNotification({ message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`, color: 'green' })
      setTimeout(() => setNotification({ message: null }), 3000)
      closeForm()
    } catch (exception) {
      setNotification({ message: 'Error while creating blog', color: 'red' })
      setTimeout(() => setNotification({ message: null }), 3000)
    }
    callBack()
  }

  return (
    <>
      <h2>create new</h2>
      {/* Testing assignment wanted the callback function */}
      <form onSubmit={testCreate ? (event) => {
        event.preventDefault()
        testCreate({title, author, url})
      } : handleCreateBlog}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
        <button onClick={() => closeForm()}>cancel</button>
      </form>
    </>
  )
}

export default CreateBlog

import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, callBack, setNotification, user, likeMock }) => {
  const [extended, setExtended] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const removeStyle = {
    backgroundColor: 'blue',
  }

  const like = async () => {
    const likedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      await blogService.update(likedBlog, blog.id)
    } catch (exception) {
      setNotification({ message: 'Error while updating blog', color: 'red' })
      setTimeout(() => setNotification({ message: null }), 3000)
    }
    callBack()
  }

  const remove = async () => {
    const confirmation = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (!confirmation) {
      return
    }

    try {
      await blogService.del(blog.id)
      setNotification({
        message: `Removed blog ${blog.title} by ${blog.author}`,
        color: 'green',
      })
      setTimeout(() => setNotification({ message: null }), 3000)
    } catch (exception) {
      setNotification({ message: 'Error while removing blog', color: 'red' })
      setTimeout(() => setNotification({ message: null }), 3000)
    }
    callBack()
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExtended(!extended)}>
          {extended ? 'hide' : 'view'}
        </button>
      </div>
      {extended && (
        <>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={likeMock ? likeMock : like}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && (
            <button onClick={remove} style={removeStyle}>
              remove
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog

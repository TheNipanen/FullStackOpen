import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const Blog = ({ blog, callBack, user, likeMock }) => {
  const dispatch = useDispatch()

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
      dispatch(
        setNotification(
          { message: 'Error while updating blog', color: 'red' },
          3
        )
      )
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
      dispatch(
        setNotification(
          {
            message: `Removed blog ${blog.title} by ${blog.author}`,
            color: 'green',
          },
          3
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          { message: 'Error while removing blog', color: 'red' },
          3
        )
      )
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

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { likeBlog, removeBlog, updateComments } from '../reducers/blogReducer'
import { Link, useNavigate } from 'react-router-dom'

const Blog = ({ blog, user, likeMock, extended }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

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

    dispatch(
      likeBlog(likedBlog, blog.id, () =>
        dispatch(
          setNotification(
            { message: 'Error while updating blog', color: 'red' },
            3
          )
        )
      )
    )
  }

  const remove = async () => {
    const confirmation = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (!confirmation) {
      return
    }

    navigate('../..')

    dispatch(
      removeBlog(blog.id, () =>
        dispatch(
          setNotification(
            { message: 'Error while removing blog', color: 'red' },
            3
          )
        )
      )
    )
    dispatch(
      setNotification(
        {
          message: `Removed blog ${blog.title} by ${blog.author}`,
          color: 'green',
        },
        3
      )
    )
  }

  const addComment = async () => {
    const comments = {
      comments: [...blog.comments, comment],
    }
    setComment('')
    dispatch(
      updateComments(blog.id, comments, () =>
        dispatch(
          setNotification(
            { message: 'Error while commenting', color: 'red' },
            3
          )
        )
      )
    )
  }

  return (
    <>
      {extended ? (
        <>
          <h2>
            {blog.title} {blog.author}
          </h2>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            {blog.likes}
            <button onClick={likeMock ? likeMock : like}>like</button>
          </div>
          <div>added by {blog.user.name}</div>
          <h3>comments</h3>
          <div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment}>add comment</button>
          </div>
          <ul>
            {blog.comments.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          {blog.user.username === user.username && (
            <button onClick={remove} style={removeStyle}>
              remove
            </button>
          )}
        </>
      ) : (
        <div className="blog" style={blogStyle}>
          <div>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Blog

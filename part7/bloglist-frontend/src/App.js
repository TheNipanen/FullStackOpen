import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [showCreateBlog, setShowCreateBlog] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('logging in with', username, password)

    try {
      const userData = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
      dispatch(
        setNotification(
          {
            message: `Logged in as ${userData.name}`,
            color: 'green',
          },
          3
        )
      )
    } catch (exception) {
      dispatch(
        setNotification({ message: 'wrong credentials', color: 'red' }, 3)
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    dispatch(setNotification({ message: 'Logged out', color: 'green' }, 3))
  }

  const fetchBlogs = useCallback(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
      // eslint-disable-next-line no-unused-vars
      .catch((error) => handleLogout())
  }, [])

  useEffect(() => {
    if (user) {
      fetchBlogs()
    }
  }, [user, fetchBlogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>
          {user.name} logged in<button onClick={handleLogout}>logout</button>
        </p>
      </div>
      {showCreateBlog ? (
        <CreateBlog
          callBack={fetchBlogs}
          closeForm={() => setShowCreateBlog(false)}
        />
      ) : (
        <button id="new" onClick={() => setShowCreateBlog(true)}>
          new blog
        </button>
      )}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} callBack={fetchBlogs} user={user} />
      ))}
    </div>
  )
}

export default App

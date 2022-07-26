import { useState, useEffect, useCallback } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({message: null})
  const [showCreateBlog, setShowCreateBlog] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('logging in with', username, password)

    try {
      const userData = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userData)
      ) 
      blogService.setToken(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
      setNotification({ message: `Logged in as ${userData.name}`, color: 'green' })
      setTimeout(() => setNotification({ message: null }), 3000)
    } catch (exception) {
      setNotification({ message: 'wrong credentials', color: 'red' })
      setTimeout(() => setNotification({ message: null }), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification({ message: 'Logged out', color: 'green' })
    setTimeout(() => setNotification({ message: null }), 3000)
  }

  const fetchBlogs = useCallback(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    ).catch(error =>
      handleLogout()
    )
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
        <Notification message={notification.message} color={notification.color} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} color={notification.color} />
      <div>
        <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
      </div>
      {showCreateBlog
        ? <CreateBlog callBack={fetchBlogs} setNotification={setNotification} closeForm={() => setShowCreateBlog(false)} />
        : <button onClick={() => setShowCreateBlog(true)}>new blog</button>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} callBack={fetchBlogs} setNotification={setNotification} user={user} />
      )}
    </div>
  )
}

export default App

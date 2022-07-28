import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import {
  Container,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div style={{ background: 'lightgrey' }}>
      <p>
        <Link to="/" style={padding}>
          blogs
        </Link>
        <Link to="/users" style={padding}>
          users
        </Link>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showCreateBlog, setShowCreateBlog] = useState(false)

  const [users, setUsers] = useState([])
  useEffect(() => {
    userService.getAll().then((fetchedUsers) => setUsers(fetchedUsers))
  }, [])

  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id) || null
    : null
  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id) || null
    : null
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('logging in with', username, password)
    navigate('/')

    try {
      const userData = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      dispatch(setUser(userData))
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
    dispatch(setUser(null))
    dispatch(setNotification({ message: 'Logged out', color: 'green' }, 3))
  }

  const fetchBlogs = useCallback(() => {
    dispatch(initializeBlogs(handleLogout))
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
      dispatch(setUser(userData))
      blogService.setToken(userData.token)
    }
  }, [])

  if (user === null) {
    return (
      <Container>
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
      </Container>
    )
  }
  return (
    <Container>
      <div>
        <Menu user={user} handleLogout={handleLogout} />
        <h2>blog app</h2>
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {showCreateBlog ? (
                  <CreateBlog closeForm={() => setShowCreateBlog(false)} />
                ) : (
                  <button id="new" onClick={() => setShowCreateBlog(true)}>
                    new blog
                  </button>
                )}
                {blogs.map((blog) => (
                  <Blog key={blog.id} blog={blog} user={user} />
                ))}
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <h2>Users</h2>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>blogs created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <Link to={`/users/${u.id}`}>{u.name}</Link>
                          </TableCell>
                          <TableCell>{u.blogs.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            }
          />
          <Route
            path="/users/:id"
            element={
              matchedUser && (
                <>
                  <h2>{matchedUser.name}</h2>
                  <h3>added blogs</h3>
                  <List disablePadding>
                    {matchedUser.blogs.map((b) => (
                      <ListItem key={b.id} divider>
                        {b.title}
                      </ListItem>
                    ))}
                  </List>
                </>
              )
            }
          />
          <Route
            path="/blogs/:id"
            element={
              matchedBlog && <Blog blog={matchedBlog} user={user} extended />
            }
          />
        </Routes>
      </div>
    </Container>
  )
}

export default App

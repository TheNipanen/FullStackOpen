import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const id = action.payload.id
      return state
        .map((blog) => (blog.id !== id ? blog : action.payload))
        .sort((a, b) => b.likes - a.likes)
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

const { appendBlog, setBlogs, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = (handleLogout) => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    } catch (error) {
      handleLogout()
    }
  }
}

export const createBlog = (blog, handleError) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(appendBlog(newBlog))
    } catch (error) {
      handleError()
    }
  }
}

export const likeBlog = (blog, id, handleError) => {
  return async (dispatch) => {
    try {
      const likedBlog = await blogService.update(blog, id)
      dispatch(updateBlog(likedBlog))
    } catch (error) {
      handleError()
    }
  }
}

export const removeBlog = (id, handleError) => {
  return async (dispatch) => {
    try {
      await blogService.del(id)
      dispatch(deleteBlog(id))
    } catch (error) {
      handleError()
    }
  }
}

export const updateComments = (id, comments, handleError) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.updateComments(comments, id)
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      handleError()
    }
  }
}

export default blogSlice.reducer

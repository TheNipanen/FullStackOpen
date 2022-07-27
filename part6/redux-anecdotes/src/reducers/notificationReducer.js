import { createSlice } from '@reduxjs/toolkit'

const initialState = ['', -1]

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set(state, action) {
      return [action.payload, state[1]]
    },
    clearPrev(state, action) {
      clearTimeout(state[1])
      return [state[0], action.payload]
    }
  }
})

const { set, clearPrev } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(set(message))
    const next = setTimeout(() => dispatch(set('')), seconds * 1000)
    dispatch(clearPrev(next))
  }
}

export default notificationSlice.reducer

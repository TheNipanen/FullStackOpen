import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set(state, action) {
      return action.payload
    }
  }
})

const { set } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(set(message))
    setTimeout(() => dispatch(set('')), seconds * 1000)
  }
}

export default notificationSlice.reducer

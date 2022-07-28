import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  color: null,
  prev: -1,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set(state, action) {
      return {
        ...action.payload,
        prev: state.prev,
      }
    },
    clearPrev(state, action) {
      clearTimeout(state.prev)
      return {
        ...state,
        prev: action.payload,
      }
    },
  },
})

const { set, clearPrev } = notificationSlice.actions

export const setNotification = (notification, seconds) => {
  return (dispatch) => {
    dispatch(set(notification))
    const next = setTimeout(
      () => dispatch(set({ message: null, color: null })),
      seconds * 1000
    )
    dispatch(clearPrev(next))
  }
}

export default notificationSlice.reducer

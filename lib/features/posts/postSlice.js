import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isPostLiked:false,
  totalLikes:0,
  totalComments:0,
  likes:[],
  comments:[],
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setIsPostLiked: (state, action) => {
      state.isPostLiked = action.payload
    },
    setTotalLikes: (state,action) => {
      state.totalLikes = action.payload
    },
    setTotalComments: (state,action) => {
      state.totalComments = action.payload
    },
    setLikes: (state, action) => {
      state.likes = action.payload
    },
    setComments: (state, action) => {
      state.comments = action.payload
    },
  },
})

export const { setIsPostLiked, setTotalLikes, setTotalComments, setLikes, setComments } = postSlice.actions

export default postSlice.reducer
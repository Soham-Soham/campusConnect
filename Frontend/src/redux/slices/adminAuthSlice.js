// 1. Redux Slice: adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
  },
  reducers: {
    setAdmin: (state,action)=>{
      state.admin = action.payload
    },
    logoutAdmin: (state) => {
      state.admin = null;
    },
  }
});

export const {setAdmin, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;






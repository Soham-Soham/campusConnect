import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminAuthReducer from './slices/adminAuthSlice';

const store = configureStore({
    reducer:{
        auth: authReducer,
        adminAuth: adminAuthReducer
    },
})

export default store;
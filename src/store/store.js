import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';
import callerIdsReducer from './callerIdsSlice';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        toast: toastReducer,
        callerId: callerIdsReducer,
        user: userReducer
    }
});

export default store;
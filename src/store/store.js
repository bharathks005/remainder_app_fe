import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';
import callerIdsReducer from './callerIdsSlice';
import userReducer from './userSlice';
import scheduleCallReducer from './scheduleCallSlice';

const store = configureStore({
    reducer: {
        toast: toastReducer,
        callerId: callerIdsReducer,
        user: userReducer,
        scheduleCall: scheduleCallReducer
    }
});

export default store;
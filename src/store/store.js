import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';
import callerIdsReducer from './callerIdsSlice';
import userReducer from './userSlice';
import scheduleCallReducer from './scheduleCallSlice';
import EnumSliceReducer from './enumSlice';

const store = configureStore({
    reducer: {
        toast: toastReducer,
        callerId: callerIdsReducer,
        user: userReducer,
        scheduleCall: scheduleCallReducer,
        enum: EnumSliceReducer
    }
});

export default store;
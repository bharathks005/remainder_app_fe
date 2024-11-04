import { createSlice } from '@reduxjs/toolkit';

const callerIdsSlice = createSlice({
    name: 'callerId',
    initialState: {
        callerIds: [],
        scheduledData: {},
        createCallerIdsStatus: {}
    },
    reducers: {
        addCallerId: (state, action) => {
            state.callerIds = [...action.payload];
        },
        removeCallerId: (state, action) => {
            return {
                ...state,
                callerIds: state.callerIds.filter((item) => !action.payload.includes(item.sid)),
            };
        },
        updateScheduleData: (state, action) => {
            const { upCommingSchedule, pastSchedule } = action.payload;
            state.scheduledData = { upCommingSchedule, pastSchedule };
        },
        deleteScheduleData: (state, action) => {
            const { id } = action.payload;
            state.scheduledData.upCommingSchedule = state.scheduledData.upCommingSchedule.filter((item) => item.scheduleName === id);
        },
        updateCallerIdsStatus: (state, action) => {
            const { status, type, data } = action.payload;
            state.createCallerIdsStatus = { status, type, data };
        },
        resetCreateCallerIdsStatus: (state, action) => {
            state.createCallerIdsStatus = {};
        },

    }
});

export const { addCallerId, removeCallerId, updateScheduleData, deleteScheduleData, updateCallerIdsStatus, resetCreateCallerIdsStatus } = callerIdsSlice.actions;
export default callerIdsSlice.reducer;
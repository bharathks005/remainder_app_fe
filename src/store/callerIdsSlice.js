import { createSlice } from '@reduxjs/toolkit';

const callerIdsSlice = createSlice({
    name: 'callerId',
    initialState: {
        callerIds: [],
        scheduledData: {}
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

    }
});

export const { addCallerId, removeCallerId, updateScheduleData, deleteScheduleData } = callerIdsSlice.actions;
export default callerIdsSlice.reducer;
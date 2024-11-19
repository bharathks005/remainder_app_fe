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
            const { upCommingSchedule = [], pastSchedule = []} = action.payload;
            const newUpCommingSchedule = upCommingSchedule.map((item) => {               
                return {
                    ...item,
                    date: new Date(item.date).toLocaleDateString('en-IN', {
                    weekday: 'short', // Mon
                    year: 'numeric',  // 2024
                    month: 'long',    // November
                    day: 'numeric',   // 19
                    hour: 'numeric',   // "1"
                    minute: 'numeric', // "45"
                    second: 'numeric', // "00"
                    hour12: true
                }),
                }
            });
            const newPastSchedule = pastSchedule.map((item) => {               
                return {
                    ...item,
                    date: new Date(item.date).toLocaleDateString('en-IN', {
                    weekday: 'short', // Mon
                    year: 'numeric',  // 2024
                    month: 'long',    // November
                    day: 'numeric',   // 19
                    hour: 'numeric',   // "1"
                    minute: 'numeric', // "45"
                    second: 'numeric', // "00"
                    hour12: true
                }),
                }
            });
            state.scheduledData = { upCommingSchedule: newUpCommingSchedule, pastSchedule: newPastSchedule };
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
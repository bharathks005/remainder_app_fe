import { createSlice } from '@reduxjs/toolkit';

const scheduleCallSlice = createSlice({
    name: 'scheduleCall',
    initialState: {
        upCommingSchedule: [],
        pastSchedule: [],
        deletedCallerIds: {},        
    },
    reducers: {
        updateScheduleData: (state, action) => {
            const { upCommingSchedule = [], pastSchedule = [] } = action.payload;
            state.upCommingSchedule = {
                upCommingSchedule: upCommingSchedule.map((item) => {
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
                })
            };
            state.pastSchedule = {
                pastSchedule: pastSchedule.map((item) => {
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
                })
            };
        },
        deleteScheduleData: (state, action) => {
            const id = action.payload;
            state.upCommingSchedule = state.scheduledData.upCommingSchedule.filter((item) => item.schedulerName !== id);
        },
        addDeletedCallerIds: (state, action) => {
            const { _id, displayName } = action.payload;
            const callerIds = {...state.deletedCallerIds};            
            callerIds[_id] = displayName;
            state.deletedCallerIds = {
                ...callerIds
            };           
        },
        removeDeletedCallerIds: (state, action) => {
            const { _id } = action.payload;
            const callerIds = {...state.deletedCallerIds};
            delete callerIds[_id];
            state.deletedCallerIds = {
                ...callerIds
            };
        },
        resetDeletedCallerIds: (state, action) => {
            state.deletedCallerIds = {};
        },
    }
});

export const { updateScheduleData, deleteScheduleData, addDeletedCallerIds, resetDeletedCallerIds, removeDeletedCallerIds} = scheduleCallSlice.actions;
export default scheduleCallSlice.reducer;
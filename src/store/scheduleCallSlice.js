import { createSlice } from '@reduxjs/toolkit';

const scheduleCallSlice = createSlice({
    name: 'scheduleCall',
    initialState: {
        upCommingSchedule: [],
        pastSchedule: [],
        deletedCallerIds: {}
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
            const { sid, displayName } = action.payload;
            const callerIds = {...state.deletedCallerIds};            
            callerIds[sid] = displayName;
            state.deletedCallerIds = {
                ...callerIds
            };
            console.log(state.deletedCallerIds, 'state.deletedCallerIds')
        },
        removeDeletedCallerIds: (state, action) => {
            const { sid } = action.payload;
            const callerIds = {...state.deletedCallerIds};
            delete callerIds[sid];
            state.deletedCallerIds = {
                ...callerIds
            };
        },
    }
});

export const { updateScheduleData, deleteScheduleData, addDeletedCallerIds, removeDeletedCallerIds} = scheduleCallSlice.actions;
export default scheduleCallSlice.reducer;
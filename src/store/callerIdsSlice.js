import { createSlice } from '@reduxjs/toolkit';

const callerIdsSlice = createSlice({
    name: 'callerId',
    initialState: {
        callerIds: {
            page: 0,
            limit: 10,
            totalPages: 0,
            totalRecords: 0,
            results: []
        },
        scheduledData: {},
        createCallerIdsStatus: {}
    },
    reducers: {
        addCallerId: (state, action) => {
            state.callerIds = {...action.payload};
        },
        removeCallerId: (state, action) => {
            const oldData = state.callerIds;
            const newData = oldData.results.filter((item) => !action.payload.includes(item.sid));
            return {
                ...state,
                callerIds: {
                    ...oldData,
                    results: [...newData],
                },
            };
        },
        updateCallerIdsStatus: (state, action) => {
            const { status, type, message } = action.payload;
            state.createCallerIdsStatus = { status, type, message };
        },
        resetCreateCallerIdsStatus: (state, action) => {
            state.createCallerIdsStatus = {};
        }
    }
});

export const { addCallerId, removeCallerId, updateCallerIdsStatus, resetCreateCallerIdsStatus } = callerIdsSlice.actions;
export default callerIdsSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const callerIdsSlice = createSlice({
    name: 'callerId',
    initialState: {
        callerIds: {
            page: 0,
            totalPages: 0,
            totalRecords: 0,
            results: []
        },
        scheduledData: {},
        createCallerIdsStatus: {}
    },
    reducers: {
        setCallerIds: (state, action) => {
            state.callerIds = { ...action.payload };
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
        },
        updateCallerIdsData: (state, action) => {
            const { _id, ...updatedFields } = action.payload;
            const results = state.callerIds?.results;
            if (!results) return;
            const index = results.findIndex(item => item?._id === _id);
            if (index !== -1) {
                // Merge existing object with updated fields
                results[index] = {
                    ...results[index],
                    ...updatedFields
                };
                // If needed to trigger immutability (e.g., in Redux Toolkit)
                state.callerIds.results = [...results];
                console.log(updatedFields, results[index], index);
            }
        }
    }
});

export const { setCallerIds, removeCallerId, updateCallerIdsStatus, resetCreateCallerIdsStatus, updateCallerIdsData } = callerIdsSlice.actions;
export default callerIdsSlice.reducer;
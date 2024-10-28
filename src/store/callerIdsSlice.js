import { createSlice } from '@reduxjs/toolkit';

const callerIdsSlice = createSlice({
    name: 'callerId',
    initialState: {
        callerIds: []
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
        }
    }
});

export const { addCallerId, removeCallerId } = callerIdsSlice.actions;
export default callerIdsSlice.reducer;
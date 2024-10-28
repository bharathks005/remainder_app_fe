import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        updateUser: (state, action) => {
            state.user = {
                ...action.payload
            };
        },
        removeUser: (state, action) => {
            state.user = null;
        }
    }
});

export const { updateUser, removeUser } = UserSlice.actions;
export default UserSlice.reducer;
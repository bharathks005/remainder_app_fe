import { createSlice } from '@reduxjs/toolkit';

const EnumSlice = createSlice({
    name: 'enum',
    initialState: {
        areas: []
    },
    reducers: {
        updateEnums: (state, action) => {
            state.areas = [
                ...action.payload
            ];
        }        
    }
});

export const { updateEnums } = EnumSlice.actions;
export default EnumSlice.reducer;
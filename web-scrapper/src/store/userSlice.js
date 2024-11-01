import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        url: '',
        responses: [],
    },
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setResponses: (state, action) => {
            state.responses = action.payload;
        },
    },
});

export const { setUrl, setResponses } = userSlice.actions;
export default userSlice.reducer;
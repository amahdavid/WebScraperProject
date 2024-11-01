import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk('user/fetchData', async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        url: '',
        responses: [],
        loading: false,
        error: null,
    },
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setResponses: (state, action) => {
            state.responses = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.loading = false;
                state.responses = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setUrl, setResponses } = userSlice.actions;
export default userSlice.reducer;

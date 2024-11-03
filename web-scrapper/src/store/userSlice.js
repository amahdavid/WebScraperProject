import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Adjust fetchData to call the scrape endpoint
export const fetchData = createAsyncThunk('user/fetchData', async (url) => {
    const response = await fetch('http://127.0.0.1:5000/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });
    
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

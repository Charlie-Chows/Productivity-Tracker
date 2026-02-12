
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers",
    async () => {
        const res = await fetch("https://dummyjson.com/users");
        return res.json();
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
        })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to fetch users";
            })
    }
})

export default userSlice.reducer;
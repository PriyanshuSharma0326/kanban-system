import { createSlice } from "@reduxjs/toolkit";

export const ROUTES = {
    BOARD:     "board",
    DASHBOARD: "dashboard",
    SEARCH:    "search",
    SETTINGS:  "settings",
};

const navSlice = createSlice({
    name: "nav",
    initialState: {
        current: ROUTES.BOARD,
    },
    reducers: {
        navigate: (state, action) => {
            state.current = action.payload;
        },
    },
});

export const { navigate } = navSlice.actions;
export default navSlice.reducer;

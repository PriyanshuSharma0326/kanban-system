import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/board/boardSlice";
import navReducer   from "../features/nav/navSlice";
import authReducer  from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        board: boardReducer,
        nav:   navReducer,
        auth:  authReducer,
    },
});

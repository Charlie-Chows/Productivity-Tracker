
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './slices/counterSlice'
import todoReducer from './slices/todoSlice';
import usersReducer from './slices/userSkice';

export const store = configureStore({
    reducer : {
        counter : counterReducer,
        todo : todoReducer,
        users : usersReducer,
    }
})
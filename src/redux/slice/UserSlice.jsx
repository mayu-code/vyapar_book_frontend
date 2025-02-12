import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
    },
    deleteUser(state, action) {
      state.user = "";
    },
  },
});

export const { addUser, deleteUser } = userReducer.actions;

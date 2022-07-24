import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface State {
  name: null | string;
  email: null | string;
  profileURL: null | string;
  department: null | string;
}

const initialState: State = {
  name: null,
  email: null,
  profileURL: null,
  department: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<State>) => {
      return action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

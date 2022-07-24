import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface State {
  name: null | string;
  email: null | string;
  profileURL: null | string;
  department: null | string;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: null,
    email: null,
    profileURL: null,
    department: null,
  } as State,
  reducers: {
    login: (state, action: PayloadAction<State>) => {
      state = action.payload;
    },
    logout: (state) => {
      state = {
        name: null,
        email: null,
        profileURL: null,
        department: null,
      };
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

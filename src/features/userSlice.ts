import { createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addNotifications: (state: any, { payload }) => {
      if (state.newMessages[payload]) {
        state.newMessages[payload] = state.newMessages[payload] + 1;
      } else {
        state.newMessages[payload] = 1;
      }
    },
    resetNotifications: (state: any, { payload }) => {
      delete state.newMessages[payload];
    },
  },

  extraReducers: (builder) => {
    // save user after signup
    builder.addMatcher(
      api.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // save user after login
    builder.addMatcher(
      api.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // logout: destroy user session
    builder.addMatcher(api.endpoints.logoutUser.matchFulfilled, () => null);
  },
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;

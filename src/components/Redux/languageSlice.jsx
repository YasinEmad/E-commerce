import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "English",
};

const languageSlice = createSlice({
  name: "English",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;

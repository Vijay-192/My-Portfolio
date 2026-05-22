// redux-store/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  return saved ? JSON.parse(saved) : false;
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialDarkMode(),
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
      // DOM update ThemeProvider handle karega
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
      // DOM update ThemeProvider handle karega
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
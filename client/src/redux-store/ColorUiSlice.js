// store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialSidebarState = () => {
  const saved = localStorage.getItem('sidebarOpen');
  return saved ? JSON.parse(saved) : true;
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: getInitialSidebarState(),
    isMobile: window.innerWidth < 768,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem('sidebarOpen', JSON.stringify(state.sidebarOpen));
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
      localStorage.setItem('sidebarOpen', JSON.stringify(state.sidebarOpen));
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setIsMobile } = uiSlice.actions;
export default uiSlice.reducer;
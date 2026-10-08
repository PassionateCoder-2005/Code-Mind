import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeFile: "App.jsx",
  openFiles: [],
  files: {
  "App.jsx": {
    content: `function App() {
  return <h1>Hello AI Web IDE</h1>;
}`
  }
},
  isDirty: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,

  reducers: {
    setActiveFile: (state, action) => {
      state.activeFile = action.payload;
    },

    updateFileContent: (state, action) => {
      const { path, content } = action.payload;

      if (state.files[path]) {
        state.files[path].content = content;
        state.isDirty = true;
      }
    },

    openFile: (state, action) => {
      const file = action.payload;

      if (!state.openFiles.some(f => f.path === file.path)) {
        state.openFiles.push(file);
      }

      state.activeFile = file.path;
    },

    closeFile: (state, action) => {
      const path = action.payload;

      state.openFiles = state.openFiles.filter(
        file => file.path !== path
      );

      if (state.activeFile === path) {
        state.activeFile =
          state.openFiles.length > 0
            ? state.openFiles[state.openFiles.length - 1].path
            : null;
      }
    },
  },
});

export const {
  setActiveFile,
  updateFileContent,
  openFile,
  closeFile,
} = editorSlice.actions;

export default editorSlice.reducer;
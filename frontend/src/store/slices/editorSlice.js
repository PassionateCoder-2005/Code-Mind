import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  activeFile: "App.jsx",
  openFiles: [
    {
      path: "App.jsx",
    },
    {
      path: "Test.jsx",
    }
  ],
  files: {
    "App.jsx": {
      content: `function App() {
  return <h1>HELLO FROM APP</h1>;
}`,
      isDirty: false,
    },
    "Test.jsx": {
      content: `function Test() {
  return <h1>HELLO FROM TEST</h1>;
}`,
      isDirty: false,
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
        state.files[path].isDirty = true; 
        
        // state.isDirty = true;
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
  saveFile: (state, action) => {
  const path = action.payload;

  if (state.files[path]) {
    state.files[path].isDirty = false;
  }

  state.isDirty = Object.values(state.files).some(
    file => file.type !== 'folder' && file.isDirty
  );
},
    createFile: (state, action) => {
  const { path, content } = action.payload;

  if (!state.files[path]) {
    state.files[path] = { content };
    state.openFiles.push({ path });
    state.isDirty = true;
  }
},
    createFolder: (state, action) => {
      const path = typeof action.payload === 'string' ? action.payload : action.payload?.path;
      if (!path) return;
      if (!state.files[path]) {
        state.files[path] = { type: 'folder' };
        state.isDirty = true;
      }
    },
    deleteFile: (state, action) => {
      const path = typeof action.payload === 'string' ? action.payload : action.payload?.path;
      if (!path) return;
      if (state.files[path]) {
        delete state.files[path];
        state.openFiles = state.openFiles.filter(
          file => (typeof file === 'string' ? file : file?.path) !== path
        );
        if (state.activeFile === path) {
          state.activeFile =
            state.openFiles.length > 0
              ? (typeof state.openFiles[state.openFiles.length - 1] === 'string'
                  ? state.openFiles[state.openFiles.length - 1]
                  : state.openFiles[state.openFiles.length - 1]?.path)
              : null;
        }
        state.isDirty = true;
      }
    },
    deleteFolder: (state, action) => {
      const path = typeof action.payload === 'string' ? action.payload : action.payload?.path;
      if (!path) return;
      if (state.files[path]) {
        delete state.files[path];
        // Also remove any nested files or folders inside this folder
        Object.keys(state.files).forEach((filePath) => {
          if (filePath.startsWith(`${path}/`)) {
            delete state.files[filePath];
          }
        });
        state.openFiles = state.openFiles.filter(
          file => {
            const fPath = typeof file === 'string' ? file : file?.path;
            return fPath !== path && !fPath?.startsWith(`${path}/`);
          }
        );
        if (state.activeFile === path || state.activeFile?.startsWith(`${path}/`)) {
          state.activeFile =
            state.openFiles.length > 0
              ? (typeof state.openFiles[state.openFiles.length - 1] === 'string'
                  ? state.openFiles[state.openFiles.length - 1]
                  : state.openFiles[state.openFiles.length - 1]?.path)
              : null;
        }
        state.isDirty = true;
      }
    },
    renameFile: (state, action) => {
      const { oldPath, newPath } = action.payload;
      if (state.files[oldPath] && !state.files[newPath]) {
        state.files[newPath] = state.files[oldPath];
        delete state.files[oldPath];
        const newFileName = newPath.split('/').pop() || newPath;
        state.openFiles = state.openFiles.map((file) => {
          const fPath = typeof file === 'string' ? file : file?.path;
          if (fPath === oldPath) {
            return typeof file === 'string'
              ? newPath
              : { ...file, path: newPath, ...(file.name ? { name: newFileName } : {}) };
          }
          return file;
        });
        if (state.activeFile === oldPath) {
          state.activeFile = newPath;
        }
        state.isDirty = true;
      }
    },
    renameFolder: (state, action) => {
      const { oldPath, newPath } = action.payload;
      if (state.files[oldPath] && !state.files[newPath]) {
        state.files[newPath] = state.files[oldPath];
        delete state.files[oldPath];

        // Also update nested files and folders
        Object.keys(state.files).forEach((filePath) => {
          if (filePath.startsWith(`${oldPath}/`)) {
            const updatedPath = `${newPath}${filePath.slice(oldPath.length)}`;
            state.files[updatedPath] = state.files[filePath];
            delete state.files[filePath];
          }
        });

        state.openFiles = state.openFiles.map((file) => {
          const fPath = typeof file === 'string' ? file : file?.path;
          if (fPath === oldPath) {
            const newName = newPath.split('/').pop() || newPath;
            return typeof file === 'string'
              ? newPath
              : { ...file, path: newPath, ...(file.name ? { name: newName } : {}) };
          }
          if (fPath?.startsWith(`${oldPath}/`)) {
            const updatedPath = `${newPath}${fPath.slice(oldPath.length)}`;
            const updatedName = updatedPath.split('/').pop() || updatedPath;
            return typeof file === 'string'
              ? updatedPath
              : { ...file, path: updatedPath, ...(file.name ? { name: updatedName } : {}) };
          }
          return file;
        });

        if (state.activeFile === oldPath) {
          state.activeFile = newPath;
        } else if (state.activeFile?.startsWith(`${oldPath}/`)) {
          state.activeFile = `${newPath}${state.activeFile.slice(oldPath.length)}`;
        }
        state.isDirty = true;
      }
    }
  },
});

export const {
  setActiveFile,
  updateFileContent,
  openFile,
  closeFile,
  saveFile,
  createFile,
  createFolder,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder
} = editorSlice.actions;

export default editorSlice.reducer;
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFileContent } from '../../store/slices/editorSlice';
import EditorTab from './EditorTab';

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  // Define a custom theme for the editor
  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#020618',
      },
    });

    monaco.editor.setTheme('my-theme');
  };

  // Get the language of the file
  const getLanguage = (fileName) => {
    const extension = fileName?.split('.').pop();
    if (extension === 'jsx' || extension === 'tsx') {
      return 'javascript';
    }
    if (extension === 'py') {
      return 'python';
    }
    if (extension === 'html') {
      return 'html';
    }
    if (extension === 'css') {
      return 'css';
    }
    if (extension === 'js' || extension === 'mjs') {
      return 'javascript';
    }
    if (extension === 'json') {
      return 'json';
    }
    if (extension === 'md' || extension === 'txt') {
      return 'markdown';
    }
    return 'plaintext';
  };

  const activeFile = useSelector((state) => state.editor.activeFile);
  const openFiles = useSelector((state) => state.editor.openFiles);
  const files = useSelector((state) => state.editor.files);

  const handleChangingCode = (newCode) => {
    if (!activeFile) return;
    dispatch(updateFileContent({
      path: activeFile,
      content: newCode,
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#020618] overflow-hidden">
      {/* Editor Tabs */}
      <EditorTab />

      {/* Editor Content Area */}
      <div className="flex-1 min-h-0 relative">
        {activeFile && files[activeFile] ? (
          <Editor
            key={activeFile}
            onChange={(e) => handleChangingCode(e)}
            height="100%"
            defaultLanguage={getLanguage(activeFile)}
            theme="my-theme"
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
              },
              fontSize: 14,
            }}
            value={files[activeFile]?.content ?? ''}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 select-none">
            <p className="text-sm">No file is open</p>
            <p className="text-xs text-slate-600">Select a file from the explorer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
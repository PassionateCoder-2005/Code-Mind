import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
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

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
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
      defaultValue="// write your code here"
    />
  );
};

export default CodeEditor;
import React from 'react'
import Editor from '@monaco-editor/react';
const CodeEditor = () => {
  return (
    <Editor
        height="100%"
        defaultLanguage="javascript"
        theme='vs-dark'
        options={{
          minimap: { enabled: false },
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
          fontSize: 14,
          
        }}
        defaultValue="// write your code here"
      />
  )
}

export default CodeEditor
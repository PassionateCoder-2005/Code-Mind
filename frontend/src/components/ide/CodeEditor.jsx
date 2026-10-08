import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector , useDispatch} from 'react-redux';
import { updateFileContent } from '../../store/slices/editorSlice';
const CodeEditor = () => {
  const [code,setCode]=useState("");
  const dispatch=useDispatch();
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
  const getLanguage=(fileName)=>{
    const extension = fileName?.split('.').pop();
    if(extension==='jsx'||extension==='tsx'){
      return 'javascript'
    }
    if(extension==='py'){
      return 'python'
    }
    if(extension==='html'){
      return 'html'
    }
    if(extension==='css'){
      return 'css'
    }
    if(extension==='js'||extension==='mjs'){
      return 'javascript'
    }
    if(extension==='json'){
      return 'json'
    }
    if(extension==='md'||extension==='txt'){
      return 'markdown'
    }
    return 'plaintext'
  }
  const activeFile=useSelector((state)=>state.editor.activeFile)
  const openFiles=useSelector((state)=>state.editor.openFiles)
  const files=useSelector((state)=>state.editor.files)
  const handleChangingCode=(code)=>{
     dispatch(updateFileContent({
      path:activeFile,
      content:code
     }))
     
  }
 
  
  console.log(getLanguage(activeFile));
  console.log(openFiles);
  
  return (
    <Editor
      onChange={(e)=>{
       return handleChangingCode(e)
      }}
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
      defaultValue={files[activeFile].content}
    />
  );
};

export default CodeEditor;
import React from 'react'
import CodeEditor from './CodeEditor';

const IDELayout = () => {
  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Header */}
      <header className="h-12 border-b border-slate-800 flex items-center px-4">
        <div className="font-semibold">AI Web IDE</div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 min-h-0">

        {/* Explorer */}
        <aside className="w-60 border-r border-slate-800">
          Explorer
        </aside>

        {/* Editor */}
        <main className="flex-1 min-w-0">
        <CodeEditor/>
        </main>

        {/* AI Assistant */}
        <aside className="w-80 border-l border-slate-800">
          AI Assistant
        </aside>

      </div>

      {/* Terminal */}
      <div className="h-48 border-t border-slate-800">
        Terminal
      </div>

    </div>
  );
}


export default IDELayout
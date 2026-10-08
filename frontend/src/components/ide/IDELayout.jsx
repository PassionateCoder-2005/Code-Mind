import CodeEditor from './CodeEditor';
import FileExplorer from './FileExplorer';
import AiAssistant from './AiAssistant';
import Terminal from './Terminal';
import SaveButton from './SaveButton';

const IDELayout = () => {
  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">

      {/* Header */}
      <header className="h-12 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="font-semibold text-lg">Code Mind</div>
        <SaveButton />
      </header>
      {/* Main Workspace */}
      <div className="flex flex-1 min-h-0">

        {/* Explorer */}
        <aside className="w-60 border-r border-slate-800 flex flex-col overflow-hidden">
          <FileExplorer />
        </aside>

        {/* Editor */}
        <main className="flex-1 min-w-0">
          <CodeEditor />
        </main>

        {/* AI Assistant */}
        <aside className="w-80 border-l border-slate-800 flex flex-col overflow-hidden">
          <AiAssistant />
        </aside>

      </div>

      {/* Terminal */}
      <div className="h-56 border-t border-slate-800 flex flex-col overflow-hidden">
        <Terminal />
      </div>

    </div>
  );
}


export default IDELayout
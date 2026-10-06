import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  AlertCircle,
  FileText,
  CornerDownLeft,
} from 'lucide-react';

const Terminal = () => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState([
    { id: 1, type: 'command', text: 'npm run dev' },
    { id: 2, type: 'system', text: '> frontend@0.0.0 dev' },
    { id: 3, type: 'system', text: '> vite' },
    { id: 4, type: 'success', text: 'Server started successfully' },
    { id: 5, type: 'info', text: '➜  Local:   http://localhost:5173/' },
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (e) => {
    e?.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd) return;

    if (cmd === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    // Append to local state (ready to hook into Docker Sandbox backend)
    setHistory((prev) => [
      ...prev,
      { id: Date.now(), type: 'command', text: cmd },
      // Placeholder response until connected to real execution environment
      {
        id: Date.now() + 1,
        type: 'system',
        text: `[Sandbox preview] Command '${cmd}' received. Execution environment ready.`,
      },
    ]);
    setInputCommand('');
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-300 font-mono text-xs select-none">
      {/* Header & Tabs */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <TerminalIcon size={14} className="text-cyan-400" />
            <span>Terminal</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>Terminal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('problems')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'problems'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <AlertCircle size={12} />
              <span>Problems</span>
              <span className="px-1 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-400">
                0
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('output')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'output'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText size={12} />
              <span>Output</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 font-sans">
          <button
            type="button"
            onClick={handleClear}
            title="Clear Terminal"
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed select-text space-y-1">
        {activeTab === 'terminal' && (
          <>
            {history.map((item) => {
              if (item.type === 'command') {
                return (
                  <div key={item.id} className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="font-semibold text-white">{item.text}</span>
                  </div>
                );
              }
              if (item.type === 'success') {
                return (
                  <div key={item.id} className="text-emerald-400 font-medium pl-4">
                    {item.text}
                  </div>
                );
              }
              if (item.type === 'info') {
                return (
                  <div key={item.id} className="text-cyan-400/90 pl-4">
                    {item.text}
                  </div>
                );
              }
              return (
                <div key={item.id} className="text-slate-400 pl-4">
                  {item.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </>
        )}

        {activeTab === 'problems' && (
          <div className="text-slate-500 font-sans p-4 text-center">
            No problems detected in the workspace.
          </div>
        )}

        {activeTab === 'output' && (
          <div className="text-slate-500 font-mono p-2">
            [Tasks &amp; build output will appear here]
          </div>
        )}
      </div>

      {/* Bottom Command Input / Prompt Area */}
      <div className="p-2 border-t border-slate-800 bg-slate-900/50">
        <form onSubmit={handleRunCommand} className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-800 focus-within:border-cyan-500/70 rounded-lg px-2.5 py-1.5 transition-colors">
            <span className="text-emerald-400 font-bold select-none">$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Type a command (e.g. npm run dev, ls, clear)..."
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-600 text-xs font-mono outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sans font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span>Run</span>
            <Play size={11} className="fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Terminal;
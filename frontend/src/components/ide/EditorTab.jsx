import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFile, closeFile } from '../../store/slices/editorSlice';
import {
  FileCode,
  FileBraces,
  FileText,
  File,
  X,
} from 'lucide-react';

const getFileIcon = (filename = '') => {
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
    return <FileCode size={14} className="text-cyan-400 shrink-0" />;
  }
  if (filename.endsWith('.js') || filename.endsWith('.mjs')) {
    return <FileCode size={14} className="text-yellow-400 shrink-0" />;
  }
  if (filename.endsWith('.html')) {
    return <FileCode size={14} className="text-orange-400 shrink-0" />;
  }
  if (filename.endsWith('.css')) {
    return <FileCode size={14} className="text-sky-400 shrink-0" />;
  }
  if (filename.endsWith('.json')) {
    return <FileBraces size={14} className="text-amber-400 shrink-0" />;
  }
  if (filename.endsWith('.md') || filename.endsWith('.txt')) {
    return <FileText size={14} className="text-slate-400 shrink-0" />;
  }
  if (filename.endsWith('.py')) {
    return <FileCode size={14} className="text-emerald-400 shrink-0" />;
  }
  return <File size={14} className="text-slate-400 shrink-0" />;
};

const EditorTab = () => {
  const dispatch = useDispatch();
  const openFiles = useSelector((state) => state.editor.openFiles);
  const activeFile = useSelector((state) => state.editor.activeFile);

  const handleSelectTab = (path) => {
    dispatch(setActiveFile(path));
  };

  const handleCloseTab = (e, path) => {
    e.stopPropagation();
    dispatch(closeFile(path));
  };

  if (!openFiles || openFiles.length === 0) {
    return (
      <div className="h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 text-xs text-slate-500 italic select-none">
        No open files
      </div>
    );
  }

  return (
    <div className="h-9 bg-slate-950/90 border-b border-slate-800 flex items-center overflow-x-auto select-none [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-track]:bg-transparent">
      {openFiles.map((file) => {
        const filePath = typeof file === 'string' ? file : file?.path;
        const fileName = file?.name || filePath?.split('/').pop() || filePath;
        const isActive = activeFile === filePath;

        return (
          <div
            key={filePath}
            onClick={() => handleSelectTab(filePath)}
            title={filePath}
            className={`group h-full flex items-center gap-2 px-3 text-xs cursor-pointer border-r border-slate-800/80 transition-colors shrink-0 ${
              isActive
                ? 'bg-[#020618] text-white font-medium border-t-2 border-t-cyan-400'
                : 'bg-slate-950/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border-t-2 border-t-transparent'
            }`}
          >
            {getFileIcon(fileName)}
            <span className="truncate max-w-[140px] tracking-wide">{fileName}</span>
            <button
              type="button"
              onClick={(e) => handleCloseTab(e, filePath)}
              title="Close tab"
              className="p-0.5 rounded text-slate-500 hover:text-slate-100 hover:bg-slate-800/80 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTab;
import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  FileCode,
  FileBraces,
  FileText,
  File,
} from 'lucide-react';

const FileIcon = ({ filename }) => {
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
    return <FileCode size={15} className="text-cyan-400 shrink-0" />;
  }

  if (filename.endsWith('.js') || filename.endsWith('.mjs')) {
    return <FileCode size={15} className="text-yellow-400 shrink-0" />;
  }

  if (filename.endsWith('.json')) {
    return <FileBraces size={15} className="text-amber-400 shrink-0" />;
  }

  if (filename.endsWith('.md') || filename.endsWith('.txt')) {
    return <FileText size={15} className="text-slate-400 shrink-0" />;
  }

  return <File size={15} className="text-slate-400 shrink-0" />;
};

const initialFileTree = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [],
      },
      {
        id: 'App.jsx',
        name: 'App.jsx',
        type: 'file',
      },
      {
        id: 'main.jsx',
        name: 'main.jsx',
        type: 'file',
      },
    ],
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
  },
];

const FileExplorer = ({ onFileSelect }) => {
  const [tree, setTree] = useState(initialFileTree);
  const [selectedId, setSelectedId] = useState('App.jsx');
  const [creating, setCreating] = useState(null); // { type: 'file' | 'folder' } | null
  const [newItemName, setNewItemName] = useState('');

  // Toggle open/closed state of folders
  const toggleFolder = (nodeId) => {
    const updateNodes = (nodes) => {
      return nodes.map((node) => {
        if (node.id === nodeId && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setTree((prevTree) => updateNodes(prevTree));
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      toggleFolder(item.id);
    } else {
      setSelectedId(item.id);
      if (onFileSelect) {
        onFileSelect(item);
      }
    }
  };

  // Start creation input
  const handleStartCreate = (type) => {
    setCreating({ type });
    setNewItemName('');
  };

  // Submit new file or folder
  const handleCreateSubmit = (e) => {
    e?.preventDefault();
    if (!newItemName.trim()) {
      setCreating(null);
      return;
    }

    const newItem = {
      id: `${newItemName.trim()}-${Date.now()}`,
      name: newItemName.trim(),
      type: creating.type,
      ...(creating.type === 'folder' ? { isOpen: true, children: [] } : {}),
    };

    setTree((prev) => [...prev, newItem]);
    if (creating.type === 'file') {
      setSelectedId(newItem.id);
    }
    setCreating(null);
    setNewItemName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateSubmit();
    } else if (e.key === 'Escape') {
      setCreating(null);
      setNewItemName('');
    }
  };

  // Recursive tree renderer
  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isSelected = selectedId === node.id;
      const isFolder = node.type === 'folder';

      return (
        <div key={node.id} className="select-none text-xs">
          <div
            onClick={() => handleItemClick(node)}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`group flex items-center gap-1.5 py-1 pr-2 cursor-pointer transition-colors duration-150 ${
              isSelected
                ? 'bg-slate-800 text-white font-medium border-l-2 border-cyan-400'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            {isFolder ? (
              <span className="w-3.5 flex items-center justify-center text-slate-400">
                {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            ) : (
              <span className="w-3.5" />
            )}

            {isFolder ? (
              node.isOpen ? (
                <FolderOpen size={15} className="text-amber-400 shrink-0" />
              ) : (
                <Folder size={15} className="text-amber-400 shrink-0" />
              )
            ) : (
              <FileIcon filename={node.name} />
            )}

            <span className="truncate flex-1 tracking-wide">{node.name}</span>
          </div>

          {isFolder && node.isOpen && node.children && (
            <div>
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-300 font-sans select-none text-xs">
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStartCreate('file')}
            title="New File"
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <FilePlus size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleStartCreate('folder')}
            title="New Folder"
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <FolderPlus size={15} />
          </button>
        </div>
      </div>

      {/* Project Section Title */}
      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 tracking-wider flex items-center gap-1 uppercase bg-slate-900/20">
        <ChevronDown size={12} className="text-slate-400" />
        <span>Project</span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-1">
        {renderTree(tree)}

        {/* Inline input when creating new file/folder */}
        {creating && (
          <div className="flex items-center gap-1.5 py-1 px-3 text-xs bg-slate-800/40">
            <span className="w-3.5" />
            {creating.type === 'folder' ? (
              <Folder size={15} className="text-amber-400 shrink-0" />
            ) : (
              <FileIcon filename={newItemName || 'file'} />
            )}
            <input
              type="text"
              autoFocus
              value={newItemName}
              placeholder={creating.type === 'folder' ? 'folder name' : 'filename.ext'}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleCreateSubmit}
              className="bg-slate-900 text-white text-xs border border-cyan-500 rounded px-1.5 py-0.5 outline-none flex-1 min-w-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
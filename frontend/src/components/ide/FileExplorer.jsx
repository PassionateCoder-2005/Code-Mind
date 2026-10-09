import React, { useState, useEffect } from 'react';
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
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createFile,
  createFolder,
  openFile,
  deleteFile,
  deleteFolder,
} from '../../store/slices/editorSlice';

const FileIcon = ({ filename = '' }) => {
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

  if (filename.endsWith('.html')) {
    return <FileCode size={15} className="text-orange-400 shrink-0" />;
  }

  if (filename.endsWith('.css')) {
    return <FileCode size={15} className="text-sky-400 shrink-0" />;
  }

  if (filename.endsWith('.py')) {
    return <FileCode size={15} className="text-emerald-400 shrink-0" />;
  }

  return <File size={15} className="text-slate-400 shrink-0" />;
};

const FileExplorer = ({ onFileSelect }) => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.editor.files) || {};
  const activeFile = useSelector((state) => state.editor.activeFile);

  const [selectedId, setSelectedId] = useState('App.jsx');
  const [openFolders, setOpenFolders] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null); // { id: string, name: string, type: 'file' | 'folder' } | null

  // Close confirmation modal on Escape key
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && itemToDelete) {
        setItemToDelete(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [itemToDelete]);

  // Construct hierarchical tree from state.editor.files
  const buildTree = (filesMap) => {
    const rootNodes = [];
    const folderNodes = {};

    Object.entries(filesMap || {}).forEach(([path, fileData]) => {
      const isFolder =
        fileData?.type === 'folder' ||
        fileData === '' ||
        (typeof fileData === 'object' && fileData !== null && !('content' in fileData) && fileData.type !== 'file');

      const parts = path.split('/').filter(Boolean);
      let currentPath = '';

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (isLast) {
          if (isFolder) {
            if (!folderNodes[currentPath]) {
              const node = {
                id: currentPath,
                name: part,
                type: 'folder',
                children: [],
              };
              folderNodes[currentPath] = node;
              if (index === 0) {
                rootNodes.push(node);
              } else {
                const parentPath = parts.slice(0, index).join('/');
                folderNodes[parentPath]?.children.push(node);
              }
            }
          } else {
            const node = {
              id: currentPath,
              name: part,
              type: 'file',
            };
            if (index === 0) {
              rootNodes.push(node);
            } else {
              const parentPath = parts.slice(0, index).join('/');
              if (folderNodes[parentPath]) {
                folderNodes[parentPath].children.push(node);
              } else {
                rootNodes.push(node);
              }
            }
          }
        } else {
          // Intermediate folder for nested items
          if (!folderNodes[currentPath]) {
            const node = {
              id: currentPath,
              name: part,
              type: 'folder',
              children: [],
            };
            folderNodes[currentPath] = node;
            if (index === 0) {
              rootNodes.push(node);
            } else {
              const parentPath = parts.slice(0, index).join('/');
              folderNodes[parentPath]?.children.push(node);
            }
          }
        }
      });
    });

    // Sort folders first, then files alphabetically
    const sortNodes = (nodes) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      nodes.forEach((node) => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
      return nodes;
    };

    return sortNodes(rootNodes);
  };

  const tree = buildTree(files);

  const isFolderOpen = (folderId) => {
    return openFolders[folderId] ?? true;
  };

  // Toggle open/closed state of folders
  const toggleFolder = (nodeId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [nodeId]: !(prev[nodeId] ?? true),
    }));
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      toggleFolder(item.id);
    } else {
      setSelectedId(item.id);
      if (onFileSelect) {
        onFileSelect(item);
      }
      dispatch(openFile({ path: item.id, name: item.name }));
    }
  };

  // Start creation prompt
  const handleStartCreate = (type) => {
    if (type === 'file') {
      const filename = window.prompt('Enter filename:');
      if (filename && filename.trim()) {
        const trimmed = filename.trim();
        dispatch(
          createFile({
            path: trimmed,
            content: '',
          })
        );
        dispatch(openFile({ path: trimmed, name: trimmed.split('/').pop() || trimmed }));
        setSelectedId(trimmed);
      }
    }

    if (type === 'folder') {
      const foldername = window.prompt('Enter folder name:');
      if (foldername && foldername.trim()) {
        const trimmed = foldername.trim();
        dispatch(
          createFolder({
            path: trimmed,
          })
        );
        setOpenFolders((prev) => ({
          ...prev,
          [trimmed]: true,
        }));
      }
    }
  };

  // Prompt delete confirmation modal
  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'folder') {
      dispatch(deleteFolder({ path: itemToDelete.id }));
    } else {
      dispatch(deleteFile({ path: itemToDelete.id }));
    }

    if (selectedId === itemToDelete.id) {
      setSelectedId(null);
    }

    setItemToDelete(null);
  };

  // Currently selected item for toolbar actions
  const currentSelectedId = selectedId || activeFile;
  const selectedTarget =
    currentSelectedId && files[currentSelectedId]
      ? {
          id: currentSelectedId,
          name: currentSelectedId.split('/').pop() || currentSelectedId,
          type:
            files[currentSelectedId]?.type === 'folder' || files[currentSelectedId] === ''
              ? 'folder'
              : 'file',
        }
      : null;

  // Recursive tree renderer
  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isSelected = activeFile === node.id || selectedId === node.id;
      const isFolder = node.type === 'folder';
      const isOpen = isFolderOpen(node.id);

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
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            ) : (
              <span className="w-3.5" />
            )}

            {isFolder ? (
              isOpen ? (
                <FolderOpen size={15} className="text-amber-400 shrink-0" />
              ) : (
                <Folder size={15} className="text-amber-400 shrink-0" />
              )
            ) : (
              <FileIcon filename={node.name} />
            )}

            <span className="truncate flex-1 tracking-wide">{node.name}</span>

            {/* Delete button on hover */}
            <button
              type="button"
              onClick={(e) => handleDeleteClick(e, node)}
              title={`Delete ${isFolder ? 'folder' : 'file'}`}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {isFolder && isOpen && node.children && node.children.length > 0 && (
            <div>{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-300 font-sans select-none text-xs relative">
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
          {selectedTarget && (
            <button
              type="button"
              onClick={(e) => handleDeleteClick(e, selectedTarget)}
              title={`Delete selected ${selectedTarget.type === 'folder' ? 'folder' : 'file'}`}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Project Section Title */}
      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 tracking-wider flex items-center gap-1 uppercase bg-slate-900/20">
        <ChevronDown size={12} className="text-slate-400" />
        <span>Project</span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 italic text-[11px]">
            No files or folders
          </div>
        ) : (
          renderTree(tree)
        )}
      </div>

      {/* Delete Confirmation Popup Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-xl p-5 max-w-sm w-full shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 size={20} />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-sm font-semibold text-white">
                  Delete {itemToDelete.type === 'folder' ? 'Folder' : 'File'}?
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Do you really want to delete{' '}
                  <span className="font-semibold text-cyan-400 break-all">
                    "{itemToDelete.name}"
                  </span>
                  ?
                </p>

                {itemToDelete.type === 'folder' && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1.5">
                    <AlertTriangle size={13} className="shrink-0 text-amber-400" />
                    <span>This will delete the folder and all its items.</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg transition-colors shadow-lg shadow-rose-950/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
import React from 'react';
import { useSelector } from 'react-redux';

const SaveButton = () => {
  const isDirty = useSelector((state) => state.editor.isDirty);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium border select-none transition-all duration-200 ${
        isDirty
          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
        }`}
      />
      <span>{isDirty ? 'Unsaved Changes' : 'Saved'}</span>
    </div>
  );
};

export default SaveButton;
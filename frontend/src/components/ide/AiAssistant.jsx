import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Code,
  Bug,
  Zap,
} from 'lucide-react';

const AiAssistant = () => {
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    {
      id: 'explain',
      label: 'Explain Code',
      icon: Code,
      prompt: 'Can you explain how this code works?',
    },
    {
      id: 'fix',
      label: 'Fix Bug',
      icon: Bug,
      prompt: 'Find and fix any bugs in this snippet.',
    },
    {
      id: 'optimize',
      label: 'Optimize',
      icon: Zap,
      prompt: 'Suggest performance and cleanliness optimizations.',
    },
  ];

  const handleActionClick = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans select-none text-xs">
      {/* Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot size={13} />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
            AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ready
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Card & Message */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-950/40">
            <Sparkles size={14} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
              <p className="text-slate-200 text-xs leading-relaxed">
                Hi! I can help you understand, debug and improve your code.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 px-0.5">
                Quick Actions
              </div>
              <div className="flex flex-col gap-1.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleActionClick(action.prompt)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all duration-150 text-left cursor-pointer"
                    >
                      <span className="p-1 rounded bg-slate-800 group-hover:bg-cyan-500/10 text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <Icon size={13} />
                      </span>
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Static UI - no submit action yet
          }}
          className="flex flex-col gap-2 bg-slate-950 border border-slate-800 focus-within:border-cyan-500/70 rounded-xl p-2 transition-colors"
        >
          <textarea
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI anything about your code..."
            className="w-full bg-transparent text-slate-200 placeholder:text-slate-500 text-xs resize-none outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500">
              Press Enter to send
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <span>Send</span>
              <Send size={12} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
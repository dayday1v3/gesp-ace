import { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  language?: string;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  disabled = false,
  language = 'cpp',
  height = '240px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });

  useEffect(() => {
    updateLineNumbers();
  }, [value]);

  const updateLineNumbers = () => {
    if (lineNumbersRef.current) {
      const lines = value.split('\n').length;
      lineNumbersRef.current.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const currentLine = value.substring(0, start).split('\n').pop() || '';
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      const newValue = value.substring(0, start) + '\n' + indent + value.substring(start);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
    }

    if (e.key === 'Backspace') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      if (start > 0 && value[start - 1] === ' ' && value[start - 2] === ' ') {
        e.preventDefault();
        const newValue = value.substring(0, start - 2) + value.substring(start);
        onChange(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 2;
        }, 0);
      }
    }
  };

  const handleSelect = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lines = value.substring(0, textarea.selectionStart).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    setCursorPos({ line, column });
  };

  const highlightSyntax = (code: string) => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    highlighted = highlighted.replace(
      /\b(int|float|double|char|void|bool|string|class|struct|enum|namespace|using|public|private|protected|return|if|else|for|while|do|switch|case|break|continue|new|delete|true|false|null|const|static|inline|virtual|override|template|typedef|include)\b/g,
      '<span class="text-blue-400">$1</span>'
    );

    highlighted = highlighted.replace(
      /(#include\s*["<][^">]+[">])/g,
      '<span class="text-gray-500 italic">$1</span>'
    );

    highlighted = highlighted.replace(
      /(\/\/.*)/g,
      '<span class="text-gray-500 italic">$1</span>'
    );

    highlighted = highlighted.replace(
      /("[^"]*"|'[^']*')/g,
      '<span class="text-green-400">$1</span>'
    );

    highlighted = highlighted.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="text-amber-400">$1</span>'
    );

    highlighted = highlighted.replace(
      /\b(main|cout|cin|endl|string|vector|map|set|list|array|auto|sizeof|typeid|dynamic_cast|static_cast|const_cast|reinterpret_cast|this|throw|try|catch| noexcept|constexpr|constinit|concept|requires|co_await|co_yield|co_return|import|module|export)\b/g,
      '<span class="text-purple-400">$1</span>'
    );

    return highlighted;
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-mono">main.cpp</span>
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-700 rounded">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Ln {cursorPos.line}, Col {cursorPos.column}
        </div>
      </div>

      <div className="flex">
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 w-12 bg-gray-800 text-gray-500 text-right pr-3 pt-4 pb-4 font-mono text-sm overflow-hidden select-none"
          style={{ height }}
        >
          1
        </div>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
            spellCheck={false}
            style={{ caretColor: '#4ade80' }}
            placeholder="// 请在此编写代码..."
          />
          <div
            className="pointer-events-none absolute inset-0 w-full h-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap break-words"
            style={{ minHeight: height, lineHeight: '1.5rem' }}
            dangerouslySetInnerHTML={{ __html: highlightSyntax(value) || '&nbsp;' }}
          />
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>UTF-8</span>
          <span>LF</span>
          <span>Tab: 2</span>
        </div>
        <div className="text-xs text-gray-500">
          {value.split('\n').length} lines | {value.length} chars
        </div>
      </div>
    </div>
  );
};

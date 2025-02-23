import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Terminal as TerminalIcon, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface TerminalWindowProps {
  output: string[];
}

export function TerminalWindow({ output }: TerminalWindowProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const getLineIcon = (line: string) => {
    if (line.includes('Error')) {
      return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
    }
    if (line.includes('✓')) {
      return <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />;
    }
    if (line.startsWith('[ClickNova]')) {
      return <TerminalIcon className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (line.includes('...')) {
      return <Clock className="w-4 h-4 text-yellow-400 shrink-0 animate-spin" />;
    }
    return <AlertCircle className="w-4 h-4 text-cyan-400/50 shrink-0" />;
  };

  const formatLine = (line: string) => {
    if (line.startsWith('[ClickNova]')) {
      return (
        <span className="text-cyan-400 font-semibold">{line}</span>
      );
    }
    if (line.includes('Error')) {
      return (
        <span className="text-red-400">{line}</span>
      );
    }
    if (line.includes('✓')) {
      return (
        <span className="text-green-400">{line}</span>
      );
    }
    if (line.startsWith('===')) {
      return (
        <span className="text-yellow-400 font-semibold">{line}</span>
      );
    }
    if (line.match(/\d+(\.\d+)?%/)) {
      // Highlight percentage values
      return (
        <span className="text-cyan-200">
          {line.replace(/(\d+(\.\d+)?%)/g, match => (
            `[${match}]`
          ))}
        </span>
      );
    }
    if (line.match(/\b(CPU|Memory|Disk|Network)\b/)) {
      // Highlight system metrics
      return (
        <span className="text-purple-400">{line}</span>
      );
    }
    return (
      <span className="text-cyan-100">{line}</span>
    );
  };

  const getStats = () => {
    const total = output.length;
    const success = output.filter(line => line.includes('✓')).length;
    const errors = output.filter(line => line.includes('Error')).length;
    const inProgress = output.filter(line => line.includes('...')).length;

    return { total, success, errors, inProgress };
  };

  const stats = getStats();

  return (
    <div className="space-y-4">
      {output.length > 0 && (
        <div className="grid grid-cols-4 gap-2 p-2 bg-black/20 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-cyan-400">Total</div>
            <div className="text-lg font-semibold text-cyan-200">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-green-400">Success</div>
            <div className="text-lg font-semibold text-green-200">{stats.success}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-red-400">Errors</div>
            <div className="text-lg font-semibold text-red-200">{stats.errors}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-yellow-400">In Progress</div>
            <div className="text-lg font-semibold text-yellow-200">{stats.inProgress}</div>
          </div>
        </div>
      )}
      
      <div
        ref={terminalRef}
        className="h-[400px] font-mono text-sm overflow-y-auto bg-black/30 rounded-lg border border-cyan-500/20 p-4 space-y-1"
      >
        {output.length === 0 ? (
          <div className="text-cyan-500/50 animate-pulse flex items-center gap-2">
            <TerminalIcon className="w-4 h-4" />
            Ready for optimization commands...
          </div>
        ) : (
          output.map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              {getLineIcon(line)}
              <div className="flex-1 text-cyan-100 whitespace-pre-wrap">
                {formatLine(line)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

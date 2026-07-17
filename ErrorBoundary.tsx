import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  // Optional: called when the user taps "Try Again" - use this to reset
  // whatever local state caused the crash (e.g. back to the recording studio).
  onReset?: () => void;
  // Optional: custom fallback title/message for this boundary's context.
  title?: string;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Generic error boundary. React unmounts the entire tree up to the nearest
 * boundary when a render throws - without one anywhere in the app, a single
 * bad render (e.g. an unexpected AI response shape) blanks the whole screen.
 * Wrap any feature whose failure shouldn't take down the rest of the app.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary caught a render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[320px] w-full flex flex-col items-center justify-center text-center p-10 bg-[#1A1A1E] border border-[#D4AF37]/20 rounded-[2rem] space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
            <AlertTriangle size={26} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-cream font-serif font-bold text-lg">
              {this.props.title || 'Something interrupted this session'}
            </h3>
            <p className="text-slate-400 text-xs max-w-sm">
              {this.props.message || "No progress was lost elsewhere in the app. Let's get you back on track."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="bg-[#D4AF37] text-[#121214] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

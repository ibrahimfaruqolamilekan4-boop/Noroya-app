import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
          <p className="text-lg font-semibold text-white/80">
            {this.props.title ?? 'Something went wrong'}
          </p>
          {this.props.message && (
            <p className="text-sm text-white/50">{this.props.message}</p>
          )}
          {this.props.onReset && (
            <button
              onClick={this.handleReset}
              className="mt-2 px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

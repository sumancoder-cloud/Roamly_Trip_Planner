import { FiRotateCcw, FiAlertTriangle } from "react-icons/fi";

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
          <div className="w-full max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FiAlertTriangle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
            <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page and try again.</p>
            <button onClick={() => window.location.reload()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              <FiRotateCcw className="h-4 w-4" />
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

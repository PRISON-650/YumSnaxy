import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred';
      let isFirestoreError = false;
      let firestoreInfo = null;

      try {
        if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
          firestoreInfo = JSON.parse(errorMessage);
          isFirestoreError = true;
          errorMessage = `Database Access Error: ${firestoreInfo.error || 'Missing or insufficient permissions'}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-neutral-100 max-w-md w-full text-center space-y-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black tracking-tighter uppercase">Something went wrong</h1>
              <p className="text-neutral-500 leading-relaxed">
                {isFirestoreError ? (
                  <>
                    <span className="font-bold text-red-600 block mb-2">{errorMessage}</span>
                    <span className="text-sm">This usually happens when your user permissions are still being synchronized. Please try reloading.</span>
                  </>
                ) : (
                  "We've encountered an unexpected error. Our team has been notified."
                )}
              </p>
            </div>

            {this.state.error && !isFirestoreError && (
              <div className="p-4 bg-neutral-50 rounded-2xl text-left overflow-auto max-h-40 border border-neutral-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Error Details</p>
                <code className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-3 bg-neutral-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-neutral-200"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white text-neutral-600 py-5 rounded-2xl font-bold text-lg hover:bg-neutral-50 transition-all flex items-center justify-center gap-3"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

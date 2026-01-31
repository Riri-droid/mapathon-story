/**
 * ErrorBoundary.jsx
 * Graceful error handling component to prevent app crashes
 * Provides user-friendly error messages and recovery options
 */

import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
    
    // In production, you would send this to an error tracking service
    // Example: errorTrackingService.log({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <div style={styles.buttons}>
              <button 
                onClick={this.handleRetry}
                style={styles.primaryButton}
              >
                Try Again
              </button>
              <button 
                onClick={this.handleGoHome}
                style={styles.secondaryButton}
              >
                Go Home
              </button>
            </div>
            {/* Only show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Dev Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    fontFamily: "'Inter', sans-serif",
  },
  message: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '24px',
    fontFamily: "'Inter', sans-serif",
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0a0a14',
    background: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
  },
  summary: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  errorText: {
    marginTop: '12px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    color: '#ff6b6b',
    fontSize: '11px',
    overflow: 'auto',
    maxHeight: '200px',
    fontFamily: 'monospace',
  },
}

export default ErrorBoundary

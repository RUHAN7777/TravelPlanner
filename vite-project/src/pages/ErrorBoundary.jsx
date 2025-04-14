import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error and error info
    this.setState({
      error: error,
      errorInfo: errorInfo || { componentStack: 'No error stack available' }
    });
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Display fallback UI in case of an error
      return (
        <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available'}
          </details>
        </div>
      );
    }
    // If there's no error, render the children components as usual
    return this.props.children;
  }
}

export default ErrorBoundary;

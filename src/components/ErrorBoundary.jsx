import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-20 text-center">
          <p className="text-white/40 text-sm">Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-gold-500 text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

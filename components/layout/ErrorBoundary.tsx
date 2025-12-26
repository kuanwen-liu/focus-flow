'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <motion.div
            className="max-w-md w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <span className="material-symbols-outlined text-8xl text-red-500">error</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-3">
              Something went wrong
            </h1>
            <p className="text-text-secondary mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-card border border-border rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-text-primary mb-2">
                  Error details
                </summary>
                <pre className="text-xs text-red-500 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-dark rounded-lg font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)] transition-all"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-background border border-border text-text-primary rounded-lg font-medium hover:border-primary transition-all"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

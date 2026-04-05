'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Wraps WebGL sections. If Three.js / R3F throws (GPU unavailable,
 * context lost, bad driver), we silently fall back to a CSS gradient
 * background rather than crashing the whole page.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WebGLErrorBoundary] Caught WebGL error:', error.message, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          // Silent CSS gradient fallback — matches the ambient glow style
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(139,92,246,0.08) 0%, transparent 70%), ' +
                'radial-gradient(ellipse 50% 50% at 70% 60%, rgba(59,130,246,0.06) 0%, transparent 70%)',
            }}
          />
        )
      );
    }
    return this.props.children;
  }
}

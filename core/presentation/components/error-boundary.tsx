import * as Sentry from "@sentry/react-native";
import { Component } from "react";

import type { ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: (props: ErrorBoundaryFallbackProps) => ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export type ErrorBoundaryFallbackProps = {
  error: Error;
  onRetry: () => void;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag("error_boundary", "true");
      scope.setExtra("componentStack", errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  resetErrorState = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        onRetry: this.resetErrorState,
      });
    }
    return this.props.children;
  }
}

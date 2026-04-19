import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Suppress console.error output from ErrorBoundary's componentDidCatch
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = consoleError;
});

// Component that throws on render when `shouldThrow` is true
function ThrowingChild({ shouldThrow, message = 'Test error' }: { shouldThrow: boolean; message?: string }) {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Child content</div>;
}

describe('ErrorBoundary', () => {
  describe('normal rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <ErrorBoundary>
          <span>First</span>
          <span>Second</span>
        </ErrorBoundary>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('shows error UI when a child throws', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('shows the basketball emoji in the error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('🏀')).toBeInTheDocument();
    });

    it('shows the refresh page button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
    });

    it('shows the error message in the technical details section', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} message="Specific error message" />
        </ErrorBoundary>
      );
      expect(screen.getByText('Specific error message')).toBeInTheDocument();
    });

    it('shows a collapsible technical details summary', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Technical details')).toBeInTheDocument();
    });

    it('does not render children in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.queryByText('Child content')).not.toBeInTheDocument();
    });

    it('shows a helpful message to the user', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText(/please try refreshing/i)).toBeInTheDocument();
    });
  });

  describe('reload button', () => {
    it('calls window.location.reload when Refresh Page is clicked', () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /refresh page/i });
      fireEvent.click(button);
      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('componentDidCatch', () => {
    it('logs the error to console.error', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow={true} message="Logged error" />
        </ErrorBoundary>
      );
      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.anything()
      );
    });
  });
});

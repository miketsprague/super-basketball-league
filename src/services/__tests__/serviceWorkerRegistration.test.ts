import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('serviceWorkerRegistration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('register', () => {
    it('does nothing when serviceWorker is not available', async () => {
      vi.stubGlobal('navigator', {});
      const { register } = await import('../../serviceWorkerRegistration');
      expect(() => register()).not.toThrow();
    });

    it('does nothing in development/test mode (PROD is false)', async () => {
      vi.stubEnv('PROD', false);
      const mockRegister = vi.fn();
      vi.stubGlobal('navigator', {
        serviceWorker: { register: mockRegister },
      });
      const { register } = await import('../../serviceWorkerRegistration');
      register();
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('registers the service worker on page load in production', async () => {
      vi.stubEnv('PROD', true);
      vi.stubEnv('BASE_URL', '/super-basketball-league/');

      const mockRegister = vi.fn().mockResolvedValue({ scope: '/super-basketball-league/' });
      vi.stubGlobal('navigator', {
        serviceWorker: { register: mockRegister },
      });

      const loadListeners: Array<() => void> = [];
      vi.stubGlobal('window', {
        addEventListener: (event: string, cb: () => void) => {
          if (event === 'load') loadListeners.push(cb);
        },
      });

      const { register } = await import('../../serviceWorkerRegistration');
      register();

      expect(loadListeners).toHaveLength(1);

      loadListeners[0]();
      await Promise.resolve();

      expect(mockRegister).toHaveBeenCalledWith(
        '/super-basketball-league/sw.js',
        { scope: '/super-basketball-league/' }
      );
    });

    it('logs an error if registration rejects', async () => {
      vi.stubEnv('PROD', true);
      vi.stubEnv('BASE_URL', '/super-basketball-league/');

      const mockRegister = vi.fn().mockRejectedValue(new Error('Registration blocked'));
      vi.stubGlobal('navigator', {
        serviceWorker: { register: mockRegister },
      });

      const loadListeners: Array<() => void> = [];
      vi.stubGlobal('window', {
        addEventListener: (event: string, cb: () => void) => {
          if (event === 'load') loadListeners.push(cb);
        },
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { register } = await import('../../serviceWorkerRegistration');
      register();

      loadListeners[0]();
      await Promise.resolve();
      await Promise.resolve();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Service worker registration failed:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('unregister', () => {
    it('does nothing when serviceWorker is not available', async () => {
      vi.stubGlobal('navigator', {});
      const { unregister } = await import('../../serviceWorkerRegistration');
      expect(() => unregister()).not.toThrow();
    });

    it('calls unregister on the active registration', async () => {
      const mockUnregister = vi.fn().mockResolvedValue(true);
      vi.stubGlobal('navigator', {
        serviceWorker: { ready: Promise.resolve({ unregister: mockUnregister }) },
      });
      const { unregister } = await import('../../serviceWorkerRegistration');
      unregister();
      await new Promise((r) => setTimeout(r, 0));
      expect(mockUnregister).toHaveBeenCalled();
    });
  });
});

/**
 * Registers the app's service worker for offline/PWA support.
 * Only active in production builds (import.meta.env.PROD).
 */
export function register(): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(swUrl, { scope: import.meta.env.BASE_URL })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

export function unregister(): void {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready
    .then((registration) => registration.unregister())
    .catch((error) => console.error(error));
}

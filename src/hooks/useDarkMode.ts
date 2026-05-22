import { useState, useEffect } from 'react';

const DARK_MODE_KEY = 'basketball-dark-mode';

function getInitialMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
  } catch {
    // localStorage may be unavailable
  }
  // Fall back to OS preference
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(getInitialMode);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    } catch {
      // localStorage may be unavailable
    }
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return [isDark, toggle];
}

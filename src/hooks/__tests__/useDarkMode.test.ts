import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../useDarkMode';

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

describe('useDarkMode', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', storageMock);
    localStorage.clear();
    // Reset the html class
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  it('defaults to light mode when no preference stored and OS is light', () => {
    vi.stubGlobal('window', {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    });

    const { result } = renderHook(() => useDarkMode());
    const [isDark] = result.current;
    expect(isDark).toBe(false);
  });

  it('defaults to dark mode when OS prefers dark and no stored preference', () => {
    vi.stubGlobal('window', {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });

    const { result } = renderHook(() => useDarkMode());
    const [isDark] = result.current;
    expect(isDark).toBe(true);
  });

  it('reads stored dark mode preference from localStorage', () => {
    localStorage.setItem('basketball-dark-mode', 'true');

    const { result } = renderHook(() => useDarkMode());
    const [isDark] = result.current;
    expect(isDark).toBe(true);
  });

  it('reads stored light mode preference from localStorage', () => {
    localStorage.setItem('basketball-dark-mode', 'false');
    vi.stubGlobal('window', {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });

    const { result } = renderHook(() => useDarkMode());
    const [isDark] = result.current;
    expect(isDark).toBe(false);
  });

  it('adds dark class to html element when dark mode is on', () => {
    localStorage.setItem('basketball-dark-mode', 'true');
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from html element when dark mode is off', () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('basketball-dark-mode', 'false');
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggle switches from light to dark', () => {
    localStorage.setItem('basketball-dark-mode', 'false');
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });

  it('toggle switches from dark to light', () => {
    localStorage.setItem('basketball-dark-mode', 'true');
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
  });

  it('persists preference to localStorage on toggle', () => {
    localStorage.setItem('basketball-dark-mode', 'false');
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1]();
    });

    expect(localStorage.getItem('basketball-dark-mode')).toBe('true');
  });

  it('updates html class on toggle', () => {
    localStorage.setItem('basketball-dark-mode', 'false');
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1]();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current[1]();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

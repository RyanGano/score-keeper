import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia, which react-bootstrap's Offcanvas
// reaches for via useMediaQuery. Without this, rendering <App /> throws.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
});

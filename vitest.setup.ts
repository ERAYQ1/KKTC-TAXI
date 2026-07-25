// vitest's jsdom environment doesn't reliably attach `window.localStorage`
// under Node 22+'s own experimental `localStorage` global — see
// https://github.com/vitest-dev/vitest/issues (Node/jsdom storage clash).
// A minimal in-memory polyfill keeps localStorage-dependent code testable.
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
}

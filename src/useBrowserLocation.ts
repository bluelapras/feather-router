import { useSyncExternalStore } from "react";
import { BrowserPathStore } from "./utils/browserPathStore";
/**
 * useBrowserPath - High level hook which provides access to the current browser location, and the ability to set the
 * current browser location. Can be used independently of the Router component.
 */
function useBrowserPath() {
  const browserPath = useSyncExternalStore(BrowserPathStore.subscribe, BrowserPathStore.getSnapshot);
  const setBrowserLocation = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Return as const to make typing exact
  return [browserPath, setBrowserLocation] as const;
}

export { useBrowserPath };

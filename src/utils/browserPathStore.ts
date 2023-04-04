type ReactObserver = () => void;
let reactObservers = <ReactObserver[]>[];
let subscriptionStarted = false;

export const BrowserPathStore = {
  subscribe(newObserver: ReactObserver) {
    if (!subscriptionStarted) {
      _startSubscription();
      subscriptionStarted = true;
    }
    reactObservers.push(newObserver);
    return () => {
      reactObservers = reactObservers.filter((o) => o !== newObserver);
      if (reactObservers.length === 0) {
        _stopSubscription();
      }
    };
  },
  getSnapshot() {
    return window.location.pathname;
  },
};

function notifyReactObservers() {
  reactObservers.forEach((observer) => observer());
}

function _startSubscription() {
  window.addEventListener("popstate", notifyReactObservers);
  subscriptionStarted = true;
}

function _stopSubscription() {
  window.removeEventListener("popstate", notifyReactObservers);
  subscriptionStarted = false;
}

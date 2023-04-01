type Observer = () => void;
let observers = <Observer[]>[];
let subscriptionStarted = false;

export const BrowserPathStore = {
  subscribe(newObserver: () => void) {
    if (!subscriptionStarted) {
      _startSubscription();
      subscriptionStarted = true;
    }
    observers.push(newObserver);
    return () => {
      observers = observers.filter((o) => o !== newObserver);
      if (observers.length === 0) {
        _stopSubscription();
      }
    };
  },
  getSnapshot() {
    return window.location.pathname;
  },
};

function handlePopStateEvent() {
  observers.forEach((observer) => observer());
}

function _startSubscription() {
  window.addEventListener("popstate", handlePopStateEvent);
  subscriptionStarted = true;
}

function _stopSubscription() {
  window.removeEventListener("popstate", handlePopStateEvent);
  subscriptionStarted = false;
}

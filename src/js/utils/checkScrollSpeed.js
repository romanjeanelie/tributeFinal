export const checkScrollSpeed = (function (settings) {
  settings = settings || {};

  let lastPos = null;
  let newPos = null;
  let timer = null;
  let delta = null;
  let delay = settings.delay || 50; // in "ms"

  function clear() {
    lastPos = null;
    delta = 0;
  }

  clear();

  return function () {
    newPos = window.scrollY;
    if (lastPos != null) {
      // && newPos < maxScroll
      delta = newPos - lastPos;
    }
    lastPos = newPos;
    clearTimeout(timer);
    timer = setTimeout(clear, delay);
    return delta;
  };
})();

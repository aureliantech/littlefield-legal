/* Littlefield Legal — site loader
   Reuses the hero's vantage-path device as the load progression instead of
   a generic spinner. Shows once per browser session; on repeat views within
   the same session it steps aside immediately with no ceremony. */
(function () {
  var loader = document.getElementById("site-loader");
  var body = document.body;
  if (!loader) {
    body.classList.remove("is-loading");
    return;
  }

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SEEN_KEY = "llLoaderSeen";
  var alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
  } catch (e) {
    alreadySeen = false;
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      /* private-browsing or storage disabled — fine to skip */
    }
  }

  function finish() {
    loader.hidden = true;
    body.classList.remove("is-loading");
    body.style.overflow = "";
  }

  // Repeat view this session: no ceremony, just get out of the way.
  if (alreadySeen) {
    loader.hidden = true;
    body.classList.remove("is-loading");
    return;
  }

  body.style.overflow = "hidden";

  var nodes = loader.querySelectorAll(".site-loader__node");
  var nodeDelays = reduced ? [0, 0, 0] : [350, 750, 1150];

  nodeDelays.forEach(function (delay, i) {
    window.setTimeout(function () {
      if (nodes[i]) nodes[i].classList.add("is-active");
    }, delay);
  });

  var MIN_DISPLAY_MS = reduced ? 150 : 1600;
  var MAX_WAIT_MS = 5000;
  var startTime = Date.now();
  var pageLoaded = false;
  var exited = false;

  function attemptExit() {
    if (exited) return;
    var elapsed = Date.now() - startTime;
    if (!pageLoaded && elapsed < MAX_WAIT_MS) return;
    if (elapsed < MIN_DISPLAY_MS) {
      window.setTimeout(attemptExit, MIN_DISPLAY_MS - elapsed);
      return;
    }
    exited = true;
    markSeen();

    if (reduced) {
      finish();
      return;
    }

    loader.classList.add("is-exiting");
    window.setTimeout(finish, 720);
  }

  window.addEventListener(
    "load",
    function () {
      pageLoaded = true;
      attemptExit();
    },
    { once: true }
  );

  // Safety net: never trap someone behind the loader on a slow connection.
  window.setTimeout(function () {
    pageLoaded = true;
    attemptExit();
  }, MAX_WAIT_MS);
})();

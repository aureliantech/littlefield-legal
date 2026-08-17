/* Littlefield Legal — page transition (vertical blinds)
   Exit: intercepts clicks on internal links, plays the close animation,
   then navigates. Entrance: if this page load followed a transition from
   another page on the site, starts closed and opens to reveal it. The
   very first page of a session is left to the branded loader instead —
   this only activates for subsequent in-session navigation. */
(function () {
  var overlay = document.getElementById("page-transition");
  if (!overlay) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) return; /* CSS already hides/disables the overlay; skip all JS behavior */

  var CLOSE_MS = 620;
  var OPEN_MS = 650;

  /* —— Entrance: open if we arrived already closed —— */
  function playOpen() {
    if (!overlay.classList.contains("is-closed-instant")) return;
    requestAnimationFrame(function () {
      overlay.classList.add("is-animating-open");
      window.setTimeout(function () {
        overlay.classList.remove("is-closed-instant", "is-animating-open");
      }, OPEN_MS);
    });
  }

  if (document.readyState === "complete") {
    playOpen();
  } else {
    window.addEventListener("load", playOpen, { once: true });
  }

  /* —— Exit: intercept internal link clicks —— */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;
    if (href.indexOf("tel:") === 0 || href.indexOf("mailto:") === 0) return;
    if (href.indexOf("#") === 0) return; /* same-page anchor — let it scroll normally */
    if (link.target && link.target !== "_self") return;
    if (link.hostname && link.hostname !== window.location.hostname) return; /* external link */

    var destination = new URL(href, window.location.href);
    if (destination.pathname === window.location.pathname) return; /* same page */

    e.preventDefault();
    try {
      sessionStorage.setItem("llTransitionOut", "1");
    } catch (err) {
      /* private browsing or storage disabled — navigation still proceeds below */
    }

    overlay.classList.remove("is-closed-instant", "is-animating-open");
    overlay.classList.add("is-animating-close");

    window.setTimeout(function () {
      window.location.href = href;
    }, CLOSE_MS);
  });
})();

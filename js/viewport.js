/* Littlefield Legal — automatic viewport detection.
   The stylesheet is built on body.vp-desktop / body.vp-mobile rather than
   real CSS media queries, so this sets that class from the visitor's
   actual window width and keeps it in sync on resize. */
(function () {
  var BREAKPOINT = 860; // px — below this, mobile layout
  var body = document.body;

  body.classList.remove("mode-artboard");
  body.classList.add("mode-browse");

  function applyViewport() {
    var isMobile = window.innerWidth < BREAKPOINT;
    body.classList.toggle("vp-mobile", isMobile);
    body.classList.toggle("vp-desktop", !isMobile);
  }

  applyViewport();
  window.addEventListener("resize", applyViewport, { passive: true });

  var siteHeader = document.querySelector(".site-header");
  function updateHeaderScroll() {
    if (!siteHeader) return;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 8) siteHeader.classList.add("is-scrolled");
    else siteHeader.classList.remove("is-scrolled");
  }
  updateHeaderScroll();
  window.addEventListener("scroll", updateHeaderScroll, { passive: true });
})();

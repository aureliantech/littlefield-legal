/* Littlefield Legal — E14 media parallax (desktop only)
   Drives every .parallax-media layer (hero, differentiator section, and any
   future full-bleed photo section) relative to its own section's position
   in the viewport, rather than a single hard-coded hero. */
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var items = Array.prototype
    .slice.call(document.querySelectorAll(".parallax-media"))
    .map(function (media) {
      var section = media.closest(".sec") || media.parentElement;
      return section ? { media: media, section: section } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  var FACTOR = 0.16;
  var ticking = false;

  function isMobileVp() {
    return document.body.classList.contains("vp-mobile");
  }

  function clearTransforms() {
    items.forEach(function (item) {
      item.media.style.transform = "";
    });
  }

  function update() {
    ticking = false;
    if (isMobileVp()) {
      clearTransforms();
      return;
    }
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (item) {
      var rect = item.section.getBoundingClientRect();
      var centerOffset = rect.top + rect.height / 2 - vh / 2;
      var y = centerOffset * -FACTOR;
      item.media.style.transform = "translate3d(0," + y + "px,0)";
    });
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  update();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  /* Artboard Desktop | Mobile toggle changes body class without resize */
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(onScrollOrResize).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
})();

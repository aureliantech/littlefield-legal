/* Littlefield Legal — Insight/Clarity stacked-cards scroll handoff
   The wrapper (#diff-stack) is taller than its sticky inner content,
   providing scroll "runway." As the page scrolls through that runway,
   progress (0–1) determines which card is active and which has
   receded — a real page-scroll equivalent of the showcase's contained
   demo, using getBoundingClientRect instead of a scrollable box. */
(function () {
  var wrap = document.getElementById("diff-stack");
  var sticky = document.getElementById("diff-stack-sticky");
  var cards = wrap ? wrap.querySelectorAll(".diff-card") : [];
  if (!wrap || !sticky || !cards.length) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; /* CSS fallback already shows both cards statically */

  var ticking = false;

  function update() {
    ticking = false;
    var stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
    var rect = wrap.getBoundingClientRect();
    var runway = wrap.offsetHeight - sticky.offsetHeight;
    if (runway <= 0) return;

    var scrolled = stickyTop - rect.top;
    var progress = Math.min(1, Math.max(0, scrolled / runway));

    var seg = 1 / cards.length;
    cards.forEach(function (card, i) {
      var start = i * seg;
      card.classList.remove("is-active", "is-behind");
      if (progress >= start) {
        if (i < cards.length - 1 && progress >= (i + 1) * seg) {
          card.classList.add("is-behind");
        } else {
          card.classList.add("is-active");
        }
      }
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

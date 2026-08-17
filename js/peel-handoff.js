/* Littlefield Legal — method-to-attorney section peel handoff
   A dedicated pinned zone between the two sections. Panel A (method's
   closing message) recedes and fades as Panel B (attorney's opening)
   grows in to replace it — both tied to real page-scroll progress
   through the zone's runway, same technique as diff-stack.js. */
(function () {
  var wrap = document.getElementById("peel-stack");
  var sticky = document.getElementById("peel-sticky");
  var panelA = document.querySelector("#peel-sticky .peel-panel-a");
  var panelB = document.querySelector("#peel-sticky .peel-panel-b");
  if (!wrap || !sticky || !panelA || !panelB) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; /* CSS fallback already shows both panels statically, stacked */

  var ticking = false;

  function update() {
    ticking = false;
    var stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
    var rect = wrap.getBoundingClientRect();
    var runway = wrap.offsetHeight - sticky.offsetHeight;
    if (runway <= 0) return;

    var scrolled = stickyTop - rect.top;
    var progress = Math.min(1, Math.max(0, scrolled / runway));

    panelA.style.opacity = 1 - progress;
    panelA.style.transform = "scale(" + (1 - progress * 0.1) + ")";
    panelB.style.opacity = progress;
    panelB.style.transform = "scale(" + (0.94 + progress * 0.06) + ")";
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

/* Littlefield Legal — method section: highlight the active beat as it's read */
(function () {
  var beats = document.querySelectorAll(".method-beat");
  if (!beats.length) return;

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var readingLine = vh * 0.5;

    beats.forEach(function (beat) {
      var rect = beat.getBoundingClientRect();
      var isActive = rect.top <= readingLine && rect.bottom >= readingLine * 0.35;
      beat.classList.toggle("is-active", isActive);
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
})();

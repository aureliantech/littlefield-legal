/* Littlefield Legal — reviews carousel
   Autoplays left to right, loops, and can be driven by the dots, a swipe
   or the keyboard. Pauses on hover and focus, while the tab is
   hidden, and while the section is off screen. Honours prefers-reduced-motion
   by not autoplaying at all. Without JS the first slide simply stays put. */
(function () {
  var root = document.querySelector("[data-revs]");
  if (!root) return;

  var stage = root.querySelector("[data-revs-stage]");
  var slides = Array.prototype.slice.call(root.querySelectorAll("[data-slide]"));
  if (!stage || slides.length < 2) return;

  var dotsWrap = root.querySelector("[data-revs-dots]");
  var live = root.querySelector("[data-revs-live]");

  var ADVANCE_MS = 5000;
  var index = 0;
  var timer = null;
  var onScreen = false;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Dots are built here rather than sitting in the markup: without JS they
     would be controls that do nothing. */
  var dots = [];
  if (dotsWrap) {
    slides.forEach(function (slide, n) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "revs__dot";
      dot.setAttribute("aria-label", "Review " + (n + 1) + " of " + slides.length);
      dot.setAttribute("aria-current", n === 0 ? "true" : "false");
      dot.addEventListener("click", function () { nudgeTo(n); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function go(next, announce) {
    var from = index;
    index = (next + slides.length) % slides.length;
    if (index === from) return;

    slides[from].classList.remove("is-on");
    slides[from].classList.add("is-out");
    slides[index].classList.remove("is-out");
    slides[index].classList.add("is-on");

    /* Clear the exit state once the slide is out of sight, so it returns from
       the right next time round rather than from wherever it left. */
    window.setTimeout(function () {
      slides[from].classList.remove("is-out");
    }, 520);

    dots.forEach(function (dot, n) {
      dot.setAttribute("aria-current", n === index ? "true" : "false");
    });

    /* Only announce when the visitor drove the change — narrating an
       autoplaying carousel would be constant noise. */
    if (announce && live) {
      var who = slides[index].querySelector(".revs__who");
      live.textContent =
        "Review " + (index + 1) + " of " + slides.length + (who ? ", " + who.textContent : "");
    }
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function start() {
    if (timer || reduceMotion || !onScreen) return;
    timer = window.setInterval(function () { go(index + 1); }, ADVANCE_MS);
  }

  /* Manual navigation restarts the clock rather than killing it, so the next
     slide never arrives right on top of the visitor's tap. */
  function nudge(step) { stop(); go(index + step, true); start(); }
  function nudgeTo(n) { stop(); go(n, true); start(); }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) start();
  });

  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); nudge(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); nudge(1); }
  });

  /* Swipe. Vertical drags are left alone so the page still scrolls. */
  var startX = null, startY = null;
  stage.addEventListener("touchstart", function (event) {
    var touch = event.changedTouches[0];
    startX = touch.clientX; startY = touch.clientY;
    stop();
  }, { passive: true });

  stage.addEventListener("touchend", function (event) {
    if (startX === null) return;
    var touch = event.changedTouches[0];
    var dx = touch.clientX - startX;
    var dy = touch.clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1), true);
    }
    start();
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        onScreen = entries[i].isIntersecting;
        if (onScreen) start(); else stop();
      }
    }, { threshold: 0.35 }).observe(root);
  } else {
    onScreen = true;
    start();
  }
})();

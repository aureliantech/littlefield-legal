/* Littlefield Legal — reviews: single-quote carousel with autoplay */
(function () {
  var track = document.getElementById("review-track");
  var feature = document.querySelector(".review-feature");
  if (!track || !feature) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll(".review-slide"));
  var segments = Array.prototype.slice.call(document.querySelectorAll(".review-progress-seg"));
  var prevBtn = document.querySelector(".review-arrow--prev");
  var nextBtn = document.querySelector(".review-arrow--next");
  if (!slides.length) return;

  var AUTOPLAY_MS = 6000;
  var current = 0;
  var inView = true;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.style.setProperty("--review-autoplay-ms", AUTOPLAY_MS + "ms");

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function currentIndexFromScroll() {
    var width = track.clientWidth || 1;
    return Math.round(track.scrollLeft / width);
  }

  function scrollToIndex(index, smooth) {
    var slide = slides[index];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: smooth && !reducedMotion() ? "smooth" : "auto",
    });
  }

  function setActiveSegment(index) {
    segments.forEach(function (seg, i) {
      seg.classList.remove("is-active", "is-done");
      if (i < index) seg.classList.add("is-done");
    });
    // Force reflow so the restarted CSS animation actually replays
    var activeSeg = segments[index];
    if (activeSeg) {
      // eslint-disable-next-line no-unused-expressions
      void activeSeg.offsetWidth;
      activeSeg.classList.add("is-active");
    }
  }

  function goTo(index, opts) {
    opts = opts || {};
    var clamped = ((index % slides.length) + slides.length) % slides.length;
    current = clamped;
    scrollToIndex(clamped, opts.smooth !== false);
    setActiveSegment(clamped);
  }

  // Advance when the active segment's fill animation completes
  segments.forEach(function (seg, i) {
    var fill = seg.querySelector(".review-progress-fill");
    if (!fill) return;
    fill.addEventListener("animationend", function () {
      if (!seg.classList.contains("is-active") || !inView || reduced) return;
      goTo(current + 1);
    });
  });

  // Manual controls reset the cycle
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
    });
  }

  // Manual swipe on mobile also resyncs the progress bar. Debounced so
  // this doesn't fight goTo()'s own smooth-scroll animation mid-flight.
  var scrollSettleTimer = null;
  track.addEventListener(
    "scroll",
    function () {
      if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer);
      scrollSettleTimer = window.setTimeout(function () {
        var idx = currentIndexFromScroll();
        if (idx !== current) {
          current = idx;
          setActiveSegment(idx);
        }
      }, 120);
    },
    { passive: true }
  );

  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  // Only autoplay while the section is actually visible on screen
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
        });
      },
      { threshold: 0.4 }
    );
    io.observe(feature);
  }

  if (reduced) {
    // No autoplay for reduced-motion users; static first segment only.
    segments.forEach(function (seg, i) {
      seg.classList.toggle("is-done", i === 0 ? false : false);
    });
    segments[0] && segments[0].classList.add("is-active");
  } else {
    setActiveSegment(0);
  }
})();

/* Littlefield Legal — E4 scroll reveal */
(function () {
  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    nodes.forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  nodes.forEach(function (el) {
    observer.observe(el);
  });
})();

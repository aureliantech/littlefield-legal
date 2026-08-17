/* Littlefield Legal — FAQ / objections accordion.
   Each item opens independently (opening one never closes another),
   so a visitor comparing two answers doesn't lose their place. */
(function () {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!btn || !answer) return;

    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        item.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
      } else {
        item.setAttribute("aria-expanded", "true");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* Keep open items sized correctly if the viewport changes
     (e.g. rotating a phone, or a font finishing its load). */
  window.addEventListener("resize", function () {
    document.querySelectorAll('.faq-item[aria-expanded="true"] .faq-a').forEach(function (answer) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    });
  });
})();

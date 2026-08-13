/* Littlefield Legal — homepage practice-area cards + detail dialog */
(function () {
  var grid = document.querySelector(".pa-grid");
  var modal = document.getElementById("pa-modal");
  if (!grid || !modal) return;

  var panel = modal.querySelector(".pa-modal-panel");
  var img = document.getElementById("pa-modal-img");
  var indexEl = document.getElementById("pa-modal-index");
  var titleEl = document.getElementById("pa-modal-title");
  var descEl = document.getElementById("pa-modal-desc");
  var linkEl = document.getElementById("pa-modal-link");
  var closeEls = modal.querySelectorAll("[data-pa-close]");
  var lastTrigger = null;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function openFromCard(card) {
    lastTrigger = card;
    img.src = card.getAttribute("data-pa-img") || "";
    img.alt = card.getAttribute("data-pa-title") || "";
    indexEl.textContent = card.getAttribute("data-pa-index") || "";
    titleEl.textContent = card.getAttribute("data-pa-title") || "";
    descEl.textContent = card.getAttribute("data-pa-desc") || "";
    linkEl.textContent = card.getAttribute("data-pa-link") || "";
    linkEl.href = card.getAttribute("data-pa-href") || "#";

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      modal.classList.add("is-open");
    });
    var closeBtn = modal.querySelector(".pa-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    var finish = function () {
      modal.hidden = true;
    };
    if (reducedMotion()) {
      finish();
    } else {
      setTimeout(finish, 260);
    }
    if (lastTrigger) lastTrigger.focus();
  }

  grid.querySelectorAll(".pa-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openFromCard(card);
    });
  });

  closeEls.forEach(function (el) {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  /* simple focus containment: keep tab cycling inside the panel */
  modal.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || modal.hidden) return;
    var focusable = panel.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* Littlefield Legal — full-screen mega menu */
(function () {
  var menu = document.getElementById("mega-menu");
  var opener = document.querySelector("[data-menu-open]");
  var closers = document.querySelectorAll("[data-menu-close]");
  var panel = menu ? menu.querySelector(".mega-menu__panel") : null;
  if (!menu || !opener || !panel) return;

  var practiceToggle = menu.querySelector("[data-mega-toggle]");
  var practiceList = document.getElementById("mega-practice-list");
  var previewImg = document.getElementById("mega-preview-img");
  var previewCaption = document.getElementById("mega-preview-caption");
  var defaultPreviewImg = previewImg ? previewImg.getAttribute("src") : "";
  var defaultPreviewCaption = previewCaption ? previewCaption.textContent : "";

  var lastFocus = null;

  function isDesktop() {
    return document.body.classList.contains("vp-desktop");
  }

  function isOpen() {
    return menu.classList.contains("is-open");
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    opener.setAttribute("aria-expanded", "true");
    lockScroll(true);
    window.requestAnimationFrame(function () {
      menu.classList.add("is-open");
    });
    var closeBtn = menu.querySelector(".mega-menu__close");
    if (closeBtn) closeBtn.focus();
  }

  var lastMouseX = -1;
  var lastMouseY = -1;
  var closedAtX = null;
  var closedAtY = null;
  var MOVE_THRESHOLD = 6; // px

  document.addEventListener(
    "mousemove",
    function (e) {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    },
    { passive: true }
  );

  function movedSinceClose() {
    if (closedAtX === null) return true;
    return (
      Math.abs(lastMouseX - closedAtX) > MOVE_THRESHOLD ||
      Math.abs(lastMouseY - closedAtY) > MOVE_THRESHOLD
    );
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    opener.setAttribute("aria-expanded", "false");
    lockScroll(false);
    // The close button sits in roughly the same screen corner as the
    // open button, so the cursor is often still resting right on top of
    // it when this runs. Once the overlay is removed, the browser
    // re-hit-tests under the stationary cursor and would otherwise fire
    // pointerenter on the open button again, instantly reopening the
    // menu the user just closed. Require genuine mouse movement first.
    closedAtX = lastMouseX;
    closedAtY = lastMouseY;

    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finish = function () {
      menu.hidden = true;
    };
    if (reduce) {
      finish();
    } else {
      window.setTimeout(finish, 480);
    }

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  opener.addEventListener("click", function () {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  // Desktop: hovering the trigger opens the menu immediately, no click
  // needed. Touch devices don't have real hover, so click stays the
  // primary path there (and remains available on desktop too, for
  // keyboard/assistive-tech activation).
  opener.addEventListener("pointerenter", function (e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    if (!isDesktop() || isOpen()) return;
    if (!movedSinceClose()) return;
    openMenu();
  });

  closers.forEach(function (el) {
    el.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Simple focus containment while open
  menu.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !isOpen()) return;
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

  // —— Practice areas: click/tap toggles the image grid (works everywhere) ——
  if (practiceToggle && practiceList) {
    practiceToggle.addEventListener("click", function () {
      var open = practiceToggle.getAttribute("aria-expanded") === "true";
      practiceToggle.setAttribute("aria-expanded", open ? "false" : "true");
      practiceList.hidden = open;
    });
  }

  // —— Desktop-only: hover swaps the live preview image + caption ——
  function setPreview(imgSrc, caption) {
    if (!previewImg || !previewCaption) return;
    if (imgSrc) previewImg.setAttribute("src", imgSrc);
    if (caption) previewCaption.textContent = caption;
  }

  function resetPreview() {
    setPreview(defaultPreviewImg, defaultPreviewCaption);
  }

  var previewTargets = menu.querySelectorAll(
    "[data-preview-img], .mega-menu__link[data-preview-caption]"
  );
  previewTargets.forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      var img = el.getAttribute("data-preview-img");
      var caption = el.getAttribute("data-preview-caption");
      setPreview(img, caption);
    });
    el.addEventListener("focus", function () {
      if (!isDesktop()) return;
      var img = el.getAttribute("data-preview-img");
      var caption = el.getAttribute("data-preview-caption");
      setPreview(img, caption);
    });
  });

  var nav = menu.querySelector(".mega-menu__nav");
  if (nav) {
    nav.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      resetPreview();
    });
  }
})();

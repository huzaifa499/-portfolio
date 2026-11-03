/* =========================================================
   Huzaifa Usman — Portfolio scripts (vanilla JS, no deps)
   ========================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky / glass navbar ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Floating particles ---------- */
  var host = document.getElementById("particles");
  if (host && !reduced) {
    var count = window.innerWidth < 640 ? 16 : 34;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = 100 + Math.random() * 20 + "%";
      p.style.animationDuration = 14 + Math.random() * 20 + "s";
      p.style.animationDelay = "-" + Math.random() * 26 + "s";
      p.style.opacity = String(0.15 + Math.random() * 0.35);
      var s = 2 + Math.random() * 2.4;
      p.style.width = p.style.height = s.toFixed(1) + "px";
      host.appendChild(p);
    }
  }

  /* ---------- Custom cursor + glow (pointer devices only) ---------- */
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var glow = document.querySelector(".cursor-glow");
  if (!reduced && finePointer) {
    document.body.classList.add("has-custom-cursor");

    var cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="cursor-dot"></span><span class="cursor-ring"></span>';
    document.body.appendChild(cursor);

    var dot = cursor.querySelector(".cursor-dot");
    var ring = cursor.querySelector(".cursor-ring");
    var gx = 0, gy = 0, cx = 0, cy = 0, rx = 0, ry = 0, running = false;
    var hoverSelector = "a, button, .btn, .filter, .chip, label, input, textarea, select, [role='button']";

    function setHoverState(target) {
      var interactive = target && target.closest && target.closest(hoverSelector);
      cursor.classList.toggle("is-hover", !!interactive);
    }

    window.addEventListener("mousemove", function (e) {
      gx = e.clientX;
      gy = e.clientY;
      cursor.classList.add("is-visible");
      cursor.classList.remove("is-hidden");
      setHoverState(e.target);
      if (glow) glow.style.opacity = "1";
      if (!running) { running = true; requestAnimationFrame(loop); }
    });

    window.addEventListener("mousedown", function () { cursor.classList.add("is-click"); });
    window.addEventListener("mouseup", function () { cursor.classList.remove("is-click"); });

    document.addEventListener("mouseleave", function () {
      cursor.classList.add("is-hidden");
      if (glow) glow.style.opacity = "0";
    });

    document.addEventListener("mouseover", function (e) { setHoverState(e.target); });

    function loop() {
      cx += (gx - cx) * 0.55;
      cy += (gy - cy) * 0.55;
      rx += (gx - rx) * 0.18;
      ry += (gy - ry) * 0.18;

      if (dot) {
        dot.style.setProperty("--cx", cx + "px");
        dot.style.setProperty("--cy", cy + "px");
      }
      if (ring) {
        ring.style.setProperty("--rx", rx + "px");
        ring.style.setProperty("--ry", ry + "px");
      }
      if (glow) glow.style.transform = "translate3d(" + (rx - 260) + "px," + (ry - 260) + "px,0)";

      requestAnimationFrame(loop);
    }
  }

  /* ---------- Card hover spotlight ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  /* ---------- Scroll reveal + counters + skill bars ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    if (reduced) { el.textContent = String(target); return; }
    var start = performance.now(), dur = 1300;
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealables = document.querySelectorAll(".reveal, [data-count], .bar i");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("reveal")) el.classList.add("in");
        if (el.hasAttribute("data-count")) animateCounter(el);
        if (el.matches(".bar i")) el.style.width = (el.getAttribute("data-value") || 0) + "%";
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("in");
      if (el.hasAttribute("data-count")) el.textContent = el.getAttribute("data-count");
      if (el.matches(".bar i")) el.style.width = (el.getAttribute("data-value") || 0) + "%";
    });
  }

  /* ---------- Hero role typing effect ---------- */
  var typeEl = document.querySelector("[data-type]");
  if (typeEl) {
    var words = (typeEl.getAttribute("data-type") || "").split("|").filter(Boolean);
    var out = typeEl.querySelector(".type-text");
    if (words.length && out) {
      if (reduced) {
        out.textContent = words[0];
      } else {
        var w = 0, c = 0, deleting = false;
        (function tick() {
          var word = words[w];
          out.textContent = word.slice(0, c);
          if (!deleting && c < word.length) { c++; setTimeout(tick, 62); }
          else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
          else if (c > 0) { c--; setTimeout(tick, 28); }
          else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 320); }
        })();
      }
    }
  }

  /* ---------- Project filtering ---------- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var projects = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filterBar.querySelectorAll(".filter").forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      var want = btn.getAttribute("data-filter");
      projects.forEach(function (card, i) {
        var cats = (card.getAttribute("data-category") || "").split(" ");
        var show = want === "all" || cats.indexOf(want) > -1;
        card.style.transitionDelay = show ? i * 40 + "ms" : "0ms";
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var rules = {
      name: function (v) {
        if (!v) return "Please enter your name.";
        if (v.length < 2) return "Name is too short.";
        if (v.length > 100) return "Name must be under 100 characters.";
        return "";
      },
      email: function (v) {
        if (!v) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) return "Please enter a valid email address.";
        if (v.length > 255) return "Email is too long.";
        return "";
      },
      subject: function (v) {
        if (!v) return "Please add a subject.";
        if (v.length > 150) return "Subject must be under 150 characters.";
        return "";
      },
      message: function (v) {
        if (!v) return "Please write a message.";
        if (v.length < 10) return "Message should be at least 10 characters.";
        if (v.length > 2000) return "Message must be under 2000 characters.";
        return "";
      }
    };

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var msg = rule(field.value.trim());
      var box = form.querySelector('[data-error-for="' + field.name + '"]');
      if (box) box.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }

    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      var ok = true;
      form.querySelectorAll("input, textarea").forEach(function (field) {
        if (!validateField(field)) ok = false;
      });
      if (!ok) {
        e.preventDefault();
        if (status) status.textContent = "Please fix the highlighted fields.";
        var bad = form.querySelector('[aria-invalid="true"]');
        if (bad) bad.focus();
        return;
      }
      // No endpoint configured yet -> fall back to a mailto draft.
      // Set action="https://formspree.io/f/XXXX" on the form to send for real.
      var action = form.getAttribute("action");
      if (!action || action === "#") {
        e.preventDefault();
        var data = new FormData(form);
        var body =
          "Name: " + data.get("name") + "\n" +
          "Email: " + data.get("email") + "\n\n" +
          data.get("message");
        window.location.href =
          "mailto:nico.codess.co@gmail.com?subject=" +
          encodeURIComponent(String(data.get("subject"))) +
          "&body=" + encodeURIComponent(body);
        if (status) status.textContent = "Opening your email app… (connect Formspree/EmailJS to send directly)";
      }
    });
  }

  /* ---------- Smooth page transitions ---------- */
  if (!reduced) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href$=".html"]');
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.getAttribute("aria-current") === "page") return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(function () { window.location.href = a.href; }, 220);
    });
    window.addEventListener("pageshow", function () { document.body.classList.remove("leaving"); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
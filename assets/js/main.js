(function () {
  const WHATSAPP = "94750712100";
  const EMAIL = "sameera.astron@gmail.com";

  // Header style, progress bar and back-to-top on scroll
  const header = document.querySelector(".header");
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    toTop.classList.toggle("is-visible", y > 700);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("navBackdrop");
  backdrop.addEventListener("click", () => setMenu(false));
  const setMenu = (open) => {
    backdrop.hidden = !open;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  // Booking form
  const form = document.getElementById("bookForm");
  const err = document.getElementById("formError");
  const tripSelect = document.getElementById("f-trip");
  const dateInput = document.getElementById("f-date");
  dateInput.min = new Date().toISOString().split("T")[0];

  // "Ask for a Quote" buttons pre-select the trip
  document.querySelectorAll("[data-trip]").forEach((btn) =>
    btn.addEventListener("click", () => { tripSelect.value = btn.dataset.trip; })
  );

  function collect() {
    const d = Object.fromEntries(new FormData(form));
    let ok = true;
    ["name", "trip", "date"].forEach((k) => {
      const el = form.elements[k];
      const bad = !String(d[k] || "").trim();
      el.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) return null;
    const lines = [
      "Hi Sam! I'd like to book a trip.",
      "",
      "Name: " + d.name,
      "Trip: " + d.trip,
      "Date: " + d.date,
      "Travellers: " + (d.people || "-"),
      "Pickup: " + (d.pickup || "-"),
    ];
    if (d.message) lines.push("Notes: " + d.message);
    return { text: lines.join("\n"), trip: d.trip };
  }

  // Open a link in a new tab via a real <a> click (works where window.open is blocked)
  function openLink(url, newTab) {
    const a = document.createElement("a");
    a.href = url;
    if (newTab) { a.target = "_blank"; a.rel = "noopener"; }
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const r = collect();
    if (r) openLink("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(r.text), true);
  });

  document.getElementById("sendEmail").addEventListener("click", () => {
    const r = collect();
    if (r) {
      openLink("mailto:" + EMAIL +
        "?subject=" + encodeURIComponent("Trip booking enquiry: " + r.trip) +
        "&body=" + encodeURIComponent(r.text), false);
    }
  });

  // Highlight the nav link of the section in view
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });
  }

  // Sample-day tabs (keyboard accessible)
  const tabs = [...document.querySelectorAll('.plan__tabs [role="tab"]')];
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) { e.preventDefault(); selectTab(tabs[(i + dir + tabs.length) % tabs.length], true); }
    });
  });

  // Gallery lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("lightboxClose");
  let lastFocus = null;
  const closeLb = () => { lb.hidden = true; lbImg.src = ""; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  document.querySelectorAll(".gallery__item").forEach((fig) => {
    const img = fig.querySelector("img");
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "Enlarge photo: " + img.alt);
    const open = () => {
      lastFocus = fig;
      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = fig.querySelector("figcaption").textContent;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    };
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

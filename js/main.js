/* SmartFlex Solutions — shared site behavior */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initBackToTop();
    initFaqAccordion();
    initContactForm();
    initHeaderShadowOnScroll();
    document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  });

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    var scrim = document.querySelector(".nav-scrim");
    if (!toggle || !links) return;

    function closeNav() {
      toggle.classList.remove("is-open");
      links.classList.remove("is-open");
      scrim && scrim.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openNav() {
      toggle.classList.add("is-open");
      links.classList.add("is-open");
      scrim && scrim.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    scrim && scrim.addEventListener("click", closeNav);
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initHeaderShadowOnScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 6px 24px rgba(7,18,36,0.08)";
      } else {
        header.style.boxShadow = "none";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initActiveNavLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("is-active");
      }
    });
  }

  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });

    // Safety net: guarantee content is visible even if the observer
    // never fires (e.g. unusual embedding contexts).
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }

  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 500);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initFaqAccordion() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".faq-a").style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove("is-open");
          a.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var successBox = document.getElementById("form-success");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      subject: function (v) { return v.trim().length > 0; },
      message: function (v) { return v.trim().length >= 10; },
    };

    function validateField(field) {
      var name = field.name;
      if (!validators[name]) return true;
      var valid = validators[name](field.value);
      var wrapper = field.closest(".field");
      if (wrapper) wrapper.classList.toggle("has-error", !valid);
      return valid;
    }

    form.querySelectorAll("input,textarea").forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
    });

    form.addEventListener("submit", function (e) {
      var fields = form.querySelectorAll("input[name],textarea[name]");
      var allValid = true;
      fields.forEach(function (field) {
        if (validators[field.name] && !validateField(field)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        return;
      }

      // If served on Netlify, the form posts natively via data-netlify.
      // For any other static host, submit via fetch and show inline confirmation.
      if (!window.location.hostname.endsWith("netlify.app") && window.location.hostname !== "smartflex-solutions.com") {
        e.preventDefault();
        successBox && successBox.classList.add("is-visible");
        form.reset();
        successBox && successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();

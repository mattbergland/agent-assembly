(function () {
  "use strict";

  /* ─── Constants ─── */
  const PREFIX = "__dom-tagger";
  const COLORS = {
    paper: "#F5F5F3",
    ink: "#111111",
    inkSoft: "#2A2A2A",
    inkMuted: "#5A5A58",
    lavender: "#8E7DBE",
    lavenderSoft: "#B8ABD9",
    highlight: "rgba(142, 125, 190, 0.12)",
    highlightBorder: "#8E7DBE",
    border: "#E8E8E6",
    white: "#FFFFFF",
  };

  /* ─── State ─── */
  let active = false;
  let hoveredEl = null;
  let tags = [];
  let nextId = 1;

  /* ─── UI Refs ─── */
  let highlightOverlay = null;
  let infoTooltip = null;
  let sidePanel = null;
  let badgeContainer = null;

  /* ─── Message Listener ─── */
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "toggle") {
      active ? deactivate() : activate();
    }
  });

  /* ═══════════════════════════════════════════
     Activate / Deactivate
     ═══════════════════════════════════════════ */

  function activate() {
    active = true;
    createHighlightOverlay();
    createInfoTooltip();
    createBadgeContainer();
    createSidePanel();
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll, true);
    updatePanel();
  }

  function deactivate() {
    active = false;
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", onScroll, true);
    highlightOverlay?.remove();
    highlightOverlay = null;
    infoTooltip?.remove();
    infoTooltip = null;
    sidePanel?.remove();
    sidePanel = null;
    badgeContainer?.remove();
    badgeContainer = null;
    hoveredEl = null;
  }

  /* ═══════════════════════════════════════════
     Event Handlers
     ═══════════════════════════════════════════ */

  function onMouseMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isOwnElement(el)) {
      hideHighlight();
      hideTooltip();
      hoveredEl = null;
      return;
    }
    if (el !== hoveredEl) {
      hoveredEl = el;
      showHighlight(el);
    }
    positionTooltip(el, e.clientX, e.clientY);
  }

  function onClick(e) {
    if (isOwnElement(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (hoveredEl) tagElement(hoveredEl);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") deactivate();
  }

  function onScroll() {
    updateBadges();
  }

  function isOwnElement(el) {
    let cur = el;
    while (cur) {
      if (cur.id && cur.id.startsWith(PREFIX)) return true;
      if (cur.dataset && cur.dataset.domTagger) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  /* ═══════════════════════════════════════════
     Highlight Overlay
     ═══════════════════════════════════════════ */

  function createHighlightOverlay() {
    highlightOverlay = document.createElement("div");
    highlightOverlay.id = PREFIX + "-highlight";
    highlightOverlay.dataset.domTagger = "true";
    setStyles(highlightOverlay, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "2147483640",
      border: "2px solid " + COLORS.highlightBorder,
      backgroundColor: COLORS.highlight,
      borderRadius: "3px",
      transition: "top .08s,left .08s,width .08s,height .08s",
      display: "none",
    });
    document.documentElement.appendChild(highlightOverlay);
  }

  function showHighlight(el) {
    if (!highlightOverlay) return;
    var rect = el.getBoundingClientRect();
    setStyles(highlightOverlay, {
      display: "block",
      top: rect.top + "px",
      left: rect.left + "px",
      width: rect.width + "px",
      height: rect.height + "px",
    });
  }

  function hideHighlight() {
    if (highlightOverlay) highlightOverlay.style.display = "none";
  }

  /* ═══════════════════════════════════════════
     Info Tooltip
     ═══════════════════════════════════════════ */

  function createInfoTooltip() {
    infoTooltip = document.createElement("div");
    infoTooltip.id = PREFIX + "-tooltip";
    infoTooltip.dataset.domTagger = "true";
    setStyles(infoTooltip, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "2147483641",
      backgroundColor: COLORS.ink,
      color: COLORS.paper,
      padding: "5px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontFamily: "'SF Mono',Monaco,Consolas,monospace",
      lineHeight: "1.5",
      maxWidth: "400px",
      display: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap",
    });
    document.documentElement.appendChild(infoTooltip);
  }

  function positionTooltip(el, mx, my) {
    if (!infoTooltip) return;
    var tag = el.tagName.toLowerCase();
    var id = el.id ? "#" + el.id : "";
    var cls =
      el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    var dims = el.getBoundingClientRect();
    var sizeStr = Math.round(dims.width) + " \u00d7 " + Math.round(dims.height);

    infoTooltip.innerHTML =
      '<span style="color:' + COLORS.lavenderSoft + '">&lt;' +
      esc(tag + id + cls) +
      "&gt;</span>" +
      '<span style="color:#999;margin-left:8px">' + sizeStr + "</span>";

    infoTooltip.style.display = "block";
    var tr = infoTooltip.getBoundingClientRect();
    var panelW = sidePanel ? 340 : 0;
    var x = mx + 14;
    var y = my + 14;
    if (x + tr.width > window.innerWidth - panelW - 12) x = mx - tr.width - 10;
    if (y + tr.height > window.innerHeight - 12) y = my - tr.height - 10;
    infoTooltip.style.left = x + "px";
    infoTooltip.style.top = y + "px";
  }

  function hideTooltip() {
    if (infoTooltip) infoTooltip.style.display = "none";
  }

  /* ═══════════════════════════════════════════
     CSS Selector Generator
     ═══════════════════════════════════════════ */

  function getSelector(el) {
    if (el.id) return "#" + CSS.escape(el.id);

    var path = [];
    var cur = el;

    while (cur && cur !== document.body && cur !== document.documentElement) {
      var seg = cur.tagName.toLowerCase();

      if (cur.id) {
        path.unshift("#" + CSS.escape(cur.id));
        break;
      }

      if (cur.className && typeof cur.className === "string") {
        var classes = cur.className
          .trim()
          .split(/\s+/)
          .filter(function (c) {
            return !c.startsWith(PREFIX) && c.length < 50;
          })
          .slice(0, 3);
        if (classes.length) seg += "." + classes.map(CSS.escape).join(".");
      }

      var parent = cur.parentElement;
      if (parent) {
        var sameTag = Array.from(parent.children).filter(function (s) {
          return s.tagName === cur.tagName && s !== cur;
        });
        if (sameTag.length > 0) {
          var idx = Array.from(parent.children).indexOf(cur) + 1;
          seg += ":nth-child(" + idx + ")";
        }
      }

      path.unshift(seg);
      cur = cur.parentElement;

      if (path.length >= 1) {
        var test = path.join(" > ");
        try {
          if (document.querySelectorAll(test).length === 1) break;
        } catch (_) {
          /* ignore */
        }
      }
      if (path.length > 6) break;
    }

    return path.join(" > ") || el.tagName.toLowerCase();
  }

  function getDomPath(el) {
    var path = [];
    var cur = el;
    while (cur && cur !== document.documentElement) {
      var tag = cur.tagName.toLowerCase();
      var id = cur.id ? "#" + cur.id : "";
      var cls =
        cur.className && typeof cur.className === "string"
          ? "." + cur.className.trim().split(/\s+/).slice(0, 2).join(".")
          : "";
      path.unshift(tag + id + cls);
      cur = cur.parentElement;
    }
    return path.join(" > ");
  }

  /* ═══════════════════════════════════════════
     Tagging
     ═══════════════════════════════════════════ */

  function tagElement(el) {
    if (tags.find(function (t) { return t.element === el; })) return;

    var rect = el.getBoundingClientRect();
    var tag = {
      id: nextId++,
      element: el,
      selector: getSelector(el),
      domPath: getDomPath(el),
      tagName: el.tagName.toLowerCase(),
      elId: el.id || "",
      classes: typeof el.className === "string" ? el.className.trim() : "",
      text: (el.textContent || "").trim().substring(0, 120),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      label: "",
    };

    tags.push(tag);
    updateBadges();
    updatePanel();
  }

  function removeTag(tagId) {
    tags = tags.filter(function (t) { return t.id !== tagId; });
    updateBadges();
    updatePanel();
  }

  function clearAllTags() {
    tags = [];
    updateBadges();
    updatePanel();
  }

  /* ═══════════════════════════════════════════
     Badges
     ═══════════════════════════════════════════ */

  function createBadgeContainer() {
    badgeContainer = document.createElement("div");
    badgeContainer.id = PREFIX + "-badges";
    badgeContainer.dataset.domTagger = "true";
    setStyles(badgeContainer, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "2147483639",
    });
    document.documentElement.appendChild(badgeContainer);
  }

  function updateBadges() {
    if (!badgeContainer) return;
    badgeContainer.innerHTML = "";

    tags.forEach(function (tag, i) {
      var rect = tag.element.getBoundingClientRect();

      // Dashed border around tagged element
      var border = document.createElement("div");
      border.dataset.domTagger = "true";
      setStyles(border, {
        position: "fixed",
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        border: "2px dashed " + COLORS.lavender,
        borderRadius: "3px",
        pointerEvents: "none",
        opacity: "0.5",
      });
      badgeContainer.appendChild(border);

      // Numbered badge
      var badge = document.createElement("div");
      badge.dataset.domTagger = "true";
      setStyles(badge, {
        position: "fixed",
        top: Math.max(0, rect.top - 10) + "px",
        left: Math.max(0, rect.left - 10) + "px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: COLORS.lavender,
        color: "#fff",
        fontSize: "11px",
        fontWeight: "600",
        fontFamily: "Inter,system-ui,sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        pointerEvents: "none",
      });
      badge.textContent = String(i + 1);
      badgeContainer.appendChild(badge);
    });
  }

  /* ═══════════════════════════════════════════
     Side Panel
     ═══════════════════════════════════════════ */

  function createSidePanel() {
    sidePanel = document.createElement("div");
    sidePanel.id = PREFIX + "-panel";
    sidePanel.dataset.domTagger = "true";
    setStyles(sidePanel, {
      position: "fixed",
      top: "0",
      right: "0",
      width: "340px",
      height: "100vh",
      backgroundColor: COLORS.white,
      borderLeft: "1px solid " + COLORS.border,
      zIndex: "2147483642",
      fontFamily: "Inter,system-ui,-apple-system,sans-serif",
      display: "flex",
      flexDirection: "column",
      boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
      overflow: "hidden",
    });
    document.documentElement.appendChild(sidePanel);
  }

  function updatePanel() {
    if (!sidePanel) return;

    // Preserve current note values before re-render
    var noteValues = {};
    tags.forEach(function (t) { noteValues[t.id] = t.label; });

    var count = tags.length;
    var html = "";

    // ── Header ──
    html +=
      '<div style="padding:14px 20px;border-bottom:1px solid ' + COLORS.border + ';flex:none;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 22 22">' +
              '<circle cx="5" cy="5" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="11" cy="5" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="17" cy="5" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="5" cy="11" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="11" cy="11" r="1.8" fill="' + COLORS.lavender + '"/>' +
              '<circle cx="17" cy="11" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="5" cy="17" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="11" cy="17" r="1.4" fill="' + COLORS.ink + '"/>' +
              '<circle cx="17" cy="17" r="1.4" fill="' + COLORS.ink + '"/>' +
            "</svg>" +
            '<span style="font-size:13px;font-weight:600;color:' + COLORS.ink + ';letter-spacing:-0.02em;">DOM Tagger</span>' +
          "</div>" +
          '<button data-dom-tagger="true" id="' + PREFIX + '-close" style="' +
            "background:none;border:none;cursor:pointer;padding:4px;color:" + COLORS.inkMuted + ";" +
            'display:flex;align-items:center;border-radius:4px;" title="Close (Esc)">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path d="M18 6L6 18M6 6l12 12"/>' +
            "</svg>" +
          "</button>" +
        "</div>" +
        '<p style="font-size:11px;color:' + COLORS.inkMuted + ';margin:0;line-height:1.4;">' +
          "Click elements to tag them. Press " +
          '<kbd style="background:' + COLORS.paper + ";padding:1px 5px;border-radius:3px;" +
            'font-family:monospace;font-size:10px;border:1px solid ' + COLORS.border + '">Esc</kbd> to close.' +
        "</p>" +
      "</div>";

    // ── Tag list ──
    html += '<div style="flex:1;overflow-y:auto;padding:8px 0;" id="' + PREFIX + '-tag-list">';

    if (count === 0) {
      html +=
        '<div style="padding:48px 20px;text-align:center;">' +
          '<div style="width:48px;height:48px;border-radius:12px;background:' + COLORS.paper + ";" +
            'display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + COLORS.inkMuted + '" stroke-width="1.5">' +
              '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>' +
              '<path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>' +
            "</svg>" +
          "</div>" +
          '<p style="font-size:12px;color:' + COLORS.inkMuted + ';margin:0;line-height:1.5;">' +
            "Hover over elements and click to tag them." +
          "</p>" +
        "</div>";
    } else {
      tags.forEach(function (tag, i) {
        var shortCls = tag.classes
          ? "." + tag.classes.split(" ").slice(0, 2).join(".")
          : "";
        var preview =
          "&lt;" + esc(tag.tagName) +
          (tag.elId ? " #" + esc(tag.elId) : "") +
          esc(shortCls) + "&gt;";
        var textSnip = tag.text ? esc(tag.text.substring(0, 50)) : "";

        html +=
          '<div data-dom-tagger="true" data-tag-id="' + tag.id + '" style="' +
            "padding:10px 20px;border-bottom:1px solid " + COLORS.border + ";cursor:default;" +
          '">' +
            '<div style="display:flex;align-items:flex-start;gap:8px;">' +
              // Badge
              '<span style="flex:none;width:20px;height:20px;border-radius:50%;' +
                "background:" + COLORS.lavender + ";color:#fff;font-size:11px;font-weight:600;" +
                'display:flex;align-items:center;justify-content:center;margin-top:1px;">' +
                (i + 1) +
              "</span>" +
              // Info
              '<div style="flex:1;min-width:0;">' +
                '<code style="display:inline-block;background:' + COLORS.paper + ";padding:1px 6px;border-radius:3px;" +
                  "font-size:11px;font-family:'SF Mono',Monaco,Consolas,monospace;color:" + COLORS.inkSoft + ';">' +
                  preview +
                "</code>" +
                '<div style="font-size:10px;color:' + COLORS.inkMuted + ";margin-top:3px;" +
                  'font-family:monospace;word-break:break-all;line-height:1.4;">' +
                  esc(tag.selector) +
                "</div>" +
                (textSnip
                  ? '<div style="font-size:11px;color:' + COLORS.inkMuted + ";margin-top:2px;" +
                      'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px;">' +
                      "\u201c" + textSnip + "\u201d" +
                    "</div>"
                  : "") +
                '<div style="font-size:10px;color:' + COLORS.inkMuted + ';margin-top:2px;">' +
                  tag.width + " \u00d7 " + tag.height + "px" +
                "</div>" +
                '<input type="text" placeholder="Add a note for Devin\u2026" ' +
                  'data-dom-tagger="true" data-note-for="' + tag.id + '" ' +
                  'value="' + escAttr(tag.label) + '" ' +
                  'style="width:100%;margin-top:6px;padding:5px 8px;font-size:11px;' +
                    "border:1px solid " + COLORS.border + ";border-radius:5px;" +
                    "background:" + COLORS.paper + ";color:" + COLORS.ink + ";" +
                    'font-family:Inter,system-ui,sans-serif;outline:none;box-sizing:border-box;"/>' +
              "</div>" +
              // Remove button
              '<button data-dom-tagger="true" data-remove-tag="' + tag.id + '" style="' +
                "flex:none;background:none;border:none;cursor:pointer;padding:2px;" +
                "color:" + COLORS.inkMuted + ';opacity:0.4;" title="Remove">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                  '<path d="M18 6L6 18M6 6l12 12"/>' +
                "</svg>" +
              "</button>" +
            "</div>" +
          "</div>";
      });
    }

    html += "</div>";

    // ── Footer buttons ──
    var disabledStyle = count === 0 ? "opacity:0.4;pointer-events:none;" : "";
    html +=
      '<div style="padding:12px 20px;border-top:1px solid ' + COLORS.border + ';flex:none;display:flex;gap:8px;">' +
        '<button data-dom-tagger="true" id="' + PREFIX + '-copy" style="' +
          "flex:1;padding:8px 12px;font-size:12px;font-weight:500;" +
          "background:" + COLORS.ink + ";color:" + COLORS.paper + ";border:none;" +
          "border-radius:6px;cursor:pointer;font-family:Inter,system-ui,sans-serif;" +
          "letter-spacing:-0.01em;" + disabledStyle + '">Copy for Devin</button>' +
        '<button data-dom-tagger="true" id="' + PREFIX + '-clear" style="' +
          "padding:8px 12px;font-size:12px;font-weight:500;" +
          "background:" + COLORS.paper + ";color:" + COLORS.inkMuted + ";border:1px solid " + COLORS.border + ";" +
          "border-radius:6px;cursor:pointer;font-family:Inter,system-ui,sans-serif;" +
          disabledStyle + '">Clear</button>' +
      "</div>";

    sidePanel.innerHTML = html;
    attachPanelListeners();
  }

  function attachPanelListeners() {
    if (!sidePanel) return;

    var closeBtn = sidePanel.querySelector("#" + PREFIX + "-close");
    if (closeBtn) closeBtn.onclick = deactivate;

    var copyBtn = sidePanel.querySelector("#" + PREFIX + "-copy");
    if (copyBtn) copyBtn.onclick = copyForDevin;

    var clearBtn = sidePanel.querySelector("#" + PREFIX + "-clear");
    if (clearBtn) clearBtn.onclick = clearAllTags;

    sidePanel.querySelectorAll("[data-remove-tag]").forEach(function (btn) {
      btn.onclick = function () {
        removeTag(parseInt(btn.dataset.removeTag, 10));
      };
    });

    sidePanel.querySelectorAll("[data-note-for]").forEach(function (input) {
      var tagId = parseInt(input.dataset.noteFor, 10);
      input.oninput = function () {
        var tag = tags.find(function (t) { return t.id === tagId; });
        if (tag) tag.label = input.value;
      };
      input.onclick = function (e) { e.stopPropagation(); };
      input.onmousedown = function (e) { e.stopPropagation(); };
    });

    // Hover-to-highlight from panel
    sidePanel.querySelectorAll("[data-tag-id]").forEach(function (item) {
      item.onmouseenter = function () {
        var tagId = parseInt(item.dataset.tagId, 10);
        var tag = tags.find(function (t) { return t.id === tagId; });
        if (tag && tag.element) showHighlight(tag.element);
      };
      item.onmouseleave = function () {
        hideHighlight();
      };
    });
  }

  /* ═══════════════════════════════════════════
     Copy for Devin
     ═══════════════════════════════════════════ */

  function copyForDevin() {
    if (tags.length === 0) return;

    var out = "## DOM Element References\n\n";
    out += "Page: " + window.location.href + "\n\n";

    tags.forEach(function (tag, i) {
      var rect = tag.element.getBoundingClientRect();
      var label = tag.label || tag.tagName + (tag.elId ? "#" + tag.elId : "");

      out += "### " + (i + 1) + ". " + label + "\n";
      out += "- **Selector**: `" + tag.selector + "`\n";
      out +=
        "- **Element**: `<" + tag.tagName +
        (tag.elId ? ' id="' + tag.elId + '"' : "") +
        (tag.classes
          ? ' class="' +
            tag.classes.split(" ").slice(0, 5).join(" ") +
            (tag.classes.split(" ").length > 5 ? " ..." : "") +
            '"'
          : "") +
        ">`\n";
      out += "- **Path**: `" + tag.domPath + "`\n";
      if (tag.text) out += '- **Text**: "' + tag.text.substring(0, 100) + '"\n';
      out +=
        "- **Dimensions**: " +
        Math.round(rect.width) + " \u00d7 " + Math.round(rect.height) +
        "px at (" + Math.round(rect.left) + ", " + Math.round(rect.top) + ")\n";
      if (tag.label) out += '- **Note**: "' + tag.label + '"\n';
      out += "\n";
    });

    navigator.clipboard.writeText(out).then(function () {
      var btn = sidePanel ? sidePanel.querySelector("#" + PREFIX + "-copy") : null;
      if (!btn) return;
      btn.textContent = "Copied!";
      btn.style.background = COLORS.lavender;
      setTimeout(function () {
        btn.textContent = "Copy for Devin";
        btn.style.background = COLORS.ink;
      }, 1500);
    });
  }

  /* ═══════════════════════════════════════════
     Utilities
     ═══════════════════════════════════════════ */

  function setStyles(el, styles) {
    for (var key in styles) el.style[key] = styles[key];
  }

  function esc(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function escAttr(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();

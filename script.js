/*
  Simple, lovable Valentine flow.
  - No frameworks.
  - Works offline (except Google Fonts + optional audio).
*/

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  screen: "start",
  herName: "Darshana",
  yourName: "Mehal",
  timeline: [
    {
      title: "2025: maxa moments",
      text: "Laughs, silence, chaos, calm — sab kuch. We didn’t just spend time saath mein, we lived it together.",
    },
    {
      title: "Growth + babuship",
      text: "We levelled up in careers, in life, and in us. Days tested us, but we stood strong, understood each other, and still had fun.",
    },
    {
      title: "Noida, same space",
      text: "Same society, same space — our secret wish. Not just less distance… it’s living it: khana, kahi jana, everything. April 25 = 4 years soon.",
    },
  ],
  yayLine: "I choose you — every year, every day, always.",
  noCount: 0,
  musicOn: false,
};

function loadFromHash() {
  try {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return;
    const params = new URLSearchParams(hash);

  // Names are intentionally fixed for this site.

  // Customization via URL hash has been removed to keep the experience fixed and simple.
  void params;
  } catch {
    // ignore
  }
}

function safeText(s) {
  return String(s ?? "").replace(/[<>]/g, "").trim().slice(0, 140);
}

function setScreen(name) {
  state.screen = name;
  qsa(".screen").forEach((el) => el.classList.remove("is-active"));
  const next = qs(`.screen[data-screen="${name}"]`);
  if (next) next.classList.add("is-active");

  // reset bits when entering some screens
  if (name === "question") {
    state.noCount = 0;
    qs("#noHint").textContent = "";
    placeNoButtonReset();
  }

  render();
}

function renderTimeline() {
  // Timeline is authored directly in index.html.
  // We intentionally do not overwrite it here.
}

function render() {
  qs("#herName").textContent = state.herName;
  qs("#yourName").textContent = state.yourName;
  qs("#yayLine").textContent = state.yayLine;

  renderTimeline();

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
  qs("#today").textContent = today;
}

function openDialog(d) {
  if (typeof d.showModal === "function") d.showModal();
}

function initDialogs() {
  // No dialogs needed now (customization removed).
}

function persistHash() {
  // No longer used (customization removed).
}

function initNav() {
  qs("#beginBtn").addEventListener("click", () => setScreen("journey"));

  qsa("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => setScreen(btn.getAttribute("data-goto")));
  });

  qsa("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => setScreen("start"));
  });
}

function placeNoButtonReset() {
  const row = qs("#choiceRow");
  const noBtn = qs("#noBtn");
  // Reset to inline-ish default.
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  row.style.minHeight = "unset";
}

function initNoButton() {
  const row = qs("#choiceRow");
  const noBtn = qs("#noBtn");

  noBtn.addEventListener("mouseenter", () => jiggleNo("mouse"));
  noBtn.addEventListener("focus", () => jiggleNo("focus"));
  noBtn.addEventListener("click", () => jiggleNo("click"));

  function jiggleNo(source) {
    state.noCount += 1;
    const hint = qs("#noHint");

    const messages = [
  "Dibbi… ye wala button galat lag raha hai 🫢",
  "Babu… ‘No’ toh tumpe suit hi nahi karta.",
  "Plot twist: the universe says ‘YES’.",
  "Nice try, Dibbu. I’m still asking.",
  "Ok bas bas. Say yes?",
    ];
    hint.textContent = messages[Math.min(state.noCount - 1, messages.length - 1)];

    // On mobile, mouseenter won’t happen, so do a little move on focus/click.
    if (state.noCount >= 1) {
      const card = qs("#card");
      const rect = card.getBoundingClientRect();

      const pad = 22;
      const maxX = Math.max(0, rect.width - pad * 2 - noBtn.offsetWidth);
      const maxY = Math.max(0, rect.height - pad * 2 - noBtn.offsetHeight);

      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);

      row.style.minHeight = "110px";
      noBtn.style.position = "absolute";
      noBtn.style.left = `${pad + x}px`;
      noBtn.style.top = `${pad + y}px`;

      // ensure the container is positioning context
      row.style.position = "relative";
    }

    if (source === "click" && state.noCount >= 4) {
  hint.textContent = "Ok. I’m taking that as a very shy YES, babu.";
      setTimeout(() => setScreen("yay"), 550);
    }
  }
}

function initYesButton() {
  qs("#yesBtn").addEventListener("click", () => {
    popConfetti();
    setScreen("yay");
  });

  qs("#replayBtn").addEventListener("click", () => {
    setScreen("start");
  });
}

function popConfetti() {
  const container = qs('.screen[data-screen="yay"]');
  const confettiLayer = qs(".confetti", container);
  confettiLayer.innerHTML = "";

  const colors = ["#ff2d73", "#ff6aa3", "#ffffff", "#ffd1e1", "#7c3aed"]; // tiny purple accent
  const pieces = 120;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce) return;

  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("i");
    el.className = "conf";
    const size = 6 + Math.random() * 8;
    el.style.width = `${size}px`;
    el.style.height = `${size * 0.6}px`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${-10 - Math.random() * 30}px`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.animationDelay = `${Math.random() * 0.2}s`;
    el.style.animationDuration = `${1.2 + Math.random() * 1.2}s`;
    confettiLayer.appendChild(el);
  }

  // Inject style once
  if (!qs("#confettiStyle")) {
    const s = document.createElement("style");
    s.id = "confettiStyle";
    s.textContent = `
      .confetti{position:absolute; inset:0; overflow:hidden}
      .conf{position:absolute; border-radius:3px; opacity:.92; filter: drop-shadow(0 4px 6px rgba(0,0,0,.12));
            animation-name: fall; animation-timing-function: cubic-bezier(.2,.7,.2,1); animation-fill-mode: both;}
      @keyframes fall{to{transform: translateY(120vh) rotate(520deg); opacity:.98}}
    `;
    document.head.appendChild(s);
  }
}

function initShare() {
  qs("#shareBtn").addEventListener("click", async () => {
    persistHash();
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      qs("#shareBtn").textContent = "Copied!";
      setTimeout(() => (qs("#shareBtn").textContent = "Copy link"), 950);
    } catch {
      // fallback: prompt
      window.prompt("Copy this link:", url);
    }
  });
}

function initMusic() {
  const audio = qs("#bgm");
  const btn = qs("#toggleMusic");
  const label = qs("#musicLabel");

  const canPlayFile = async () => {
    if (!audio) return false;
    const srcAttr = audio.querySelector("source")?.getAttribute("src") || "";
    if (!srcAttr) return false;

    try {
      audio.muted = false;
      audio.volume = 0.9;
      audio.load();

      if (audio.readyState >= 1) return true;

      await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("timeout")), 800);
        const onOk = () => {
          cleanup();
          resolve(true);
        };
        const onErr = () => {
          cleanup();
          reject(new Error("error"));
        };
        const cleanup = () => {
          clearTimeout(t);
          audio.removeEventListener("loadedmetadata", onOk);
          audio.removeEventListener("canplay", onOk);
          audio.removeEventListener("error", onErr);
        };
        audio.addEventListener("loadedmetadata", onOk, { once: true });
        audio.addEventListener("canplay", onOk, { once: true });
        audio.addEventListener("error", onErr, { once: true });
      });

      void srcAttr;
      return true;
    } catch {
      return false;
    }
  };

  function update() {
    label.textContent = `Music: ${state.musicOn ? "On" : "Off"}`;
    btn.setAttribute("aria-pressed", String(state.musicOn));
  }

  btn.addEventListener("click", async () => {
    try {
      if (!state.musicOn) {
        const ok = await canPlayFile();
        if (!ok) {
          state.musicOn = false;
          label.textContent = "Music: Add an mp3";
          return;
        }

        await audio.play();
        state.musicOn = true;
      } else {
        audio.pause();
        state.musicOn = false;
      }
    } catch {
      // autoplay restrictions—ignore
      audio.pause();
      state.musicOn = false;
    }
    update();
  });

  update();
}

function init() {
  loadFromHash();
  render();
  initDialogs();
  initNav();
  initNoButton();
  initYesButton();
  initShare();
  initMusic();

  // allow deep-link via hash (? not used to avoid server config)
  setScreen("start");
}

document.addEventListener("DOMContentLoaded", init);

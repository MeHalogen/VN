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

    const h = params.get("h");
    const y = params.get("y");
    if (h) state.herName = safeText(h);
    if (y) state.yourName = safeText(y);

    const m1t = params.get("m1t");
    const m1b = params.get("m1b");
    const m2t = params.get("m2t");
    const m2b = params.get("m2b");
    const m3t = params.get("m3t");
    const m3b = params.get("m3b");
    const yay = params.get("yay");

    if (m1t || m1b || m2t || m2b || m3t || m3b) {
      state.timeline = [
        { title: safeText(m1t || state.timeline[0].title), text: safeText(m1b || state.timeline[0].text) },
        { title: safeText(m2t || state.timeline[1].title), text: safeText(m2b || state.timeline[1].text) },
        { title: safeText(m3t || state.timeline[2].title), text: safeText(m3b || state.timeline[2].text) },
      ];
    }

    if (yay) state.yayLine = safeText(yay);
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
  const tl = qs("#timeline");
  const items = tl.querySelectorAll(".moment");
  state.timeline.forEach((m, i) => {
    const item = items[i];
    if (!item) return;
    qs(".moment__title", item).textContent = m.title;
    qs(".moment__text", item).textContent = m.text;
  });
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
  const nameModal = qs("#nameModal");
  const herNameInput = qs("#herNameInput");
  const yourNameInput = qs("#yourNameInput");

  qs("#setNameBtn").addEventListener("click", () => {
    herNameInput.value = state.herName === "My Love" ? "" : state.herName;
    yourNameInput.value = state.yourName === "Me" ? "" : state.yourName;
    openDialog(nameModal);
  });

  qs("#saveNamesBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const hn = safeText(herNameInput.value) || "My Love";
    const yn = safeText(yourNameInput.value) || "Me";
    state.herName = hn;
    state.yourName = yn;
    nameModal.close();
    render();
    persistHash();
  });

  const customModal = qs("#customModal");
  const fields = {
    m1t: qs("#m1t"),
    m1b: qs("#m1b"),
    m2t: qs("#m2t"),
    m2b: qs("#m2b"),
    m3t: qs("#m3t"),
    m3b: qs("#m3b"),
    yay: qs("#yayCustom"),
  };

  qs("#customizeBtn").addEventListener("click", () => {
    fields.m1t.value = state.timeline[0].title;
    fields.m1b.value = state.timeline[0].text;
    fields.m2t.value = state.timeline[1].title;
    fields.m2b.value = state.timeline[1].text;
    fields.m3t.value = state.timeline[2].title;
    fields.m3b.value = state.timeline[2].text;
    fields.yay.value = state.yayLine;
    openDialog(customModal);
  });

  qs("#saveCustomBtn").addEventListener("click", (e) => {
    e.preventDefault();
    state.timeline = [
      { title: safeText(fields.m1t.value) || state.timeline[0].title, text: safeText(fields.m1b.value) || state.timeline[0].text },
      { title: safeText(fields.m2t.value) || state.timeline[1].title, text: safeText(fields.m2b.value) || state.timeline[1].text },
      { title: safeText(fields.m3t.value) || state.timeline[2].title, text: safeText(fields.m3b.value) || state.timeline[2].text },
    ];
    state.yayLine = safeText(fields.yay.value) || state.yayLine;
    customModal.close();
    render();
    persistHash();
  });
}

function persistHash() {
  // Keep it sharable without a backend.
  const params = new URLSearchParams();
  if (state.herName && state.herName !== "Darshana") params.set("h", state.herName);
  if (state.yourName && state.yourName !== "Mehal") params.set("y", state.yourName);

  // Only persist timeline if user customized away from defaults.
  const def = [
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
  ];

  const changed = state.timeline.some((m, i) => m.title !== def[i].title || m.text !== def[i].text);
  if (changed) {
    params.set("m1t", state.timeline[0].title);
    params.set("m1b", state.timeline[0].text);
    params.set("m2t", state.timeline[1].title);
    params.set("m2b", state.timeline[1].text);
    params.set("m3t", state.timeline[2].title);
    params.set("m3b", state.timeline[2].text);
  }

  if (state.yayLine !== "I choose you — every year, every day, always.") params.set("yay", state.yayLine);

  const nextHash = params.toString();
  history.replaceState(null, "", nextHash ? `#${nextHash}` : location.pathname + location.search);
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

  function update() {
    label.textContent = `Music: ${state.musicOn ? "On" : "Off"}`;
    btn.setAttribute("aria-pressed", String(state.musicOn));
  }

  btn.addEventListener("click", async () => {
    try {
      if (!state.musicOn) {
  // If there's no source file, don't try to play.
  const hasSrc = !!audio.currentSrc || !!audio.querySelector("source")?.getAttribute("src");
  if (!hasSrc) throw new Error("No audio source");
        await audio.play();
        state.musicOn = true;
      } else {
        audio.pause();
        state.musicOn = false;
      }
    } catch {
      // autoplay restrictions—ignore
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

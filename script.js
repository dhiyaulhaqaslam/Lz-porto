const screen = document.getElementById("screen");
const setupStage = document.getElementById("setupStage");
const bootSequence = document.getElementById("bootSequence");
const bootStatus = document.getElementById("bootStatus");
const typingIcon = document.getElementById("typingIcon");
const bootLogo = document.getElementById("bootLogo");
const bootProgressBar = document.getElementById("bootProgressBar");
const powerLed = document.getElementById("powerLed");
const bootPanel = bootSequence?.querySelector(".boot-panel");
const lockScreen = document.getElementById("lockScreen");
const lockForm = document.getElementById("lockForm");
const passwordInput = document.getElementById("passwordInput");
const passwordMessage = document.getElementById("passwordMessage");
const desktopView = document.getElementById("desktopView");
const workspaceView = document.getElementById("workspaceView");
const desktopFolderButtons = Array.from(
  document.querySelectorAll(".desktop-folder-btn")
);
const backToDesktopBtn = document.getElementById("backToDesktopBtn");
const panels = Array.from(document.querySelectorAll(".panel"));
const clock = document.getElementById("clock");
const sectionTitle = document.getElementById("sectionTitle");
const aboutTabButtons = Array.from(document.querySelectorAll(".about-tab-btn"));
const aboutTabContents = Array.from(document.querySelectorAll(".about-tab-content"));
const projectFolderView = document.getElementById("projectFolderView");
const projectDetailView = document.getElementById("projectDetailView");
const keyboardProp = document.getElementById("keyboardProp");
const keyboardVisual = document.getElementById("keyboardVisual");
const projectFolderButtons = Array.from(
  document.querySelectorAll(".project-folder-btn")
);
const projectDetailCards = Array.from(
  document.querySelectorAll(".project-card-detail")
);
const backToProjectFoldersBtn = document.getElementById("backToProjectFoldersBtn");
const projectImages = Array.from(document.querySelectorAll(".project-image"));

const OPEN_ANIMATION_MS = 740;
const CLOSE_ANIMATION_MS = 560;
const SPLASH_SCREEN_MS = 5500;
const CAMERA_APPROACH_MS = 4000;
const BOOT_ANIMATION_MS = SPLASH_SCREEN_MS - CAMERA_APPROACH_MS;
const SCREEN_ENTRY_LEAD_MS = 320;
const KEYBOARD_FLASH_MS = 380;
const KEYBOARD_AURA_MS = 180;
const PORTFOLIO_PASSWORD = "elzeyporto";
const UNLOCK_TRANSITION_MS = 360;
const PASSWORD_FOCUS_DELAY_MS = 90;

const KEYBOARD_LAYOUT = [
  [
    { label: "Esc", codes: ["Escape"], width: "mod" },
    { label: "~", codes: ["Backquote"] },
    { label: "1", codes: ["Digit1", "Numpad1"] },
    { label: "2", codes: ["Digit2", "Numpad2"] },
    { label: "3", codes: ["Digit3", "Numpad3"] },
    { label: "4", codes: ["Digit4", "Numpad4"] },
    { label: "5", codes: ["Digit5", "Numpad5"] },
    { label: "6", codes: ["Digit6", "Numpad6"] },
    { label: "7", codes: ["Digit7", "Numpad7"] },
    { label: "8", codes: ["Digit8", "Numpad8"] },
    { label: "9", codes: ["Digit9", "Numpad9"] },
    { label: "0", codes: ["Digit0", "Numpad0"] },
    { label: "-", codes: ["Minus", "NumpadSubtract"] },
    { label: "=", codes: ["Equal", "NumpadAdd"] },
    { label: "Bksp", codes: ["Backspace"], width: "backspace" },
  ],
  [
    { label: "Tab", codes: ["Tab"], width: "wide" },
    { label: "Q", codes: ["KeyQ"] },
    { label: "W", codes: ["KeyW"] },
    { label: "E", codes: ["KeyE"] },
    { label: "R", codes: ["KeyR"] },
    { label: "T", codes: ["KeyT"] },
    { label: "Y", codes: ["KeyY"] },
    { label: "U", codes: ["KeyU"] },
    { label: "I", codes: ["KeyI"] },
    { label: "O", codes: ["KeyO"] },
    { label: "P", codes: ["KeyP"] },
    { label: "[", codes: ["BracketLeft"] },
    { label: "]", codes: ["BracketRight"] },
    { label: "\\", codes: ["Backslash"], width: "wide" },
  ],
  [
    { label: "Caps", codes: ["CapsLock"], width: "caps" },
    { label: "A", codes: ["KeyA"] },
    { label: "S", codes: ["KeyS"] },
    { label: "D", codes: ["KeyD"] },
    { label: "F", codes: ["KeyF"] },
    { label: "G", codes: ["KeyG"] },
    { label: "H", codes: ["KeyH"] },
    { label: "J", codes: ["KeyJ"] },
    { label: "K", codes: ["KeyK"] },
    { label: "L", codes: ["KeyL"] },
    { label: ";", codes: ["Semicolon"] },
    { label: "'", codes: ["Quote"] },
    { label: "Enter", codes: ["Enter", "NumpadEnter"], width: "enter" },
  ],
  [
    { label: "Shift", codes: ["ShiftLeft", "ShiftRight"], width: "shift" },
    { label: "Z", codes: ["KeyZ"] },
    { label: "X", codes: ["KeyX"] },
    { label: "C", codes: ["KeyC"] },
    { label: "V", codes: ["KeyV"] },
    { label: "B", codes: ["KeyB"] },
    { label: "N", codes: ["KeyN"] },
    { label: "M", codes: ["KeyM"] },
    { label: ",", codes: ["Comma"] },
    { label: ".", codes: ["Period", "NumpadDecimal"] },
    { label: "/", codes: ["Slash", "NumpadDivide"] },
    { label: "Up", codes: ["ArrowUp"], width: "mod" },
  ],
  [
    { label: "Ctrl", codes: ["ControlLeft", "ControlRight"], width: "mod" },
    { label: "Alt", codes: ["AltLeft", "AltRight"], width: "mod" },
    { label: "Win", codes: ["MetaLeft", "MetaRight"], width: "mod" },
    { label: "Space", codes: ["Space"], width: "space" },
    { label: "Lf", codes: ["ArrowLeft"], width: "mod" },
    { label: "Dn", codes: ["ArrowDown"], width: "mod" },
    { label: "Rt", codes: ["ArrowRight"], width: "mod" },
  ],
];

const KEYBOARD_FLASH_PALETTE = [
  "123, 147, 255",
  "99, 230, 196",
  "255, 190, 92",
  "255, 130, 162",
  "122, 223, 255",
];

const keyboardKeysByCode = new Map();
const activePhysicalKeyboardCodes = new Map();
const activeKeyboardElements = new Map();
const keyboardFlashTimers = new Map();

let keyboardAuraTimer = 0;
let isPortfolioUnlocked = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setLockMessage(message = "", state = "") {
  if (!passwordMessage) return;

  passwordMessage.textContent = message;

  if (state) {
    passwordMessage.dataset.state = state;
    return;
  }

  delete passwordMessage.dataset.state;
}

function focusPasswordField(delay = 0) {
  if (!passwordInput) return;

  window.setTimeout(() => {
    passwordInput.focus({ preventScroll: true });
  }, delay);
}

function showLockScreen() {
  if (!screen || !lockScreen || isPortfolioUnlocked) return;

  screen.classList.add("locked");
  screen.classList.remove("unlocked");
  lockScreen.classList.add("active");
  lockScreen.classList.remove("unlocking", "shake");
  lockScreen.setAttribute("aria-hidden", "false");
  desktopView?.setAttribute("aria-hidden", "true");

  if (passwordInput) {
    passwordInput.value = "";
  }

  setLockMessage("");
  focusPasswordField(PASSWORD_FOCUS_DELAY_MS);
}

function unlockPortfolio() {
  if (!screen || !lockScreen || isPortfolioUnlocked) return;

  isPortfolioUnlocked = true;
  setLockMessage("Access granted.", "success");
  lockScreen.classList.remove("shake");
  lockScreen.classList.add("unlocking");
  passwordInput?.blur();

  const unlockDelay = prefersReducedMotion() ? 0 : UNLOCK_TRANSITION_MS;

  window.setTimeout(() => {
    screen.classList.remove("locked");
    screen.classList.add("unlocked");
    lockScreen.classList.remove("active", "unlocking");
    lockScreen.setAttribute("aria-hidden", "true");
    desktopView?.setAttribute("aria-hidden", "false");

    if (passwordInput) {
      passwordInput.value = "";
    }

    setLockMessage("");
  }, unlockDelay);
}

function handleUnlockSubmit(event) {
  event.preventDefault();

  if (!passwordInput) return;

  if (passwordInput.value === PORTFOLIO_PASSWORD) {
    unlockPortfolio();
    return;
  }

  setLockMessage("Incorrect password. Try again.", "error");
  passwordInput.value = "";

  if (lockScreen) {
    lockScreen.classList.remove("shake");
    void lockScreen.offsetWidth;
    lockScreen.classList.add("shake");
  }

  focusPasswordField(40);
}

function buildKeyboardVisualizer() {
  if (!keyboardVisual) return;

  keyboardVisual.innerHTML = "";
  keyboardKeysByCode.clear();

  const fragment = document.createDocumentFragment();

  KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboard-row";

    row.forEach((key, keyIndex) => {
      const keyElement = document.createElement("span");
      keyElement.className = "keyboard-key";
      keyElement.textContent = key.label;

      if (key.width) {
        keyElement.dataset.width = key.width;
      }

      const flashColor =
        KEYBOARD_FLASH_PALETTE[
          (rowIndex * KEYBOARD_FLASH_PALETTE.length + keyIndex) %
            KEYBOARD_FLASH_PALETTE.length
        ];

      keyElement.style.setProperty("--flash-rgb", flashColor);
      rowElement.appendChild(keyElement);

      key.codes.forEach((code) => {
        const mappedKeys = keyboardKeysByCode.get(code) || [];
        mappedKeys.push(keyElement);
        keyboardKeysByCode.set(code, mappedKeys);
      });
    });

    fragment.appendChild(rowElement);
  });

  keyboardVisual.appendChild(fragment);
}

function flashKeyboardElement(keyElement) {
  if (!keyElement) return;

  keyElement.classList.remove("is-flashing");
  void keyElement.offsetWidth;
  keyElement.classList.add("is-flashing");

  const existingTimer = keyboardFlashTimers.get(keyElement);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  const timerId = window.setTimeout(() => {
    keyElement.classList.remove("is-flashing");
    keyboardFlashTimers.delete(keyElement);
  }, KEYBOARD_FLASH_MS);

  keyboardFlashTimers.set(keyElement, timerId);
}

function pulseKeyboardAura() {
  if (!keyboardProp) return;

  keyboardProp.classList.add("is-typing");
  window.clearTimeout(keyboardAuraTimer);

  keyboardAuraTimer = window.setTimeout(() => {
    if (!activeKeyboardElements.size) {
      keyboardProp.classList.remove("is-typing");
    }
  }, KEYBOARD_AURA_MS);
}

function setKeyboardCodeState(code, isActive) {
  const mappedKeys = keyboardKeysByCode.get(code);
  if (!mappedKeys?.length) return;

  mappedKeys.forEach((keyElement) => {
    const currentCount = activeKeyboardElements.get(keyElement) || 0;
    const nextCount = isActive
      ? currentCount + 1
      : Math.max(0, currentCount - 1);

    if (nextCount > 0) {
      activeKeyboardElements.set(keyElement, nextCount);
    } else {
      activeKeyboardElements.delete(keyElement);
    }

    keyElement.classList.toggle("is-active", nextCount > 0);

    if (isActive) {
      flashKeyboardElement(keyElement);
    }
  });

  if (isActive) {
    pulseKeyboardAura();
    return;
  }

  if (!activeKeyboardElements.size) {
    window.setTimeout(() => {
      if (!activeKeyboardElements.size) {
        keyboardProp?.classList.remove("is-typing");
      }
    }, KEYBOARD_AURA_MS);
  }
}

function clearKeyboardVisualizer() {
  activePhysicalKeyboardCodes.clear();
  activeKeyboardElements.forEach((_, keyElement) => {
    keyElement.classList.remove("is-active", "is-flashing");
  });
  activeKeyboardElements.clear();

  keyboardFlashTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  keyboardFlashTimers.clear();

  window.clearTimeout(keyboardAuraTimer);
  keyboardProp?.classList.remove("is-typing");
}

function handleKeyboardVisualizerKeyDown(event) {
  const code = event.code;
  if (!code) return;

  const visualCodes = activePhysicalKeyboardCodes.get(code) || [code];

  if (!activePhysicalKeyboardCodes.has(code)) {
    activePhysicalKeyboardCodes.set(code, visualCodes);
    visualCodes.forEach((visualCode) => setKeyboardCodeState(visualCode, true));
    return;
  }

  if (!event.repeat) return;

  visualCodes.forEach((visualCode) => {
    const mappedKeys = keyboardKeysByCode.get(visualCode);
    mappedKeys?.forEach(flashKeyboardElement);
  });

  pulseKeyboardAura();
}

function handleKeyboardVisualizerKeyUp(event) {
  const code = event.code;
  if (!code) return;

  const visualCodes = activePhysicalKeyboardCodes.get(code) || [code];
  activePhysicalKeyboardCodes.delete(code);

  visualCodes.forEach((visualCode) => setKeyboardCodeState(visualCode, false));
}

function completeBootAnimation() {
  setupStage?.classList.remove("screen-entry", "zooming");
  setupStage?.classList.add("intro-complete");

  bootSequence?.classList.add("hidden");
  screen?.classList.remove("booting");
  screen?.classList.add("booted");
  showLockScreen();
}

function runBootAnimation() {
  if (!bootSequence) return;

  if (prefersReducedMotion()) {
    bootStatus.textContent = "Ready";
    completeBootAnimation();
    return;
  }

  window.setTimeout(() => {
    bootStatus.textContent = "Powering on...";
    powerLed?.classList.add("on");
    bootPanel?.classList.add("on");
    typingIcon?.classList.add("on");
  }, 120);

  window.setTimeout(() => {
    bootStatus.textContent = "Booting system...";
    bootLogo?.classList.add("on");
  }, 540);

  window.setTimeout(() => {
    bootStatus.textContent = "Loading portfolio...";
    bootProgressBar?.classList.add("on");
  }, 980);

  window.setTimeout(() => {
    bootStatus.textContent = "Welcome back.";
  }, 1580);

  window.setTimeout(() => {
    completeBootAnimation();
  }, BOOT_ANIMATION_MS);
}

function runSetupIntro() {
  if (!setupStage || prefersReducedMotion()) {
    setupStage?.classList.add("intro-complete");
    runBootAnimation();
    return;
  }

  setupStage.classList.add("zooming");

  window.setTimeout(() => {
    setupStage.classList.add("screen-entry");
  }, CAMERA_APPROACH_MS - SCREEN_ENTRY_LEAD_MS);

  window.setTimeout(() => {
    runBootAnimation();
  }, CAMERA_APPROACH_MS);
}

function initializeProjectImageFallback() {
  projectImages.forEach((image) => {
    const fallbackSrc = image.dataset.fallbackSrc || "assets/porto.png";

    image.addEventListener("error", () => {
      if (image.src.includes(fallbackSrc)) return;
      image.src = fallbackSrc;
    });

    if (!image.getAttribute("src")) {
      image.src = fallbackSrc;
    }
  });
}

function resetProjectExplorer() {
  if (!projectFolderView || !projectDetailView) return;

  projectFolderView.classList.add("active");
  projectDetailView.classList.remove("active");
  projectDetailView.setAttribute("aria-hidden", "true");

  projectFolderButtons.forEach((button) => {
    button.classList.remove("active");
  });

  projectDetailCards.forEach((card) => {
    card.classList.remove("active");
  });
}

function openProjectDetail(projectId) {
  if (!projectFolderView || !projectDetailView) return;

  projectFolderView.classList.remove("active");
  projectDetailView.classList.add("active");
  projectDetailView.setAttribute("aria-hidden", "false");

  projectFolderButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.projectId === projectId);
  });

  projectDetailCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.projectId === projectId);
  });
}

function setAboutTab(tabName = "tools") {
  aboutTabButtons.forEach((button) => {
    const isActive = button.dataset.aboutTab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  aboutTabContents.forEach((content) => {
    const isActive = content.dataset.aboutContent === tabName;
    content.classList.toggle("active", isActive);
  });
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setPanel(targetId) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === targetId);
  });

  if (targetId === "about") {
    setAboutTab("tools");
  }

  if (targetId === "projects") {
    resetProjectExplorer();
  }

  if (sectionTitle) {
    const folderLabel =
      targetId.charAt(0).toUpperCase() + targetId.slice(1).toLowerCase();
    sectionTitle.textContent = `${folderLabel} Folder`;
  }
}

function openFolder(targetId) {
  if (screen?.classList.contains("locked")) return;
  if (workspaceView.classList.contains("active")) return;

  setPanel(targetId);

  screen.classList.remove("returning");
  screen.classList.add("opening");

  window.setTimeout(() => {
    desktopView.style.display = "none";
    workspaceView.classList.add("active");
    workspaceView.setAttribute("aria-hidden", "false");
    screen.classList.remove("opening");
  }, OPEN_ANIMATION_MS);
}

function closeFolder() {
  if (!workspaceView.classList.contains("active")) return;

  screen.classList.add("returning");
  workspaceView.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    workspaceView.classList.remove("active");
    desktopView.style.display = "grid";
    screen.classList.remove("returning");
  }, CLOSE_ANIMATION_MS);
}

desktopFolderButtons.forEach((button) => {
  button.addEventListener("click", () => openFolder(button.dataset.target));
});

backToDesktopBtn.addEventListener("click", closeFolder);

aboutTabButtons.forEach((button) => {
  button.addEventListener("click", () => setAboutTab(button.dataset.aboutTab));
});

projectFolderButtons.forEach((button) => {
  button.addEventListener("click", () => openProjectDetail(button.dataset.projectId));
});

if (backToProjectFoldersBtn) {
  backToProjectFoldersBtn.addEventListener("click", resetProjectExplorer);
}

lockForm?.addEventListener("submit", handleUnlockSubmit);

lockScreen?.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;
  if (target.closest(".lock-submit")) return;

  focusPasswordField();
});

passwordInput?.addEventListener("input", () => {
  if (passwordMessage?.dataset.state === "error") {
    setLockMessage("");
  }

  lockScreen?.classList.remove("shake");
});

window.addEventListener("keydown", (event) => {
  handleKeyboardVisualizerKeyDown(event);

  if (event.key === "Escape") {
    closeFolder();
  }
});

window.addEventListener("keyup", handleKeyboardVisualizerKeyUp);
window.addEventListener("blur", clearKeyboardVisualizer);

updateClock();
setInterval(updateClock, 1000 * 30);
setPanel("about");
setAboutTab("tools");
resetProjectExplorer();
initializeProjectImageFallback();
buildKeyboardVisualizer();
runSetupIntro();

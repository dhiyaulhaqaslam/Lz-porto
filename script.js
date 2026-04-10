const screen = document.getElementById("screen");
const desktopView = document.getElementById("desktopView");
const workspaceView = document.getElementById("workspaceView");
const openFolderBtn = document.getElementById("openFolderBtn");
const backToDesktopBtn = document.getElementById("backToDesktopBtn");
const menuButtons = Array.from(document.querySelectorAll(".menu-btn"));
const panels = Array.from(document.querySelectorAll(".panel"));
const clock = document.getElementById("clock");

const OPEN_ANIMATION_MS = 740;
const CLOSE_ANIMATION_MS = 560;

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setPanel(targetId) {
  menuButtons.forEach((button) => {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === targetId);
  });
}

function openFolder() {
  if (workspaceView.classList.contains("active")) return;

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

openFolderBtn.addEventListener("click", openFolder);
backToDesktopBtn.addEventListener("click", closeFolder);

menuButtons.forEach((button) => {
  button.addEventListener("click", () => setPanel(button.dataset.target));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFolder();
  }
});

updateClock();
setInterval(updateClock, 1000 * 30);
setPanel("about");

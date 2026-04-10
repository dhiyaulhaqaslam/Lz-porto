const screen = document.getElementById("screen");
const desktopView = document.getElementById("desktopView");
const workspaceView = document.getElementById("workspaceView");
const desktopFolderButtons = Array.from(
  document.querySelectorAll(".desktop-folder-btn")
);
const backToDesktopBtn = document.getElementById("backToDesktopBtn");
const panels = Array.from(document.querySelectorAll(".panel"));
const clock = document.getElementById("clock");
const sectionTitle = document.getElementById("sectionTitle");

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
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === targetId);
  });

  if (sectionTitle) {
    const folderLabel =
      targetId.charAt(0).toUpperCase() + targetId.slice(1).toLowerCase();
    sectionTitle.textContent = `${folderLabel} Folder`;
  }
}

function openFolder(targetId) {
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFolder();
  }
});

updateClock();
setInterval(updateClock, 1000 * 30);
setPanel("about");

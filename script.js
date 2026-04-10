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
const aboutTabButtons = Array.from(document.querySelectorAll(".about-tab-btn"));
const aboutTabContents = Array.from(document.querySelectorAll(".about-tab-content"));
const projectFolderView = document.getElementById("projectFolderView");
const projectDetailView = document.getElementById("projectDetailView");
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFolder();
  }
});

updateClock();
setInterval(updateClock, 1000 * 30);
setPanel("about");
setAboutTab("tools");
resetProjectExplorer();
initializeProjectImageFallback();

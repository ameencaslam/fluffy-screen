const grid = document.getElementById("grid");
const container = document.getElementById("container");
const loading = document.getElementById("loading");
const customCursor = document.getElementById("custom-cursor");
let cells;
let cellSize;
let columns, rows;
let rafId;
let lastMouseX, lastMouseY;
let mouseStopTimer;
let isMouseMoving = false;

function createGrid() {
  cellSize = Math.min(container.clientWidth, container.clientHeight) / 20;
  columns = Math.ceil(container.clientWidth / cellSize);
  rows = Math.ceil(container.clientHeight / cellSize);

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  cells = Array.from(document.querySelectorAll(".cell"));
}

function animateCells() {
  const centerCol = Math.floor(lastMouseX / cellSize);
  const centerRow = Math.floor(lastMouseY / cellSize);
  const affectedRadius = 5; // Reduced the affected area

  cells.forEach((cell, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const distance = Math.hypot(centerCol - col, centerRow - row);
    const maxDistance = affectedRadius;
    const factor = Math.max(0, 1 - distance / maxDistance);
    const zTranslation = factor * 50; // Increased for more noticeable 3D effect

    // Darker shadow for the hovered cell and fading for surrounding cells
    const shadowIntensity = 0.5 * factor; // Adjust this value for more/less intensity
    const shadowBlur = 5 + 10 * factor; // Reduced blur for harder shadow
    const shadowSpread = 5 * factor; // Spread the shadow more for closer cells

    cell.style.transform = `translateZ(${zTranslation}px)`;
    cell.style.boxShadow = `0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`;
  });
}

function handleMouseMove(e) {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isMouseMoving = true;

  // Move the custom cursor
  customCursor.style.left = `${lastMouseX}px`;
  customCursor.style.top = `${lastMouseY}px`;

  // Enlarge the cursor when over a cell
  const hoveredCell = e.target.closest(".cell");
  if (hoveredCell) {
    customCursor.style.width = "12px";
    customCursor.style.height = "12px";
    customCursor.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  } else {
    customCursor.style.width = "8px";
    customCursor.style.height = "8px";
    customCursor.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  }

  clearTimeout(mouseStopTimer);
  mouseStopTimer = setTimeout(() => {
    isMouseMoving = false;
  }, 100);

  if (!rafId) {
    rafId = requestAnimationFrame(animateLoop);
  }
}

function animateLoop() {
  animateCells();
  if (isMouseMoving) {
    rafId = requestAnimationFrame(animateLoop);
  } else {
    rafId = null;
  }
}

function resetCells() {
  cancelAnimationFrame(rafId);
  rafId = null;
  isMouseMoving = false;

  cells.forEach((cell) => {
    cell.style.transform = "translateZ(0)";
    cell.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  });
}

function init() {
  createGrid();
  setTimeout(() => {
    loading.style.display = "none";
    container.style.opacity = "1";
  }, 2000);
}

window.addEventListener("load", init);
container.addEventListener("mousemove", handleMouseMove);
container.addEventListener("mouseleave", resetCells);
window.addEventListener("resize", createGrid);

// Add this new event listener
document.addEventListener("mouseleave", () => {
  customCursor.style.display = "none";
});

document.addEventListener("mouseenter", () => {
  customCursor.style.display = "block";
});

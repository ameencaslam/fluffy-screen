const grid = document.getElementById("grid");
const container = document.getElementById("container");
const loading = document.getElementById("loading");
let cells;
let cellSize;
let columns, rows;
let rafId;
let lastMouseX, lastMouseY;

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

  cells.forEach((cell, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const distance = Math.hypot(centerCol - col, centerRow - row);
    const maxDistance = 5;
    const factor = Math.max(0, 1 - distance / maxDistance);
    const zTranslation = factor * 50;
    const scale = 1 + factor * 0.2;

    // Calculate rotation angles
    const xDiff = centerCol - col;
    const yDiff = centerRow - row;
    const xRotation = yDiff * factor * 5;
    const yRotation = -xDiff * factor * 5;

    cell.style.transform = `translateZ(${zTranslation}px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(${scale})`;
  });
}

function handleMouseMove(e) {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  if (!rafId) {
    rafId = requestAnimationFrame(animateLoop);
  }
}

function animateLoop() {
  animateCells();
  rafId = requestAnimationFrame(animateLoop);
}

function resetCells() {
  cancelAnimationFrame(rafId);
  rafId = null;

  cells.forEach((cell) => {
    cell.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg) scale(1)";
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

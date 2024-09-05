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
    const zTranslation = factor * 50; // Increased from 30 to 50
    const scale = 1 + factor * 0.2; // Increased from 0.1 to 0.2
    const brightness = 100 - factor * 30; // Increased from 20 to 30

    cell.style.transform = `translateZ(${zTranslation}px) scale(${scale})`;
    cell.style.filter = `brightness(${brightness}%)`;
    cell.style.boxShadow = `0 ${
      zTranslation / 2
    }px ${zTranslation}px rgba(0, 0, 0, 0.3)`; // Increased opacity from 0.1 to 0.3
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
    cell.style.transform = "translateZ(0) scale(1)";
    cell.style.filter = "brightness(100%)";
    cell.style.boxShadow = "none";
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

const grid = document.getElementById("grid");
const container = document.getElementById("container");
let cells;
let cellSize = 40;
let columns, rows;
let rafId;

function createGrid() {
  columns = Math.floor(container.clientWidth / cellSize);
  rows = Math.floor(container.clientHeight / cellSize);

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  cells = Array.from(document.querySelectorAll(".cell"));
}

function animateCells(e) {
  const rect = container.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const centerCol = Math.floor(mouseX / cellSize);
  const centerRow = Math.floor(mouseY / cellSize);

  cells.forEach((cell, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const distance = Math.sqrt(
      Math.pow(centerCol - col, 2) + Math.pow(centerRow - row, 2)
    );
    const maxDistance = 5;
    const zTranslation = Math.max(0, 1 - distance / maxDistance) * 30;
    const scale = 1 + (1 - distance / maxDistance) * 0.1;
    const brightness = 100 + (1 - distance / maxDistance) * 20;

    cell.style.transform = `translateZ(${zTranslation}px) scale(${scale})`;
    cell.style.filter = `brightness(${brightness}%)`;
    cell.style.boxShadow = `0 ${
      zTranslation / 2
    }px ${zTranslation}px rgba(0, 0, 0, 0.3)`;
  });
}

function handleMouseMove(e) {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => animateCells(e));
}

function resetCells() {
  cells.forEach((cell) => {
    cell.style.transform = "translateZ(0) scale(1)";
    cell.style.filter = "brightness(100%)";
    cell.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  });
}

window.addEventListener("load", createGrid);
container.addEventListener("mousemove", handleMouseMove);
container.addEventListener("mouseleave", resetCells);

const container = document.getElementById("ascii-background");

const cellWidth = 8;
const cellHeight = 10;

let cols = Math.floor(window.innerWidth / cellWidth);
let rows = Math.floor(window.innerHeight / cellHeight);

// Classic Life grid (0 = dead, 1 = alive)
let grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.85 ? 1 : 0)
);

// Track mouse position in grid coordinates
let mouse = { col: -1, row: -1 };

window.addEventListener("mousemove", e => {
    mouse.col = Math.floor(e.clientX / cellWidth);
    mouse.row = Math.floor(e.clientY / cellHeight);
});

window.addEventListener("mouseleave", () => {
    mouse.col = -1;
    mouse.row = -1;
});

function countNeighbors(r, c) {
    let sum = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = (r + dr + rows) % rows;
            const cc = (c + dc + cols) % cols;
            sum += grid[rr][cc];
        }
    }
    return sum;
}

function step() {
    const next = grid.map(row => [...row]);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const neighbors = countNeighbors(r, c);

            // Standard Game of Life rules
            if (grid[r][c] === 1) {
                next[r][c] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                next[r][c] = neighbors === 3 ? 1 : 0;
            }

            // 🖱️ Hover influence (soft)
            if (
                mouse.col >= 0 &&
                Math.abs(c - mouse.col) <= 2 &&
                Math.abs(r - mouse.row) <= 1
            ) {
                next[r][c] = 1;
            }
        }
    }

    grid = next;
}

function render() {
    let output = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            output += grid[r][c] ? "#" : " ";
        }
        output += "\n";
    }
    container.textContent = output;
}

function resize() {
    cols = Math.floor(window.innerWidth / cellWidth);
    rows = Math.floor(window.innerHeight / cellHeight);
    grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => 0)
    );
}

window.addEventListener("resize", resize);

render();
setInterval(() => {
    step();
    render();
}, 120);

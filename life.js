const container = document.getElementById("ascii-background");

const cellWidth = 8;
const cellHeight = 10;

let cols = Math.floor(window.innerWidth / cellWidth);
let rows = Math.floor(window.innerHeight / cellHeight);

let grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0)
);

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
            if (grid[r][c]) {
                next[r][c] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                next[r][c] = neighbors === 3 ? 1 : 0;
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

function loop() {
    step();
    render();
}

render();
setInterval(loop, 120);

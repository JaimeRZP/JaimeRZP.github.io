const container = document.getElementById("ascii-background");

/* ---------- measure character size ---------- */
const measure = document.createElement("span");
measure.textContent = "M";
measure.style.position = "absolute";
measure.style.visibility = "hidden";
measure.style.fontFamily = getComputedStyle(container).fontFamily;
measure.style.fontSize = getComputedStyle(container).fontSize;
measure.style.lineHeight = getComputedStyle(container).lineHeight;
document.body.appendChild(measure);

let charWidth = measure.getBoundingClientRect().width;
let charHeight = measure.getBoundingClientRect().height;
measure.remove();

/* ---------- grid size ---------- */
let cols = Math.ceil(window.innerWidth / charWidth);
let rows = Math.ceil(window.innerHeight / charHeight);

/* ---------- Life grid ---------- */
let grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.85 ? 1 : 0)
);

/* ---------- mouse ---------- */
let mouse = { col: -1, row: -1 };

window.addEventListener("mousemove", e => {
    mouse.col = Math.floor(e.clientX / charWidth);
    mouse.row = Math.floor(e.clientY / charHeight);
});

window.addEventListener("mouseleave", () => {
    mouse.col = -1;
    mouse.row = -1;
});

/* ---------- Life logic ---------- */
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
            const n = countNeighbors(r, c);

            if (grid[r][c]) {
                next[r][c] = n === 2 || n === 3 ? 1 : 0;
            } else {
                next[r][c] = n === 3 ? 1 : 0;
            }

            // Hover influence
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

/* ---------- render ---------- */
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

/* ---------- resize ---------- */
function resize() {
    cols = Math.ceil(window.innerWidth / charWidth);
    rows = Math.ceil(window.innerHeight / charHeight);
    grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => 0)
    );
}

window.addEventListener("resize", resize);

/* ---------- start ---------- */
render();
setInterval(() => {
    step();
    render();
}, 80);

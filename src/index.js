import * as p5 from 'p5';

const CANVAS_WIDTH = 300,
    CANVAS_HEIGHT = 300;

const RESOLUTION = 3;

let rows, cols, grid;

// 2D ARRAY GENERATION
function create2dMatrix(rows, cols) {
    return Array.from({
            length: rows
        }, () =>
        Array.from({
            length: cols
        }, () => 0)
    );
}

// SEED RANDOM
function seed(rows, cols) {
    let matrix = create2dMatrix(rows, cols);
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            matrix[x][y] = Math.floor(Math.random() * 2);
        }
    }
    return matrix;
}

// FUNCTION TO CALCULATE THE NEIGHBORS OF A SPECIFIC CELL
function calculateNeighbors(matrix, row, col) {
    let sum = matrix[row][col] * -1;
    for (let i = -1; i <= 1; i++) {
        let ny = (row + i + matrix.length) % matrix.length;
        for (let j = -1; j <= 1; j++) {
            let nx = (col + j + matrix[ny].length) % matrix[ny].length;
            sum += matrix[ny][nx];
        }
    }
    return sum;
}

// START
const P5 = new p5((sk) => {
    sk.setup = () => {
        sk.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        // DEFINE THE COLUMNS AND ROWS
        rows = CANVAS_HEIGHT / RESOLUTION;
        cols = CANVAS_WIDTH / RESOLUTION;

        // CREATE A SEED MATRIX
        grid = seed(rows, cols);
    }

    sk.draw = () => {
        // SETUP BACKGROUND COLOR
        sk.background(51);

        // DRAW THE MATRIX
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let x = j * RESOLUTION;
                let y = i * RESOLUTION;

                if (grid[i][j] == 1) {
                    // console.log('alive!', i, j, x, y);
                    sk.fill(255);
                    sk.rect(x, y, RESOLUTION - 1, RESOLUTION - 1);
                }
            }
        }

        // COMPUTE NEXT GENERATION
        let next = create2dMatrix(rows, cols);

        // SUM NEIGHBORS
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // RULES
                // 1. Any live cell with two or three live neighbors survives.
                // 2. Any dead cell with three live neighbors becomes a live cell.
                // 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

                var cellState = grid[y][x];
                var neighbors = calculateNeighbors(grid, y, x);

                if (cellState == 1 && (neighbors == 2 || neighbors == 3)) {
                    next[y][x] = 1;
                } else if (cellState == 0 && neighbors == 3) {
                    next[y][x] = 1;
                } else {
                    next[y][x] = 0;
                }
            }
        }

        grid = next;
    }
});
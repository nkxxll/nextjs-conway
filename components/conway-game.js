// here I can make the conway game
import React, { useRef, useEffect, useState } from 'react';

const HEIGHT = 100;
const WIDTH = 100;
const SCALE = 10;

const directions = [
    [0, 1],
    [0, -1],
    [1, 1],
    [1, 0],
    [1, -1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
];

/**
 * @param {live} live
 * @param {int} row
 * @param {int} col
 * @param {Array} state current state
 * @returns {boolean} res if the pos dies or lives
 */
function checkPos(row, col, state) {
    /** @type int */
    let count = 0;
    let live = state[row][col];
    for (let direction of directions) {
        let next = { row: row + direction[0], col: col + direction[1] };
        if (next.row >= HEIGHT || next.row < 0 || next.col >= WIDTH || next.col < 0) {
            continue;
        }
        if (state[next.row][next.col] === 1) {
            count++;
        }
    }
    // A live cell dies if it has fewer than two live neighbors.
    // A live cell with more than three live neighbors dies.
    if (live && (count < 2 || count > 3)) {
        return false;
    }
    // A live cell with two or three live neighbors lives on to the next generation.
    if (live && (count === 2 || count === 3)) {
        return true;
    }
    // A dead cell will be brought back to live if it has exactly three live neighbors.
    if (!live && count === 3) {
        return true;
    }
    // every other case does not get to live
    return false;
}

/**
 * @param {int} width width of the pixelmap
 * @param {int} height height of the pixelmap
 * @returns {Array} new pixelmap
 */
function createCanvasState(width, height) {
    return new Array(height).fill(0).map(() => new Array(width).fill(0));
}

/**
 * @returns {Array} start Start state of the game
 * */
function createStartState() {
    let start = createCanvasState(WIDTH, HEIGHT);
    // draw a rectangle in the middle

    // Glider
    start[1][1] = 1;
    start[2][2] = 1;
    start[3][0] = 1;
    start[3][1] = 1;
    start[3][2] = 1;

    // Blinker
    start[10][10] = 1;
    start[10][11] = 1;
    start[10][12] = 1;

    // Random live cells
    for (let i = 0; i < 1000; i++) {
        const randomRow = Math.floor(Math.random() * HEIGHT);
        const randomCol = Math.floor(Math.random() * WIDTH);
        start[randomRow][randomCol] = 1;
    }

    return start;
}

/**
 * @param {Array} state array which represents the state
 * @returns {Array} new state
 */
function update(state) {
    let newState = createCanvasState(WIDTH, HEIGHT);
    let i, j;
    for (i = 0; i < HEIGHT; i++) {
        for (j = 0; j < WIDTH; j++) {
            if (checkPos(i, j, state)) {
                newState[i][j] = 1;
            } else {
                newState[i][j] = 0;
            }
        }
    }
    return newState;
}

/**
 * @param {any} canvas reference to canvas
 * @param {Array} state Array of the state
 */
function draw(canvas, state) {
    const ctx = canvas.getContext('2d');

    const numRows = canvas.height / SCALE;
    const numCols = canvas.width / SCALE;

    // Loop through each pixel and draw it
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * SCALE;
            const y = row * SCALE;
            if (state[row][col] === 1) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'black';
            }
            ctx.fillRect(x, y, SCALE, SCALE);
        }
    }
}

export default function ConwayGame() {
    function ConwayHeader() {
        return <h1 className='text-center text-3xl text-white bg-black'>Conway's Game Of Life</h1>;
    }
    function Screen() {
        const canvasRef = useRef(null);
        const [state, setState] = useState(createStartState());
        useEffect(() => {
            const interval = setInterval(() => {
                let canvas = canvasRef.current;
                setState(update(state));
                draw(canvas, state);
            }, 50);

            return () => clearInterval(interval);
        }, [state]);
        return (
            <canvas
                className='gap-10 border-4 border-zinc-200'
                width={SCALE * WIDTH}
                height={SCALE * HEIGHT}
                ref={canvasRef}
            ></canvas>
        );
    }
    return (
        <>
            <div className='bg-black flex flex-col'>
                <ConwayHeader />
                <Screen />
            </div>
        </>
    );
}

// Initialize variables
const canvas = document.querySelector('#canvas');
const resetButton = document.querySelector('#reset-button');
const brushSelect = document.querySelector('#brush-select');
let gridSize = 16;
let brush = 'grey';
let fadeBrushLightness = 90;
let fadeBrushDecrease = true;

// Add initial event listeners
document.addEventListener('DOMContentLoaded', createGrid);
resetButton.addEventListener('click', reset);
brushSelect.addEventListener('change', changeBrush);

//Function to add empty grid to the page
function createGrid() {
    // Calculate the total number of cells
    numberOfCells = gridSize * gridSize;

    // Set CSS grid parameters for canvas to create the grid
    canvas.style.gridTemplateRows = `repeat(${gridSize}, 1fr`;
    canvas.style.gridTemplateColumns = `repeat(${gridSize}, 1fr`;

    // Create as many cells (divs) as required and add them to the canvas
    for (let i = 0; i < numberOfCells; i++) {
        let cell = document.createElement('div');
        cell.classList.add('single-cell')
        canvas.appendChild(cell);
    }

    // Add mouse over event listener to each cell
    document.querySelectorAll('.single-cell').forEach(cell => {
        cell.addEventListener('mouseover', fillCell)
    })
}   

// Function to fill the cell with colour on mouse over
function fillCell() {
    if (brush === 'grey'){
        this.style.backgroundColor = 'hsl(0, 0%, 50%)';
    } else if (brush === 'random') {
        this.style.backgroundColor = randomBrush();
    } else if (brush === 'fade') {
        this.style.backgroundColor = fadeBrush();
    }

    // Set the fade in animation
    this.classList.add('fade-in-cell');
}

// Function to reset grid and adjust size
function reset() {

    // Only allow numerical values > 0 and <= 100 as a valid size
    do {
    gridSize = prompt('Grid size:', 16)
    } while (isNaN(gridSize) || gridSize < 1 || gridSize > 100);
    
    canvas.innerHTML = '';
    createGrid();
}

// Function to change the color of the brush on selection
function changeBrush() {
    brush = this.value;
}

// Random color brush function
function randomBrush() {

    // Generate a random hex colour and return it
    let randomHex = '#' + Math.floor(Math.random()*16777215).toString(16);

    return randomHex;
}

// Fade brush function - make the brush go light to dark and back
function fadeBrush() {
    let currentLightness = fadeBrushLightness;

    if (fadeBrushDecrease === true) {
        fadeBrushLightness -= 10; 
    } else {
        fadeBrushLightness += 10;
    }

    // Change the fadeBrushChange if 0 or 90
    if (fadeBrushLightness == 0 || fadeBrushLightness >= 90) {
        fadeBrushDecrease = !fadeBrushDecrease;
    }

    return `hsl(0, 0%, ${currentLightness}%)`;
}
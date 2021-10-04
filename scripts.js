// Initialize variables
let gridSize = 16;
let numberOfCells = gridSize * gridSize;

let brush = {
    type: 'grey',
    location: 0,
    settings: {
        fade: {
            brushLightness: 90,
            brushDecrease: true,
        },
    },
}

// Add initial event listeners
const canvas = document.querySelector('#canvas');
const resetButton = document.querySelector('#reset-button');
const brushSelect = document.querySelector('#brush-select');

document.addEventListener('DOMContentLoaded', createGrid);
resetButton.addEventListener('click', reset);
brushSelect.addEventListener('change', changeBrush);
window.addEventListener('keyup', moveBrush)


//Function to add empty grid to the page
function createGrid() {

    // Reset brush location
    brush.location = 0;

    // Set CSS grid parameters for canvas to create the grid
    canvas.style.gridTemplateRows = `repeat(${gridSize}, 1fr`;
    canvas.style.gridTemplateColumns = `repeat(${gridSize}, 1fr`;

    // Create as many cells (divs) as required and add them to the canvas
    for (let i = 1; i <= numberOfCells; i++) {
        let cell = document.createElement('div');
        cell.setAttribute('id', `cell-${i}`)
        cell.classList.add('single-cell')
        canvas.appendChild(cell);
    }

    // Add mouse over event listener to each cell
    document.querySelectorAll('.single-cell').forEach(cell => {
        cell.addEventListener('mouseover', fillCell)
    })
}   

// Function to fill the cell with colour
function fillCell(event) {
    let cellId = 0;

    // Check for event
    if (event.type === 'mouseover') {
        cellId = this.id;
    } else if (event.type === 'keyup') {
        cellId = `cell-${brush.location}`;
    }

    const cell = document.getElementById(cellId);

    if (brush.type === 'grey'){
        cell.style.backgroundColor = 'hsl(0, 0%, 50%)';
    } else if (brush.type === 'random') {
        cell.style.backgroundColor = randomBrush();
    } else if (brush.type === 'fade') {
        cell.style.backgroundColor = fadeBrush();
    }


    // Set the fade in animation
    cell.classList.add('fade-in-cell');

    // Set the brush location to this square
    brush.location = parseInt(cellId.split('-').pop());
}

// Function to reset grid and adjust size
function reset() {

    let promptInput = 16;

    // Only allow numerical values > 0 and <= 100 as a valid size
    do {
        promptInput = prompt('Grid size:', 16)
    } while (isNaN(gridSize) || gridSize < 1 || gridSize > 100);
    
    gridSize = parseInt(promptInput);
    numberOfCells = gridSize * gridSize;

    canvas.innerHTML = '';
    createGrid();
}

// Function to change the color of the brush on selection
function changeBrush() {
    brush.type = this.value;
}

// Random color brush function
function randomBrush() {

    // Generate a random hex colour and return it
    let randomHex = '#' + Math.floor(Math.random()*16777215).toString(16);

    return randomHex;
}

// Fade brush function - make the brush go light to dark and back
function fadeBrush() {
    let currentLightness = brush.settings.fade.brushLightness;

    if (brush.settings.fade.brushDecrease === true) {
        brush.settings.fade.brushLightness -= 10; 
    } else {
        brush.settings.fade.brushLightness += 10;
    }

    // Change the fadeBrushChange if 0 or 90
    if (brush.settings.fade.brushLightness == 0 || brush.settings.fade.brushLightness >= 90) {
        brush.settings.fade.brushDecrease = !brush.settings.fade.brushDecrease;
    }

    return `hsl(0, 0%, ${currentLightness}%)`;
}

// Checks if a cell is exists
function validCell(cellNumber) {
    if (cellNumber < 1 || cellNumber > numberOfCells) {
        return false;
    } else {
        return true;
    }
}

function moveBrush(event) {
    console.log("BRUSH location: " + brush.location);
    let newLocation = 0;

    // Calculate the new brush location
    if (event.key === 'ArrowLeft') {
        console.log(typeof(gridSize))
        newLocation = brush.location - 1;
    } else if (event.key === 'ArrowRight') {
        console.log(typeof(gridSize))
        newLocation = brush.location + 1;
    } else if (event.key === 'ArrowUp') {
        console.log(typeof(gridSize))
        newLocation = brush.location - gridSize;
    } else if (event.key === 'ArrowDown') {
        console.log(typeof(gridSize))
        newLocation = brush.location + gridSize;
    }
    console.log("NEW location: " + newLocation)
    // If cell exists color it and move 
    if (validCell(newLocation)) {
        // Move the brush location
        brush.location = newLocation;

        // Color new cell
        fillCell(event);
    } 
}
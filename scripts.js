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
window.addEventListener('keydown', moveBrush)

// Wheel settings
const leftWheel = document.querySelector('#left-wheel');
const rightWheel = document.querySelector('#right-wheel');
let leftWheelRotation = 0;
let rightWheelRotation = 0;
let degreesPerRotation = 10;

const wheels = document.querySelectorAll('.control-wheel');
wheels.forEach(wheel => {
    wheel.addEventListener('wheel', moveBrush);
})

// Mouse movement tracker
let last_position = {};
let mouseMovement = '';

document.addEventListener('mousemove', function (event) {
    if (typeof(last_position.x) != 'undefined') {
        let deltaX = last_position.x - event.offsetX,
            deltaY = last_position.y - event.offsetY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
            //left
            mouseMovement = 'left';
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
            //right
            mouseMovement = 'right';
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
            //up
            mouseMovement = 'up';
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
            //down
            mouseMovement = 'down';
        }
    }
    last_position = {
        x : event.offsetX,
        y : event.offsetY
    };
});

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
        cell.addEventListener('mouseover', moveBrush)
    })
}   

// Function to fill the cell with colour
function fillCell(cellId) {

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

    // Reset wheel positions
    leftWheel.style.transform = `rotate(0deg)`;
    rightWheel.style.transform = `rotate(0deg)`;

    // Clear the current gid and create a new one
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
    let newLocation = 0;

    let cellId = '';

    // Check for event
    if (event.type === 'mouseover') {
        cellId = this.id;
        
        // Set the brush location to this square
        brush.location = parseInt(cellId.split('-').pop());
    } else if (event.type === 'keydown' || event.type === 'wheel') {
        cellId = `cell-${brush.location}`;
    }
    
    // Calculate the new brush location and spin the wheel
    if ((event.type === 'mouseover' && mouseMovement === 'left') || event.key === 'ArrowLeft' || (event.deltaY > 0 && this.id === "left-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location - 1);
        spinWheel('left', 'left');
    } else if ((event.type === 'mouseover' && mouseMovement === 'right') || event.key === 'ArrowRight' || (event.deltaY < 0 && this.id === "left-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location + 1);
        spinWheel('left', 'right');
    } else if ((event.type === 'mouseover' && mouseMovement === 'up') || event.key === 'ArrowUp' || (event.deltaY < 0 && this.id === "right-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location - gridSize);
        spinWheel('right', 'left');
    } else if ((event.type === 'mouseover' && mouseMovement === 'down') || event.key === 'ArrowDown' || (event.deltaY > 0 && this.id === "right-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location + gridSize);
        spinWheel('right', 'right');
    }

    // If cell exists color it and move 
    if (validCell(newLocation)) {

        // Move the brush location
        brush.location = newLocation;
        let newBrushLocationId = `cell-${brush.location}`;

        // Color new cell
        fillCell(newBrushLocationId);
    } 
}

// Wheel spin function
function spinWheel(wheel, direction) {
    if (wheel === 'left') {
        if (direction === 'left') {
            leftWheelRotation -= degreesPerRotation;
            leftWheel.style.transform = `rotate(${leftWheelRotation}deg)`;
        } else {
            leftWheelRotation += degreesPerRotation;
            leftWheel.style.transform = `rotate(${leftWheelRotation}deg)`;
        }
    } else {
        if (direction === 'left') {
            rightWheelRotation -= degreesPerRotation;
            rightWheel.style.transform = `rotate(${rightWheelRotation}deg)`;
        } else {
            rightWheelRotation += degreesPerRotation;
            rightWheel.style.transform = `rotate(${rightWheelRotation}deg)`;
        }
    }
}

// Initialize variables
let gridSize = 16;
let numberOfCells = gridSize * gridSize;

let brush = {
    type: 'solid',
    color: {
        hue: 0,
        saturation: 0,
        lightness: 50,
        },
    location: 0,
    settings: {
        fade: {
            brushDecrease: true,
        },
    },
}

// Add initial event listeners
const canvas = document.querySelector('#canvas');
const resetButton = document.querySelector('#reset-button');
const brushSelect = document.querySelector('#brush-select');
const colorPicker = document.querySelector('#color-picker');
const gridSlider = document.querySelector('#grid-size-slider');

document.addEventListener('DOMContentLoaded', createGrid);
resetButton.addEventListener('click', reset);
brushSelect.addEventListener('change', changeBrush);
colorPicker.addEventListener('input', changeColor);
gridSlider.addEventListener('input', reset);
window.addEventListener('keydown', moveBrush);


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

    // Update the grid size display
    let sizeDisplay = document.querySelector('#size-display');
    sizeDisplay.textContent = `${gridSize} x ${gridSize}`;

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

    if (brush.type === 'solid'){
        cell.style.backgroundColor = `hsl(${brush.color.hue},${brush.color.saturation}%,${brush.color.lightness}%`;
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
    gridSize = parseInt(gridSlider.value);
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
    if (brush.settings.fade.brushDecrease === true) {
        brush.color.lightness -= 10; 
    } else {
        brush.color.lightness += 10;
    }
    // Change the fadeBrushChange if 0 or 90
    if (brush.color.lightness <= 0 || brush.color.lightness >= 90) {
        brush.settings.fade.brushDecrease = !brush.settings.fade.brushDecrease;
    }

    return `hsl(${brush.color.hue}, ${brush.color.saturation}%, ${brush.color.lightness}%)`;
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
        event.preventDefault();
    } else if ((event.type === 'mouseover' && mouseMovement === 'right') || event.key === 'ArrowRight' || (event.deltaY < 0 && this.id === "left-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location + 1);
        spinWheel('left', 'right');
        event.preventDefault();
    } else if ((event.type === 'mouseover' && mouseMovement === 'up') || event.key === 'ArrowUp' || (event.deltaY < 0 && this.id === "right-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location - gridSize);
        spinWheel('right', 'right');
        event.preventDefault();
    } else if ((event.type === 'mouseover' && mouseMovement === 'down') || event.key === 'ArrowDown' || (event.deltaY > 0 && this.id === "right-wheel")) {
        newLocation = (event.type === 'mouseover' ? brush.location : brush.location + gridSize);
        spinWheel('right', 'left');
        event.preventDefault();
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

// Changes the color of the brush
function changeColor(event) {
    // convert hex to hsl
    let hsl = hexToHSL(event.target.value);

    // set brush valus to hsl values
    [brush.color.hue, brush.color.saturation, brush.color.lightness] = hsl;
}

/* Convert hex to HSL function
   Source: https://css-tricks.com/converting-color-spaces-in-javascript/
   Credit: Jon Kantner */
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h,s,l];
}
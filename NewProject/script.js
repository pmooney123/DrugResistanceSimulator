const canvas = document.getElementById('main-canvas');
const foodI = document.getElementById('foodInput');
const dFood = document.getElementById('desiredFood');
const abI = document.getElementById('abInput');
const dAB = document.getElementById('desiredAB');
const countText = document.getElementById('count');
const bacteriaText = document.getElementById('bacteria');
const foodText = document.getElementById('food');
const antibioticText = document.getElementById('antibiotics');
const mutText = document.getElementById('mutText');
const canvasContainer = document.getElementById('canvas-container');
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d');
const fps = 20;
const tps = 30;
let count = 0;
let desiredFood = 100;
let foodInput = 20;
let desiredAB = 0;
let abInput = 0;
let mutationChance = 100;
function startGame() {
    for (let i = 0; i < 1000; i++) {
        let newb = new Bacteria(map);
        gameElements.push(newb);
        bacteria.push(newb);

        let newf = new Food(map);
        food.push(newf);
        gameElements.push(newf);
    }
    setInterval(renderCanvas,1000/fps);
    setInterval(progressGame, 1000/tps);
}
let map = new Map(canvas.width, canvas.height);
let log = [];
const logText = document.getElementById('log');
let gameElements = [];
let bacteria = [];
let food = [];
let antibiotics = [];

function renderCanvas() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, 500, 500);
    for (let i = 0; i < gameElements.length; i++) {
        gameElements[i].draw(ctx);
    }
}
function addBacteria(parent) {
    let newb = new Bacteria(map);
    newb.x = parent.x;
    newb.y = parent.y;
    newb.genome = parent.genome;
    newb.setColor();
    newb.mutate();
    newb.setStats();
    gameElements.push(newb);
    bacteria.push(newb);
}
function controlVars() {
    let numFood = 0;
    let numBacteria = 0;
    for (let j = 0; j < gameElements.length; j++) {
        if (gameElements[j].type === "food") {
            numFood++;
        }
    }
    if (numFood <    desiredFood) {
        for (let i = 0; i < foodInput; i++) {
            gameElements.push(new Food(map));
        }
    } else {
        let tries = 0;
        while (numFood > desiredFood && tries < 1000) {
            tries++;
            numFood = 0;
            for (let i = 0; i < gameElements.length; i++) {
                if (gameElements[i].flagRemove) {
                    gameElements.splice(i, 1);
                    i--;
                } else {
                    if (gameElements[i].type === "food") {
                        numFood++;
                    }
                }
            }
            let rand = getRandomInt(gameElements.length);
            if (gameElements[rand].type === "food") {
                gameElements[rand].flagRemove = true;
            }
        }
    }

    let numAB = 0;
    for (let j = 0; j < gameElements.length; j++) {
        if (gameElements[j].type === "antibiotic") {
            numAB++;
        }
    }
    if (numAB < desiredAB) {
        for (let i = 0; i < abInput; i++) {
            gameElements.push(new Antibiotic(map));
        }
    } else {
        let tries = 0;
        while (numAB > desiredAB && tries < 1000) {
            tries++;
            numAB = 0;
            for (let i = 0; i < gameElements.length; i++) {
                if (gameElements[i].flagRemove) {
                    gameElements.splice(i, 1);
                    i--;
                } else {
                    if (gameElements[i].type === "antibiotic") {
                        numAB++;
                    }
                }
            }
            let rand = getRandomInt(gameElements.length);
            if (gameElements[rand].type === "antibiotic") {
                gameElements[rand].flagRemove = true;
            }
        }
    }
    for (let i = 0; i < gameElements.length; i++) {
        if (gameElements[i].type === "bacterium") {
            numBacteria++;
        }
    }
    countText.innerText = "Time: " + count;
    bacteriaText.innerText = "Bacteria: " + numBacteria;
    foodText.innerText = "Food: " + numFood;
    antibioticText.innerText = "Antibiotics: " + numAB;

}
function updateText() {
    foodI.innerText = "" + Math.round(foodInput);
    dFood.innerText = "" + Math.round(desiredFood);
    abI.innerText = "" + Math.round(abInput);
    dAB.innerText = "" + Math.round(desiredAB);
    mutText.innerText = "" + Math.round(mutationChance);
}
function progressGame() {
    controlVars();
    calculateAverageColor()
    for (let i = 0; i < gameElements.length; i++) {
        gameElements[i].update();

        if (count % 10 === 0) {
            if (gameElements[i].type === "bacterium") {
                for (let j = 0; j < gameElements.length; j++) {
                    if (gameElements[j].type === "food") {
                        if (!gameElements[i.flagRemove && !gameElements[j].flagRemove]) {
                            if (distance(gameElements[i].x, gameElements[i].y, gameElements[j].x, gameElements[j].y) < gameElements[i].size * 2) {

                                gameElements[j].flagRemove = true;
                                gameElements[i].incSize(2);

                            }
                        }
                    }
                }
            }
        }
        if (count % 5 === 0) {
            if (gameElements[i].type === "bacterium") {
                for (let j = 0; j < gameElements.length; j++) {
                    if (gameElements[j].type === "antibiotic") {
                        if (!gameElements[i.flagRemove && !gameElements[j].flagRemove]) {

                            if (distance(gameElements[i].x, gameElements[i].y, gameElements[j].x, gameElements[j].y) < gameElements[i].size * 2) {

                                gameElements[j].flagRemove = true;
                                gameElements[i].dcrSize(4);

                            }
                        }
                    }
                }
            }
        }

        if (gameElements[i].flagRemove) {
            gameElements.splice(i, 1);
            i--;
        }
    }
    count++;
    updateText();
}
function calculateAverageColor() {
    let r = 0;
    let g = 0;
    let b = 0;
    let total = 0;
    for (let i = 0; i < gameElements.length; i++) {
        if (gameElements[i].type === "bacterium") {
            total++;
            r += gameElements[i].red;
            g += gameElements[i].green;
            b += gameElements[i].blue;
        }
    }
    let acolor = Math.round(r / total);
    let bcolor = Math.round(b / total);
    let ccolor = Math.round(g / total);
    console.log(' r ' + acolor + ' g ' + bcolor + ' b ' + ccolor);
    canvasContainer.style.backgroundColor = 'rgb(' + acolor + "," + bcolor + "," + ccolor + ')';

}

function setSpawningRates() {
    let maxPlants = 300;
    let maxBunnies = 200;
    let maxFoxes = 100;
    while (numPlants > maxPlants) {
        for (let i = 0; i < 100; i++) {
            let rand = getRandomInt(gameElements.length)
            if (gameElements[rand].type === 'plant') {
                gameElements[rand].flagRemove = true;
            }
        }
        getCounts();
    }
    while (numBunnies > maxBunnies) {
        for (let i = 0; i < 100; i++) {
            let rand = getRandomInt(gameElements.length)
            if (gameElements[rand].type === 'bunny') {
                gameElements[rand].flagRemove = true;
            }
        }
        getCounts();
    }
}
function displayMessages() {
    let string = '';
    for (let i = 0; i < log.length; i++) {
        string = string.concat(log[i].getString() + '\n');
    }
    logText.innerText = string;
}
function addMessages() {
    if (count % 100 === 0) {

    }
}

startGame();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
}
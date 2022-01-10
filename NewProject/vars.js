class element {
    constructor() {

    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    update() {

    }
}
class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
class Food  {
    constructor(map) {
        this.type = "food";
        this.x = getRandomInt(map.width);
        this.y = getRandomInt(map.height);
        this.size = 2;
        this.color = "black";
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    update() {

    }
}
class Antibiotic  {
    constructor(map) {
        this.type = "antibiotic";
        this.x = getRandomInt(map.width);
        this.y = getRandomInt(map.height);
        this.size = 3;
        this.color = "rgb(255,0,0)";
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    update() {

    }
}
class Bacteria {
    constructor(map) {
        this.type = "bacterium";
        this.x = getRandomInt(map.width);
        this.y = getRandomInt(map.height);
        this.size = 4;
        this.color = "white";
        this.gl = 10;
        this.genome = "";

        let alphabet = "ABC";
        for (let i = 0; i < this.gl; i++) {
            let rand = getRandomInt(alphabet.length);
            let newLetter = alphabet.substring(rand, rand + 1)
            this.genome = this.genome.concat(newLetter);
        }

        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.red = 0;
        this.blue = 0;
        this.green = 0;
        this.setColor();

        this.angle = Math.random() * 6.28;
        this.anglemax = 6.28;
        this.da = 6.28/5
        this.speedMult=0;
        this.growMult=0;
        this.drugMult=0;
        this.setStats();
    }
    setStats() {
        this.speedMult = (this.a / this.genome.length)/2 + 0.5;
        this.growMult = (this.b / this.genome.length)/2;
        this.drugMult = (this.c / this.genome.length)*1.5;
        //.log("Genome: " + this.genome + " STATS: " + this.speedMult + " " + this.growMult + " " + this.drugMult);
    }
    mutate() {
        if (Math.random() < mutationChance/100) {
            let alphabet = "ABC";
            let randg = getRandomInt(this.genome.length);
            let randl = getRandomInt(alphabet.length);
            let newLetter = alphabet.substring(randl, randl + 1)
            this.genome = setCharAt(this.genome, randg,newLetter);
        }
        this.setColor();
    }
    setColor() {
        let numA = 0;
        let numB = 0;
        let numC = 0;

        for (let i = 0; i < this.genome.length; i++){
            if (this.genome[i] === "A") numA++;
            if (this.genome[i] === "B") numB++;
            if (this.genome[i] === "C") numC++;
        }

        this.red = (numA / this.genome.length) * 255;
        this.blue = (numB / this.genome.length) * 255;
        this.green = (numC / this.genome.length) * 255;

        this.a = numA;
        this.b = numB;
        this.c = numC;

        this.color = 'rgb(' + this.red + "," + this.blue + "," + this.green + ")";
    }
    draw(ctx) {
        if (this.size > 12) {
            this.size = 12;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    move() {
        /*
        this.x += (Math.random() * 1 - 0.5) * this.size;
        this.y += (Math.random() * 1 - 0.5) * this.size;
         */
        this.angle += Math.random() * this.da - this.da / 2;
        this.x += this.size/3 * this.speedMult * Math.cos(this.angle);
        this.y += this.size/3 * this.speedMult * Math.sin(this.angle);

        this.x = cap(this.x, map.width);
        this.y = cap(this.y, map.height);
        this.x = floor(this.x, 0);
        this.y = floor(this.y, 0);
    }
    incSize(num) {
        this.size += num;
        if (Math.random() < this.growMult) {
            this.size += num;
        }
        if (this.size > 8) {
            this.size = 8;
        }
    }
    dcrSize(num) {
        if (Math.random() < this.drugMult) {
            return;
        }
        this.size -= num;
        if (this.size <= 0) {
            this.size = 2;
            this.flagRemove = true;
        }
    }
    grow() {
        if (count % 35 === 0 && Math.random() < 0.2) {
            this.size -= 2;
        }
        if (this.size <= 0) {
            this.flagRemove = true;
        }
        if (this.size >= 8) {
            this.flagRemove = true;
            addBacteria(this);
            addBacteria(this);
        }
    }
    update() {
        this.move();
        this.grow();
    }
}

function floor(value, cap) {
    if (value < cap) {
        return cap;
    }
    return value;
}
function cap(value, cap) {
    if (value > cap) {
        return cap;
    }
    return value;
}
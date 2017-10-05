var player;

var canvas;
var ctx;

var G = 100;
var V0 = 200;
var F = 10;
var R = 10;

var maxSpeed = 10000;
var acc = 500;
var dec = 500;

var lastUpdate = Date.now();

var rightPressed, leftPressed, upPressed;

$(function() {
    $(".formula-input").on("input propertychange paste", updateFormula);

    canvas = document.getElementById("testEngine");
    ctx = canvas.getContext("2d");

    setInterval(tick, 16);

    initGame();
});

function initGame() {
    player = { velX: 0, velY: 0, x: canvas.width / 2 - 20, y: canvas.height - 40, w: 40, h: 40 };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}

function tick() {
    var thisUpdate = Date.now();

    update((thisUpdate - lastUpdate) / 1000);
    render();

    lastUpdate = thisUpdate;
}

function update(delta) {

    var prevDir = signum(player.velX);
    var newDir = 0;

    if(leftPressed != rightPressed) //if only one of them is pressed
        newDir = leftPressed ? -1 : 1;

    player.velX -= prevDir * dec * delta;

    if(signum(player.velX) != prevDir)
        player.velX = 0;

    if(Math.abs(player.velX) < maxSpeed || prevDir != newDir)
    {
        player.velX += newDir * acc * delta;

        if(Math.abs(player.velX) > maxSpeed && prevDir == newDir)
            player.velX = maxSpeed * prevDir;
    }

    if(upPressed) {
        if(player.y == 10)
            player.velY = V0 + R * (Math.abs(player.velX) / maxSpeed);
        player.velY += F * delta;
    }

    player.velY -= G * delta;

    player.x += player.velX * delta;
    player.y += player.velY * delta;

    if(player.y < 10) {
        player.y = 10;
        player.velY = 0;
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderObj(player);
}

function renderObj(obj) {
    ctx.beginPath();
    ctx.rect(obj.x, canvas.height - obj.y - obj.h, obj.w, obj.h);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function updateFormula() {
    var y1 = $("#y1").val();
    var y2 = $("#y2").val();
    var y3 = $("#y3").val();
    var l = $("#l").val();

    if(isNaN(y1) || isNaN(y2) || isNaN(y3) || isNaN(l) || y1 < 0 || y2 < y1 || y3 < y2 || l <= 0) {
        $("#formula").html("V(t) = V0 + R*s - G*t + F*t*j");
        return;
    }

    V0 = 4 * y2 / l;
    G = 8 * y2 * y2 / (l * l * y1);
    F = 8 * y2 * (y2 - y1) / (l * l * y1);
    R = 4 * y2 * (Math.sqrt(y3 / y2) - 1) / l;

    $("#formula").html("V(t) = " + V0 + " + " + R + "s - " + G + "t + " + F + "t*j");
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 38) {
        upPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function signum(x) {
    return (x > 0) - (x < 0);
}
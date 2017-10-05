var player;

var canvas;
var ctx;

var G, V0, F, R;

var maxSpeed = 20;
var acc = 100;
var dec = 25;

var scale = 25;

var lastUpdate = Date.now();

var rightPressed, leftPressed, upPressed;

var presets = [
				{name: "Default", Y1: 2, Y2: 4, Y3: 5, L: 0.75},
				{name: "Fluffy", Y1: 3, Y2: 5, Y3: 6, L: 1.5},
				{name: "Rock", Y1: 6, Y2: 6.5, Y3: 7, L: 0.4}
			];

var validFormula = false;

$(function() {
    $(".formula-input").on("input propertychange paste", updateFormula);

    canvas = document.getElementById("testEngine");
    ctx = canvas.getContext("2d");

    setInterval(tick, 16);

    initGame();

	loadPresets();
    applyPreset(presets[0]);
});

function loadPresets() {
	for(var i in presets) {
		$("#presets").append('<a class="preset btn btn-default" id="preset_' + i + '">' + presets[i].name + '</a>');
	}

	$(".preset").on("click", function(event) {
		applyPreset(presets[event.target.id.split("_")[1]]);
	});
}

function applyPreset(preset) {
    $("#y1").val(preset.Y1);
    $("#y2").val(preset.Y2);
    $("#y3").val(preset.Y3);
    $("#l").val(preset.L);

    updateFormula();
}

function initGame() {
    player = { velX: 0, velY: 0, x: canvas.width / scale / 2 - 1 / 2, y: canvas.height / scale - 1, w: 1, h: 1 };

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
        if(player.y == 1)
            player.velY = V0 + R * (Math.abs(player.velX) / maxSpeed);

        player.velY += F * delta;
    }

    player.velY -= G * delta;

    player.x += player.velX * delta;
    player.y += player.velY * delta;

    if(player.y < 1) {
        player.y = 1;
        player.velY = 0;
    }
}

function render() {
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.rect(0, canvas.height - scale, canvas.width, scale);
	ctx.fillStyle = "#888888";
	ctx.fill();
	ctx.closePath();

	for(var i = scale * 2; i < canvas.height; i+= scale)
	{
		ctx.beginPath();
		ctx.rect(0, canvas.height - i + 1, canvas.width, 1);
		ctx.fillStyle = "#D0D0D0";
		ctx.fill();
		ctx.closePath();
	}

	if(validFormula)
	{
		ctx.fillStyle = "#0000FF";
		ctx.font = "14px Arial";
		ctx.fillText("Y1", 0, canvas.height - (Number($("#y1").val()) + 1) * scale);

		ctx.beginPath();
		ctx.rect(0, canvas.height - (Number($("#y1").val()) + 1) * scale + 1, canvas.width, 1);
		ctx.fill();
		ctx.closePath();

		ctx.fillStyle = "#000000";
		ctx.font = "14px Arial";
		ctx.fillText("Y2", 0, canvas.height - (Number($("#y2").val()) + 1) * scale);

		ctx.beginPath();
		ctx.rect(0, canvas.height - (Number($("#y2").val()) + 1) * scale + 1, canvas.width, 1);
		ctx.fill();
		ctx.closePath();

		ctx.fillStyle = "#8B4513";
		ctx.font = "14px Arial";
        ctx.fillText("Y3", 0, canvas.height - (Number($("#y3").val()) + 1) * scale);

		ctx.beginPath();
		ctx.rect(0, canvas.height - (Number($("#y3").val()) + 1) * scale + 1, canvas.width, 1);
		ctx.fill();
		ctx.closePath();
	}
	
    renderObj(player);
}

function renderObj(obj) {
    ctx.beginPath();
    ctx.rect(obj.x * scale, canvas.height - obj.y * scale - obj.h * scale, obj.w * scale, obj.h * scale);
    ctx.fillStyle = (Math.abs(obj.velX) >= maxSpeed) ? "#FF0000" :  "#444444";
    ctx.fill();
    ctx.closePath();
}

function updateFormula() {
    var y1 = $("#y1").val();
    var y2 = $("#y2").val();
    var y3 = $("#y3").val();
    var l = $("#l").val();

    if(isNaN(y1) || isNaN(y2) || isNaN(y3) || isNaN(l) || y1 < 0 || y2 < y1 || y3 < y2 || l <= 0) {
        validFormula = false;
        $("#formula").html("V(t) = V0 + R*s - G*t + F*t*j");
        return;
    }

    V0 = 4 * y2 / l;
    G = 8 * y2 * y2 / (l * l * y1);
    F = 8 * y2 * (y2 - y1) / (l * l * y1);
    R = 4 * y2 * (Math.sqrt(y3 / y2) - 1) / l;

    $("#formula").html("V(t) = " + V0.toFixed(3) + " + " + R.toFixed(3) + "s - " + G.toFixed(3) + "t + " + F.toFixed(3) + "t*j");
	validFormula = true;
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
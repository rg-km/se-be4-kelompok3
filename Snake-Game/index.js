const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
let MOVE_INTERVAL = 150;

//variable untuk nambah kecepatan
const Kecepatan = [{ level: 1, value: MOVE_INTERVAL},{ level: 2, value: MOVE_INTERVAL-25},{ level: 3, value: MOVE_INTERVAL-40},{ level: 4, value: MOVE_INTERVAL-45},{ level: 5, value: MOVE_INTERVAL-50}];

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        point: 0,
        level : 1
    }
}
let snake1 = initSnake("black");
// let snake2 = initSnake("blue");

let apple = {
    color: "red",
    position: initPosition(),
}

let apple1 = {
    color: "blue",
    position: initPosition(),
}

function drawCell(ctx, x, y, color,imageapple = null) {
    ctx.fillStyle = color;
    if (imageapple == null) {
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else {
        ctx.drawImage(document.getElementById(imageapple), x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

//menampilkan kecepatan
function drawSpeed(snake) {
    let speedCanvas;
    speedCanvas = document.getElementById("KecepatanUlar");
    let speedCtx = speedCanvas.getContext("2d");

    speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedCtx.font = "30px Arial";
    speedCtx.fillStyle = "black";
    for (var i = 0; i < Kecepatan.length; i++) {
        if (snake.level == Kecepatan[i].level) {
            speedCtx.fillText(Kecepatan[i].value, 10, speedCanvas.scrollHeight / 2);
        }
    }
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else {
        scoreCanvas = document.getElementById("score2Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.point, 10, scoreCanvas.scrollHeight / 2);
}


function draw() {
    MunculinLevel(snake1.point);
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }
        // drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        // for (let i = 1; i < snake2.body.length; i++) {
        //     drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        // }
        drawCell(ctx, apple.position.x, apple.position.y, apple.color,"gambarapple");
        drawCell(ctx, apple1.position.x, apple1.position.y, apple1.color,"gambarapple");

        drawScore(snake1);
        // drawScore(snake2);
        drawSpeed(snake1)
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.point++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        MunculinLevel(snake.point);
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple1);
    
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple1);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple1);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple1);
}

function suaraUP(){
    var music = new Audio('assets/Level-Up-Sound-Effect.mp3');
    alert("Level Up");
    music.play();
}

function Snake(snake) {
    return {
        color: snake.color,
        ...initHeadAndBody(),
        direction: initDirection(),
        point: snake.point,
        level: snake.level,
    }
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        snake1 = Snake(snake1);
        snake1.level = 1;
        snake1.point = 0;
        snake1.speed = MOVE_INTERVAL;
        var music = new Audio('assets/GameOver.mp3');
        alert("GameOver");
        music.play();
        MunculinLevel(snake1.point);
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }

    // if (event.key === "a") {
    //     turn(snake2, DIRECTION.LEFT);
    // } else if (event.key === "d") {
    //     turn(snake2, DIRECTION.RIGHT);
    // } else if (event.key === "w") {
    //     turn(snake2, DIRECTION.UP);
    // } else if (event.key === "s") {
    //     turn(snake2, DIRECTION.DOWN);
    // }
})

//munculin level game
function MunculinLevel(point) {
    let level = document.getElementById("LevelGame");
    let Context = level.getContext("2d");
    if (point == 0) {
        Context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        Context.font = "30px arial";
        Context.fillStyle = snake1.color
        Context.fillText(snake1.level, 10, level.scrollHeight / 2);
    } else if ((point % 5) == 0) {
        snake1.level++;
        Context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        Context.font = "30px arial";
        Context.fillStyle = snake1.color
        Context.fillText(snake1.level, 10, level.scrollHeight / 2);
        suaraUP();
    }
    //untuk kecepatannya
    for (var i = 0; i < Kecepatan.length; i++) {
        if (snake1.level == Kecepatan[i].level) {
            MOVE_INTERVAL = Kecepatan[i].value;
        }
    }
}

function initGame() {
    move(snake1);
    // move(snake2);
}

initGame();
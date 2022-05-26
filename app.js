document.addEventListener("DOMContentLoaded", () => {
  //Enter code here
  const grid = document.querySelector(".grid"); //selects grid class from index.html file
  let squares = Array.from(document.querySelectorAll(".grid div")); //selects divs inside grid from index.html file
  const scoreDisplay = document.querySelector("#score"); //selects score id from index.html file
  const startBtn = document.querySelector("#start-button"); //selects start-button id from index.html file
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  //The Tetrominoes
  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const lTetromino = [
    [0, width, width * 2, width * 2 + 1],
    [0, 1, 2, width],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
  ];

  const sTetromino = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
  ];

  const zTetromino = [
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominos = [
    jTetromino,
    lTetromino,
    sTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentPosition = 4; //current position within the grid
  let currentRotation = 0; //tetromino rotation iteration

  //select random tetromino
  let random = Math.floor(Math.random() * theTetrominos.length); //select random number out of the number of tetrominos
  let current = theTetrominos[random][currentRotation]; //use random to select random tetromino to set as current

  //draw the tetromino
  function draw() {
    current.forEach((index) => {
      //for each block in the current tetromino
      squares[currentPosition + index].classList.add("tetromino"); //set square on grid as tetromino
    });
  }

  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      //for each block in the current tetromino
      squares[currentPosition + index].classList.remove("tetromino"); //unset square on grid as tetromino
    });
  }

  //assign functions to KeyCodes
  function control(e) {
    if (e.keyCode === 37) {
      //left arrow button
      moveLeft();
    } else if (e.keyCode === 38) {
      //up arrow button
      rotate();
    } else if (e.keyCode === 39) {
      //right arrow button
      moveRight();
    } else if (e.keyCode === 40) {
      //down arrow button
      moveDown();
    }
  }
  document.addEventListener("keyup", control); //when a key is hit, control()

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width; //set current position down one row
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    //if a block from tetromino is above a taken block
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      //set tetromino to taken
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start new tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      current = theTetrominos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unluess is at the edge or there is a blockage
  function moveLeft() {
    undraw(); //remove tetromino

    //boolean: is it at the left edge
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1; //not at left edge move left

    //if the space is already taken, move back
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;

    if (currentRotation === current.length) {
      //final tetromino iteration
      currentRotation = 0;
    }
    current = theTetrominos[random][currentRotation];
    draw();
  }

  //show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 5;
  let displayIndex = 6;

  //the tetromino without rotations
  const upNextTetromino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth * 2, displayWidth * 2 + 1],
    [1, 2, displayWidth, displayWidth + 1],
    [0, 1, displayWidth + 1, displayWidth + 2],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //display the next up shape
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
    });
    upNextTetromino[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
    });
  }

  //add function to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});

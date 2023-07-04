/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
//this comment below shows howw JS knows what to do with the y coordinates from the sub-arrays.
/*
y0: [null, nul, null],
y1: [null, nul, null]
*/

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    for (let i = 0; i < HEIGHT; i++) {
      let row = [];
      for (let j = 0; j < WIDTH; j++) {
        row.push(null);
      }
      board.push(row);
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {//ask about this one as well.
  for (let y = HEIGHT - 1; y >= 0; y--) {//descending loop
    //this checks if there is a piece in the lowest y-coordinate in the given column. if not, then it returns null. 
    //and if null that means the spot is empty and the function returns the empty spot's y coordinate. The descending loop is used to get the lowest point in the column because the highest point in the column would actually have the index of 0 because it is first in this case.
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const playedPiece = document.createElement('div');
  const tablePosition = document.getElementById(`${y}-${x}`);
  tablePosition.append(playedPiece);
  if(currPlayer === 1){
  playedPiece.classList.add("p1");
} else if(currPlayer === 2){
  playedPiece.classList.add("p2");
}
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  //this line of code below checks the column to see if there is an empty spot. If the whole column full then it returns nothing (ignores the click).
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer; //***ask about this whole function. Dindn't understand the instructions here*** this is assigning a num 1 or 2 into board[y][x] only seen on the JS side
  placeInTable(y, x); //changing the visual of what the user sees in the browser

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    // after the arrow is what the function returns. the arrow, returen and parameter make up the whole function. The 'cell' here can be null, 1 or 2. null is falsy while 1 or 2 is considered truthy (remember the model on line 104)
    return endGame('Tie!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
      //these 4 lines below check to makes sure the piece is within the bounds of the board.
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
        // this line above is another condition to be met it checks the cells to see if 4 pieces played belongs to the current player.
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    //a for loop to check every y-coordinate in the board
    for (let x = 0; x < WIDTH; x++) {
      //a for loop to check every x coordinate in the board
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];//this line checks to see if the player has four of their pieces in a horizontal line. [0,0],[0,1], [0,2], [0,3]
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];//in this line the vertical position changes positively while the horizontal position stays the same, indicating vertical movement
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];//in this line the x and y values change by positive 1 each so this simulates an upward diagonal movement to the right
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];//in this line the x value goes down by negative 1 each time while the y value goes up by positive 1 which indicates an upward diagonal movement to the left.
      //the loop checks every cell in the board to see if their adjacent cells satisfies one of the four lines above.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

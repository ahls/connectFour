/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
const htmlBoard = document.querySelector('#board');
const playerDisplay = document.querySelector('#currentPlayerDisplay')
let turnCount = 0;
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  turnCount = 0;
  board = [];
  for(let h = 0; h < HEIGHT;h++)
  {
    board.push([]);
    for(let w = 0; w <WIDTH;w++)
    {
      board[h].push(0)
    }
  }
  playerDisplay.classList.add('player1');
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //create a table row/cells that allows the user to interact
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //create rest of the rows and cells and assign approporiate ids to each cells.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let returnValue = null;
  for(let y = 0;y < HEIGHT;y++)
  {
    if(board[y][x] == 0)
    {
      returnValue = y;
    }
    else
    {
      break;
    }
  }
  return returnValue;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  board[y][x] = currPlayer
  
  const cell = document.getElementById(`${y}-${x}`)
  const piece = document.createElement('div')
  piece.classList.add(`player${currPlayer}`,'piece','falling')
  setTimeout(() => {
    piece.classList.remove('falling');
    console.log(piece);
  }, 50);
  cell.appendChild(piece);
  console.log(cell);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(`player ${currPlayer} won!`)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(CheckForTie())
  {
    return endGame('TIED!');
  }

  // switch players
  let nextPlayer =currPlayer == 1? 2:1; 
  
  playerDisplay.classList.replace(`player${currPlayer}`,`player${nextPlayer}`);
  currPlayer  = nextPlayer
}

/** CheckForTie: returns false if it is not tie.  */
function CheckForTie()
{
  turnCount += 1;
  return turnCount == WIDTH * HEIGHT;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer
  const _win = (cells)=>
    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH && //from top to bottom, terminate early if the x or y is out of bounds
        board[y][x] === currPlayer
    );
  

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) { // assigning all 4 possible combinations from each and every cell.
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

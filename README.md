# Gobblet!

## Description

Gobblet is a two-player board game. The objective of the game is to place four gobblets of the same size in a row, column, or diagonal. The game is played on a 4x4 board. Each player has 12 gobblets, which are of four different sizes. The sizes are 1, 2, 3 and 4. The larger gobblets can cover the smaller ones. The game starts with each player having 12 gobblets of size 1, 2, and 3. The players take turns placing one gobblet on the board. The gobblets can be placed on any empty square or on top of any gobblet that is already on the board. The game ends when one player has four gobblets in a row, column, or diagonal. The player with four in a row wins the game.

## How to run

### Visit live app! : https://gobblet.vercel.app/

To run the game, run the following command in the terminal:

```bash
npm install
npm run dev
```

or run the executable.

## Project features

### 1. Main UI

![mainui](./imgs/1.mainui.png)

Click the "Start" button to start the game. Click the "Game Options" button to change the game options.

### 2. Game options

#### 2.1. Game modes

![gameoptions](./imgs/2.1.gameoptions.png)

#### 2.2. Game difficulty

![gamedifficulty](./imgs/2.2.gamedifficulty.png)


### 3. Game Info Menu

It shows current game status.

![gameinfomenu](./imgs/3.gameinfomenu.png)

### 4. Winnig Dialog

![winnigdialog](./imgs/4.winnigdialog.png)


## Class Diagram


```mermaid
classDiagram
  class Game {
    - currentPlayer: Player
    - winner: Player
    - gameOptions: GameOptions
    + startGame(): void
    + playMove(row: int, cell: int): void
    + isGameOver(): boolean
  }

  class Board {
    - rows: Row[]
    + displayBoard(): void
    + isCellOccupied(row: int, cell: int): boolean
    + placePiece(row: int, cell: int, piece: Piece): void
    + removePiece(row: int, cell: int): void
    + hasWinningCombination(player: Player): boolean
  }

  class Row {
    - cells: Cell[]
    + displayRow(): void
    + isRowFull(): boolean
    + getCellContents(cell: int): Piece
  }

  class Cell {
    - piece: Piece
    + getPiece(): Piece
    + setPiece(piece: Piece): void
  }

  class Piece {
    - size: int
    - player: Player
    + getSize(): int
    + getPlayer(): Player
  }


  class GameOptions {
    - game_type: GameType
    - algorithm_1: Algorithm
    - algorithm_2: Algorithm
    - depth_1: number
    - depth_2: number
  }


  Game --|> Board
  Board --* Row : contains
  Row --* Cell : contains
  Cell --|> Piece
  Game -- GameOptions : has



```

```mermaid
classDiagram
  class GameType {
    <<enumeration>>
    PvP
    PvAI
    AIvAI
  }

  class Algorithm {
    <<enumeration>>
    Random
    Minimax
    AlphaBeta
    AlphaBetaWithIterativeDeepening
  }

    class Player {
    - color: String
    + getColor(): String
  }


```

### Sequence Diagram

```mermaid
sequenceDiagram
  participant Player
  participant Game
  participant GameOptions
  participant Board
  participant Row
  participant Cell
  participant Piece

  Player ->> Game: createGame(gameOptions)
  GameOptions ->> Game: {game_type, algorithm_1, algorithm_2, depth_1, depth_2}
  Game ->> Board: create new Board()
  Board ->> Row: create new Row() for each row
  Row ->> Cell: create new Cell() for each cell
  Board ->> Game: Board initialized



  Player ->> Game: playMove(row, cell)
  alt isGameOver
    Game ->> Board: isCellOccupied(row, cell)
    Board ->> Cell: getPiece()
    Cell ->> Piece: getPlayer()
    alt cell is not occupied
      Game ->> Board: placePiece(row, cell, piece)
      Board ->> Cell: setPiece(piece)
    else cell is occupied
      Game ->> Player: Invalid Move
    end
  else game is over
    Game ->> Player: Game Over
  end


```

### State Diagram
```mermaid

stateDiagram
  [*] --> NotStarted : startGame()
  NotStarted --> InProgress : startGame()

  InProgress --> PlayerTurn : playMove()
  PlayerTurn --> GameOver : isGameOver() [if true]
  PlayerTurn --> InProgress : playMove() 

  GameOver --> NotStarted : startGame()

```
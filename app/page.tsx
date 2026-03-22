import {
  GameBoard,
  GameBoardCell,
  GameBoardTile,
} from "@/components/game/game-board";
import { useGameBoard } from "@/hooks/game/use-game-board";

function Homepage() {
  const gameBoard = useGameBoard();

  return (
    <div className="grid min-h-screen place-items-center">
      <GameBoard rows={gameBoard.rows} columns={gameBoard.columns}>
        {gameBoard.cells.map((cell) => {
          return (
            <GameBoardCell
              key={`${cell.column}-${cell.row}`}
              column={cell.column}
              row={cell.row}
            />
          );
        })}
        {gameBoard.tiles.map((tile) => {
          return (
            <GameBoardTile
              key={`${tile.column}-${tile.row}`}
              row={tile.row}
              column={tile.column}
              value={tile.value}
            />
          );
        })}
      </GameBoard>
    </div>
  );
}

export default Homepage;

import * as React from "react";
import {
  GameBoard,
  GameBoardCell,
  GameBoardTile,
} from "@/components/game/game-board";
import { useGameBoard } from "@/hooks/game/use-game-board";
import { tileColors } from "@/data/colors";

function Homepage() {
  const gameBoard = useGameBoard();

  React.useEffect(() => {
    function handleMove(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "z") {
        gameBoard.undo();
      }

      gameBoard.setTiles((tiles) => {
        if (e.key === "ArrowRight") return gameBoard.moveTiles(tiles, "right");
        if (e.key === "ArrowLeft") return gameBoard.moveTiles(tiles, "left");
        if (e.key === "ArrowUp") return gameBoard.moveTiles(tiles, "up");
        if (e.key === "ArrowDown") return gameBoard.moveTiles(tiles, "down");

        return tiles;
      });
    }

    document.addEventListener("keydown", handleMove);

    return () => {
      document.removeEventListener("keydown", handleMove);
    };
  }, []);

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
              style={{
                backgroundColor: tileColors[tile.value]?.background,
                color: tileColors[tile.value]?.text,
              }}
            />
          );
        })}
      </GameBoard>
    </div>
  );
}

export default Homepage;

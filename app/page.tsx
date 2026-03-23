import * as React from "react";
import {
  GameBoard,
  GameBoardCell,
  GameBoardTile,
} from "@/components/game/game-board";
import { useGameBoard } from "@/hooks/game/use-game-board";
import { tileColors } from "@/data/colors";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Redo02Icon, RepeatIcon, Undo02Icon } from "@hugeicons/core-free-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Homepage() {
  const gameBoard = useGameBoard();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  React.useEffect(() => {
    function handleMove(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "z") {
        gameBoard.undo();
      }

      if (e.ctrlKey && e.key === "y") {
        gameBoard.redo();
      }

      if (e.key === "ArrowRight") return gameBoard.moveTiles("right");
      if (e.key === "ArrowLeft") return gameBoard.moveTiles("left");
      if (e.key === "ArrowUp") return gameBoard.moveTiles("up");
      if (e.key === "ArrowDown") return gameBoard.moveTiles("down");
    }

    document.addEventListener("keydown", handleMove);

    return () => {
      document.removeEventListener("keydown", handleMove);
    };
  }, []);

  React.useEffect(() => {
    if (gameBoard.hasWon || gameBoard.hasLost) {
      setIsAlertOpen(true);
    }
  }, [gameBoard.hasWon, gameBoard.hasLost]);

  function getHighestTileValue() {
    const [highestestTile] = gameBoard.tiles.toSorted(
      (a, b) => b.value - a.value,
    );

    const highestValue = highestestTile ? highestestTile.value : 0;

    return highestValue;
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <header className="bg-background fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
        <div className="container mx-auto flex h-[inherit] items-center justify-center gap-4 md:gap-8">
          <div className="bg-secondary rounded-lg px-4 py-2 text-center">
            <div className="text-sm font-semibold">SCORE</div>
            <div className="font-extrabold">{getHighestTileValue()}</div>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-4 md:gap-8">
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
        <ButtonGroup>
          <Button
            size="icon-lg"
            disabled={!gameBoard.canUndo}
            onClick={gameBoard.undo}
          >
            <HugeiconsIcon icon={Undo02Icon} />
          </Button>
          <Button
            size="icon-lg"
            disabled={!gameBoard.canRedo}
            onClick={gameBoard.redo}
          >
            <HugeiconsIcon icon={Redo02Icon} />
          </Button>
          <Button
            variant="secondary"
            size="icon-lg"
            onClick={() => {
              gameBoard.reset();
            }}
          >
            <HugeiconsIcon icon={RepeatIcon} />
          </Button>
        </ButtonGroup>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              {gameBoard.hasLost
                ? "You lost!"
                : gameBoard.hasWon
                  ? "You won!"
                  : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Wanna try again? Click new game!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsAlertOpen(false);
                gameBoard.reset();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Homepage;

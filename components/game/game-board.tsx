import { cn } from "@/lib/utils";
import * as React from "react";

const GAME_BOARD_ROWS = 4;
const GAME_BOARD_COLUMNS = 4;

interface GameBoardProps extends React.ComponentProps<"div"> {
  rows?: number;
  columns?: number;
}

function GameBoard({
  rows = GAME_BOARD_ROWS,
  columns = GAME_BOARD_COLUMNS,
  className,
  ...props
}: GameBoardProps) {
  return (
    <div
      style={
        {
          "--game-board-dimension-width": `calc((var(--game-board-cell-dimension-width) + var(--game-board-dimension-offset)) * ${columns} + var(--game-board-dimension-offset))`,
          "--game-board-dimension-height": `calc((var(--game-board-cell-dimension-height) + var(--game-board-dimension-offset)) * ${rows} + var(--game-board-dimension-offset))`,
        } as React.CSSProperties
      }
      className="inline-flex [--game-board-cell-dimension-height:--spacing(25)] [--game-board-cell-dimension-width:--spacing(25)] [--game-board-dimension-offset:--spacing(3)]"
    >
      <div
        className={cn(
          "bg-game-board relative h-(--game-board-dimension-height) w-(--game-board-dimension-width) rounded-[calc(var(--game-board-dimension-offset)+var(--spacing))]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface GameBoardCellProps extends React.ComponentProps<"div"> {
  row: number;
  column: number;
}

function GameBoardCell({
  row,
  column,
  className,
  ...props
}: GameBoardCellProps) {
  return (
    <div
      style={
        {
          "--game-board-cell-position-x": `calc((var(--game-board-cell-dimension-width) + var(--game-board-dimension-offset)) * ${column - 1} + var(--game-board-dimension-offset))`,
          "--game-board-cell-position-y": `calc((var(--game-board-cell-dimension-height) + var(--game-board-dimension-offset)) * ${row - 1} + var(--game-board-dimension-offset))`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "bg-game-board-cell absolute z-0 h-(--game-board-cell-dimension-height) w-(--game-board-cell-dimension-width) translate-x-(--game-board-cell-position-x) translate-y-(--game-board-cell-position-y) rounded-[calc(var(--game-board-dimension-offset)-var(--spacing))]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface GameBoardTileProps extends GameBoardCellProps {
  value: number;
}

function GameBoardTile({
  value,
  className,
  children,
  ...props
}: GameBoardTileProps) {
  const digitCount = String(value).length;

  const fontSize =
    digitCount <= 2
      ? "text-[calc(var(--game-board-cell-dimension-width)/2)]"
      : digitCount === 3
        ? "text-[calc(var(--game-board-cell-dimension-width)/3)]"
        : digitCount === 4
          ? "text-[calc(var(--game-board-cell-dimension-width)/4)]"
          : "text-[calc(var(--game-board-cell-dimension-width)/5)]";

  return (
    <GameBoardCell
      className={cn(
        "bg-primary text-primary-foreground z-10 flex items-center justify-center",
        className,
        fontSize,
      )}
      {...props}
    >
      <span className="animate-spawn origin-center font-semibold transition-transform select-none">
        {value}
      </span>
    </GameBoardCell>
  );
}

export { GameBoard, GameBoardCell, GameBoardTile };

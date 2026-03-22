import { cn } from "@/lib/utils";
import * as React from "react";

const GAME_BOARD_ROWS = 4;
const GAME_BOARD_COLUMNS = 4;

const GAME_BOARD_CELL_DIMENSION_WIDTH = 120;
const GAME_BOARD_CELL_DIMENSION_HEIGHT = 120;

const GAME_BOARD_DIMENSION_OFFSET = 12;

interface GameBoardDimension {
  height: number;
  width: number;
  offset: number;
}

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
  const dimension: GameBoardDimension = {
    width:
      (GAME_BOARD_CELL_DIMENSION_WIDTH + GAME_BOARD_DIMENSION_OFFSET) *
        columns +
      GAME_BOARD_DIMENSION_OFFSET,
    offset: GAME_BOARD_DIMENSION_OFFSET,
    height:
      (GAME_BOARD_CELL_DIMENSION_HEIGHT + GAME_BOARD_DIMENSION_OFFSET) * rows +
      GAME_BOARD_DIMENSION_OFFSET,
  };

  return (
    <div
      className="inline-flex"
      style={
        {
          "--game-board-dimension-width": `${dimension.width}px`,
          "--game-board-dimension-height": `${dimension.height}px`,
          "--game-board-dimension-offset": `${dimension.offset}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "bg-game-board relative h-(--game-board-dimension-height) w-(--game-board-dimension-width) rounded-[calc(var(--game-board-dimension-offset)-var(--spacing))]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface GameBoardCellDimension {
  width: number;
  height: number;
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
  const dimension: GameBoardCellDimension = {
    height: GAME_BOARD_CELL_DIMENSION_HEIGHT,
    width: GAME_BOARD_CELL_DIMENSION_WIDTH,
  };

  return (
    <div
      style={
        {
          "--game-board-cell-dimension-width": `${dimension.width}px`,
          "--game-board-cell-dimension-height": `${dimension.height}px`,
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
  return (
    <GameBoardCell
      className={cn(
        "bg-primary text-primary-foreground z-10 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <span className="animate-spawn origin-center text-[calc(var(--game-board-cell-dimension-width)/2)] leading-[calc(var(--game-board-cell-dimension-height)/2)] font-semibold transition-transform">
        {value}
      </span>
    </GameBoardCell>
  );
}

export { GameBoard, GameBoardCell, GameBoardTile };

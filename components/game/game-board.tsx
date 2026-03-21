import { cn } from "@/lib/utils";
import * as React from "react";

const GAME_BOARD_ROWS = 4;
const GAME_BOARD_COLUMNS = 4;

const GAME_BOARD_CELL_DIMENSION_WIDTH = 120;
const GAME_BOARD_CELL_DIMENSION_HEIGHT = 120;

const GAME_BOARD_DIMENSION_OFFSET = 12;
const GAME_BOARD_DIMENSION_WIDTH =
  (GAME_BOARD_CELL_DIMENSION_WIDTH + GAME_BOARD_DIMENSION_OFFSET) *
    GAME_BOARD_COLUMNS +
  GAME_BOARD_DIMENSION_OFFSET;

const GAME_BOARD_DIMENSION_HEIGHT =
  (GAME_BOARD_CELL_DIMENSION_HEIGHT + GAME_BOARD_DIMENSION_OFFSET) *
    GAME_BOARD_ROWS +
  GAME_BOARD_DIMENSION_OFFSET;

interface GameBoardDimension {
  height: number;
  width: number;
  offset: number;
}

interface GameBoardProps extends React.ComponentProps<"div"> {
  dimension?: GameBoardDimension;
}

function GameBoard({
  dimension = {
    height: GAME_BOARD_DIMENSION_HEIGHT,
    width: GAME_BOARD_DIMENSION_WIDTH,
    offset: GAME_BOARD_DIMENSION_OFFSET,
  },
  className,
  ...props
}: GameBoardProps) {
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
          "relative bg-game-board h-(--game-board-dimension-height) w-(--game-board-dimension-width) rounded-[calc(var(--game-board-dimension-offset)-var(--spacing))]",
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
  dimension?: GameBoardCellDimension;
}

function GameBoardCell({
  row,
  column,
  dimension = {
    height: GAME_BOARD_CELL_DIMENSION_HEIGHT,
    width: GAME_BOARD_CELL_DIMENSION_WIDTH,
  },
  className,
  ...props
}: GameBoardCellProps) {
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
          "bg-game-board-cell h-(--game-board-cell-dimension-height) w-(--game-board-cell-dimension-width) absolute rounded-[calc(var(--game-board-dimension-offset)-var(--spacing))] translate-x-(--game-board-cell-position-x) translate-y-(--game-board-cell-position-y) z-0",
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
        "z-10 bg-primary text-primary-foreground flex justify-center items-center",
        className,
      )}
      {...props}
    >
      <span className="font-semibold leading-[calc(var(--game-board-cell-dimension-height)/2)] text-[calc(var(--game-board-cell-dimension-width)/2)]">
        {value}
      </span>
    </GameBoardCell>
  );
}

export { GameBoard, GameBoardCell, GameBoardTile };

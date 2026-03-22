import * as React from "react";

const DEFAULT_GAME_BOARD_ROWS = 4;
const DEFAULT_GAME_BOARD_COLUMNS = 4;
const DEFAULT_GAME_BOARD_STARTING_TILE = 2;

type UseGameBoardProps = {
  rows?: number;
  columns?: number;
  startingTile?: number;
};

type Direction = "right" | "left" | "up" | "down";

function useGameBoard({
  rows = DEFAULT_GAME_BOARD_ROWS,
  columns = DEFAULT_GAME_BOARD_COLUMNS,
  startingTile = DEFAULT_GAME_BOARD_STARTING_TILE,
}: UseGameBoardProps = {}) {
  const [tiles, setTiles] = React.useState<Game.GameTile[]>([]);
  const cells = React.useMemo(
    () =>
      Array.from({ length: rows * columns }, (_, i) => {
        const column = (i % columns) + 1;
        const row = Math.floor(i / rows) + 1;

        return { column, row };
      }),
    [rows, columns],
  );

  function getEmptyCells(allTiles: Game.GameTile[]) {
    const emptyCells = cells.filter(
      (cell) =>
        !allTiles.some(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        ),
    );

    return emptyCells;
  }

  function getRandomCell(emptyCells: Game.GameCell[]) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex] ?? null;

    return randomCell;
  }

  function createRandomTile(randomCell: Game.GameCell) {
    const randomValue = Math.random() >= 0.5 ? 4 : 2;

    const randomTile: Game.GameTile = {
      ...randomCell,
      value: randomValue,
    };

    return randomTile;
  }

  function sortTiles(tiles: Game.GameTile[], direction: Direction) {
    const sortFn = (a: Game.GameTile, b: Game.GameTile) => {
      if (direction === "left") return a.column - b.column;
      if (direction === "right") return b.column - a.column;
      if (direction === "up") return a.row - b.row;

      return b.row - a.row;
    };

    const sortedTiles = tiles.toSorted(sortFn);

    return sortedTiles;
  }

  function groupTiles(tiles: Game.GameTile[], isHorizontal: boolean) {
    const groupFn = (tile: Game.GameTile) =>
      isHorizontal ? tile.row : tile.column;

    const groupedTiles = Object.groupBy(tiles, groupFn);

    return groupedTiles;
  }

  return {
    tiles,
    cells,
    rows,
    columns,
    setTiles,
  };
}

export { useGameBoard };

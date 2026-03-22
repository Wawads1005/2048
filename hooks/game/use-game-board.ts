import * as React from "react";

const DEFAULT_GAME_BOARD_ROWS = 4;
const DEFAULT_GAME_BOARD_COLUMNS = 4;

interface UseGameBoardProps {
  rows?: number;
  columns?: number;
}

function useGameBoard({
  rows = DEFAULT_GAME_BOARD_ROWS,
  columns = DEFAULT_GAME_BOARD_COLUMNS,
}: UseGameBoardProps = {}) {
  const [tiles, setTiles] = React.useState<Game.GameTile[]>([]);
  const cells = React.useMemo(
    () =>
      Array.from({ length: rows * columns }, (_, i) => {
        const column = Math.floor(i / columns) + 1;
        const row = (i % rows) + 1;

        return { column, row };
      }),
    [rows, columns],
  );

  function getEmptyCells(cells: Game.GameCell[]) {
    const emptyCells = cells.filter(
      (cell) =>
        !tiles.some(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        ),
    );

    return emptyCells;
  }

  function getRandomEmptyCell(emptyCells: Game.GameCell[]) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (!randomCell) {
      return null;
    }

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

  function spawnTile() {
    const emptyCells = getEmptyCells(cells);
    const randomCell = getRandomEmptyCell(emptyCells);

    if (!randomCell) {
      return;
    }

    const randomTile = createRandomTile(randomCell);

    setTiles((oldTiles) => [...oldTiles, randomTile]);
  }

  React.useEffect(() => {
    let initialized = false;

    if (!initialized) {
      spawnTile();

      initialized = true;
    }

    return () => {
      initialized = false;
    };
  }, []);

  return {
    tiles,
    cells,
    rows,
    columns,
  };
}

export { useGameBoard };

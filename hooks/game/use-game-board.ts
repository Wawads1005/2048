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

  function getEmptyCells(allCells: Game.GameCell[], allTiles: Game.GameTile[]) {
    const emptyCells = allCells.filter(
      (cell) =>
        !allTiles.some(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        ),
    );

    return emptyCells;
  }

  function getRandomEmptyCell(emptyCells: Game.GameCell[]) {
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

  function spawnTile(count: number = 1) {
    setTiles((oldTiles) => {
      let nextTiles = [...oldTiles];

      for (let index = 0; index < count; index++) {
        const emptyCells = getEmptyCells(cells, nextTiles);
        const randomCell = getRandomEmptyCell(emptyCells);

        if (!randomCell) {
          break;
        }

        const randomTile = createRandomTile(randomCell);

        nextTiles = [...nextTiles, randomTile];
      }

      return nextTiles;
    });
  }

  React.useEffect(() => {
    let initialized = false;

    if (!initialized) {
      spawnTile(2);

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

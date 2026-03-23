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
  const historyIndexRef = React.useRef(0);
  const historiesRef = React.useRef<Map<number, Game.GameTile[]>>(new Map());
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

  function mergeTiles(
    currentTile: Game.GameTile,
    nextTile: Game.GameTile,
    row: number,
    column: number,
  ) {
    const tile: Game.GameTile = {
      ...currentTile,
      value: currentTile.value + nextTile.value,
      row,
      column,
    };

    return tile;
  }

  function moveTiles(tiles: Game.GameTile[], direction: Direction) {
    const isHorizontal = direction === "left" || direction === "right";
    const maximumPosition = isHorizontal ? columns : rows;

    const sortedTiles = sortTiles(tiles, direction);
    const groupedTiles = groupTiles(sortedTiles, isHorizontal);

    let nextTiles: Game.GameTile[] = [];
    let hasMoved = false;

    for (const [group, currentTiles = []] of Object.entries(groupedTiles)) {
      const currentPosition = parseInt(group, 10);
      let nextPosition =
        direction === "left" || direction === "up" ? 1 : maximumPosition;

      while (currentTiles.length > 0) {
        const currentTile = currentTiles.shift()!;
        const nextTile = currentTiles[0];

        if (nextTile && nextTile.value === currentTile.value) {
          hasMoved = true;

          currentTiles.shift();

          const tile = mergeTiles(
            currentTile,
            nextTile,
            isHorizontal ? currentPosition : nextPosition,
            isHorizontal ? nextPosition : currentPosition,
          );

          nextTiles = [...nextTiles, tile];
        } else {
          const isMatched =
            (isHorizontal && currentTile.column !== nextPosition) ||
            (!isHorizontal && currentTile.row !== nextPosition);

          if (isMatched) {
            hasMoved = true;
          }

          const tile: Game.GameTile = {
            ...currentTile,
            row: isHorizontal ? currentPosition : nextPosition,
            column: isHorizontal ? nextPosition : currentPosition,
          };

          nextTiles = [...nextTiles, tile];
        }

        nextPosition += direction === "left" || direction === "up" ? 1 : -1;
      }
    }

    if (hasMoved) {
      historyIndexRef.current += 1;
      historiesRef.current.set(historiesRef.current.size + 1, tiles);

      const emptyCells = getEmptyCells(nextTiles);
      const randomCell = getRandomCell(emptyCells);

      if (randomCell) {
        const randomTile = createRandomTile(randomCell);
        nextTiles = [...nextTiles, randomTile];
      }
    }

    return nextTiles;
  }

  function undo() {
    if (historyIndexRef.current <= 0) {
      return;
    }

    setTiles((tiles) => {
      const foundHistory = historiesRef.current.get(historyIndexRef.current);

      if (!foundHistory) {
        return tiles;
      }

      historyIndexRef.current -= 1;

      return foundHistory;
    });
  }

  React.useEffect(() => {
    setTiles((tiles) => {
      for (let i = 0; i < startingTile; i++) {
        const emptyCells = getEmptyCells(tiles);
        const randomCell = getRandomCell(emptyCells);

        if (randomCell) {
          const randomTile = createRandomTile(randomCell);

          tiles = [...tiles, randomTile];
        }
      }

      return tiles;
    });

    return () => {
      historyIndexRef.current = 0;
      historiesRef.current = new Map();
    };
  }, []);

  return {
    tiles,
    cells,
    rows,
    columns,
    history,
    setTiles,
    moveTiles,
    undo,
  };
}

export { useGameBoard };

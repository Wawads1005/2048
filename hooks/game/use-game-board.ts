import * as React from "react";

const DEFAULT_GAME_BOARD_ROWS = 4;
const DEFAULT_GAME_BOARD_COLUMNS = 4;
const DEFAULT_GAME_BOARD_STARTING_TILE = 2;
const DEFAULT_WINNING_TILE_VALUE = 2048;

type UseGameBoardProps = {
  rows?: number;
  columns?: number;
  startingTile?: number;
  winningTileValue?: number;
};

type Direction = "right" | "left" | "up" | "down";

type GameBoardState = {
  tiles: Game.GameTile[];
  histories: Game.GameTile[][];
  historyIndex: number;
};

type GameBoardAction =
  | { type: "initialize"; tiles: Game.GameTile[] }
  | { type: "move"; direction: Direction }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset" };

function useGameBoard({
  rows = DEFAULT_GAME_BOARD_ROWS,
  columns = DEFAULT_GAME_BOARD_COLUMNS,
  startingTile = DEFAULT_GAME_BOARD_STARTING_TILE,
  winningTileValue = DEFAULT_WINNING_TILE_VALUE,
}: UseGameBoardProps = {}) {
  const cells = React.useMemo(
    () =>
      Array.from({ length: rows * columns }, (_, index) => {
        const column = (index % columns) + 1;
        const row = Math.floor(index / columns) + 1;

        return { column, row };
      }),
    [rows, columns],
  );

  function cloneTiles(allTiles: Game.GameTile[]) {
    return allTiles.map((tile) => ({ ...tile }));
  }

  function getEmptyCells(allTiles: Game.GameTile[]) {
    return cells.filter(
      (cell) =>
        !allTiles.some(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        ),
    );
  }

  function getRandomCell(emptyCells: Game.GameCell[]) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex] ?? null;
  }

  function createRandomTile(randomCell: Game.GameCell) {
    return {
      ...randomCell,
      value: Math.random() >= 0.5 ? 4 : 2,
    };
  }

  function createInitialTiles() {
    let nextTiles: Game.GameTile[] = [];

    for (let index = 0; index < startingTile; index++) {
      const emptyCells = getEmptyCells(nextTiles);
      const randomCell = getRandomCell(emptyCells);

      if (!randomCell) {
        break;
      }

      nextTiles = [...nextTiles, createRandomTile(randomCell)];
    }

    return nextTiles;
  }

  function sortTiles(allTiles: Game.GameTile[], direction: Direction) {
    return allTiles.toSorted((a, b) => {
      if (direction === "left") return a.column - b.column;
      if (direction === "right") return b.column - a.column;
      if (direction === "up") return a.row - b.row;

      return b.row - a.row;
    });
  }

  function groupTiles(allTiles: Game.GameTile[], isHorizontal: boolean) {
    return Object.groupBy(allTiles, (tile) =>
      isHorizontal ? tile.row : tile.column,
    );
  }

  function mergeTiles(
    currentTile: Game.GameTile,
    nextTile: Game.GameTile,
    row: number,
    column: number,
  ) {
    return {
      ...currentTile,
      value: currentTile.value + nextTile.value,
      row,
      column,
    };
  }

  function computeMovedTiles(allTiles: Game.GameTile[], direction: Direction) {
    const isHorizontal = direction === "left" || direction === "right";
    const maximumPosition = isHorizontal ? columns : rows;

    const sortedTiles = sortTiles(allTiles, direction);
    const groupedTiles = groupTiles(sortedTiles, isHorizontal);

    let nextTiles: Game.GameTile[] = [];
    let hasMoved = false;

    for (const [group, groupedTilesEntry = []] of Object.entries(
      groupedTiles,
    )) {
      const fixedPosition = parseInt(group, 10);
      const lineTiles = [...groupedTilesEntry];

      let targetPosition =
        direction === "left" || direction === "up" ? 1 : maximumPosition;

      while (lineTiles.length > 0) {
        const currentTile = lineTiles.shift()!;
        const nextTile = lineTiles[0];

        if (nextTile && nextTile.value === currentTile.value) {
          hasMoved = true;
          lineTiles.shift();

          nextTiles = [
            ...nextTiles,
            mergeTiles(
              currentTile,
              nextTile,
              isHorizontal ? fixedPosition : targetPosition,
              isHorizontal ? targetPosition : fixedPosition,
            ),
          ];
        } else {
          const didChangePosition =
            (isHorizontal && currentTile.column !== targetPosition) ||
            (!isHorizontal && currentTile.row !== targetPosition);

          if (didChangePosition) {
            hasMoved = true;
          }

          nextTiles = [
            ...nextTiles,
            {
              ...currentTile,
              row: isHorizontal ? fixedPosition : targetPosition,
              column: isHorizontal ? targetPosition : fixedPosition,
            },
          ];
        }

        targetPosition += direction === "left" || direction === "up" ? 1 : -1;
      }
    }

    if (!hasMoved) {
      return { nextTiles: allTiles, hasMoved: false };
    }

    const emptyCells = getEmptyCells(nextTiles);
    const randomCell = getRandomCell(emptyCells);

    if (randomCell) {
      nextTiles = [...nextTiles, createRandomTile(randomCell)];
    }

    return { nextTiles, hasMoved: true };
  }

  function hasAdjacentMerge(allTiles: Game.GameTile[]) {
    for (const tile of allTiles) {
      const rightNeighbor = allTiles.find(
        (candidateTile) =>
          candidateTile.row === tile.row &&
          candidateTile.column === tile.column + 1,
      );

      const bottomNeighbor = allTiles.find(
        (candidateTile) =>
          candidateTile.column === tile.column &&
          candidateTile.row === tile.row + 1,
      );

      if (rightNeighbor && rightNeighbor.value === tile.value) {
        return true;
      }

      if (bottomNeighbor && bottomNeighbor.value === tile.value) {
        return true;
      }
    }

    return false;
  }

  function getHasWon(allTiles: Game.GameTile[]) {
    return allTiles.some((tile) => tile.value >= winningTileValue);
  }

  function getHasLost(allTiles: Game.GameTile[]) {
    if (getEmptyCells(allTiles).length > 0) {
      return false;
    }

    return !hasAdjacentMerge(allTiles);
  }

  function reducer(
    state: GameBoardState,
    action: GameBoardAction,
  ): GameBoardState {
    if (action.type === "initialize") {
      const initialTiles = cloneTiles(action.tiles);

      return {
        tiles: initialTiles,
        histories: [initialTiles],
        historyIndex: 0,
      };
    }

    if (action.type === "move") {
      const { nextTiles, hasMoved } = computeMovedTiles(
        state.tiles,
        action.direction,
      );

      if (!hasMoved) {
        return state;
      }

      const nextHistoryIndex = state.historyIndex + 1;
      const trimmedHistories = state.histories.slice(0, nextHistoryIndex);
      const clonedNextTiles = cloneTiles(nextTiles);

      return {
        tiles: clonedNextTiles,
        histories: [...trimmedHistories, clonedNextTiles],
        historyIndex: nextHistoryIndex,
      };
    }

    if (action.type === "undo") {
      if (state.historyIndex <= 0) {
        return state;
      }

      const nextHistoryIndex = state.historyIndex - 1;
      const previousTiles = state.histories[nextHistoryIndex];

      if (!previousTiles) {
        return state;
      }

      return {
        ...state,
        tiles: cloneTiles(previousTiles),
        historyIndex: nextHistoryIndex,
      };
    }

    if (action.type === "redo") {
      if (state.historyIndex >= state.histories.length - 1) {
        return state;
      }

      const nextHistoryIndex = state.historyIndex + 1;
      const nextTiles = state.histories[nextHistoryIndex];

      if (!nextTiles) {
        return state;
      }

      return {
        ...state,
        tiles: cloneTiles(nextTiles),
        historyIndex: nextHistoryIndex,
      };
    }

    if (action.type === "reset") {
      const initialTiles = createInitialTiles();

      return {
        tiles: initialTiles,
        histories: [],
        historyIndex: 0,
      };
    }

    return state;
  }

  const [state, dispatch] = React.useReducer(reducer, {
    tiles: [],
    histories: [],
    historyIndex: 0,
  });

  React.useEffect(() => {
    const initialTiles = createInitialTiles();
    dispatch({ type: "initialize", tiles: initialTiles });
  }, [rows, columns, startingTile]);

  function moveTiles(direction: Direction) {
    dispatch({ type: "move", direction });
  }

  function undo() {
    dispatch({ type: "undo" });
  }

  function redo() {
    dispatch({ type: "redo" });
  }

  function reset() {
    dispatch({ type: "reset" });
  }

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.histories.length - 1;
  const hasWon = getHasWon(state.tiles);
  const hasLost = getHasLost(state.tiles);

  return {
    tiles: state.tiles,
    cells,
    rows,
    columns,
    moveTiles,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    hasWon,
    hasLost,
  };
}

export { useGameBoard };

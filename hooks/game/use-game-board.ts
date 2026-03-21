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

  return { tiles, cells, rows, columns };
}

export { useGameBoard };

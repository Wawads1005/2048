import * as React from "react";
import {
  GameBoard,
  GameBoardCell,
  GameBoardTile,
} from "@/components/game/game-board";

function Homepage() {
  const [rows] = React.useState(4);
  const [columns] = React.useState(4);

  return (
    <div className="min-h-screen grid place-items-center">
      <GameBoard rows={rows} columns={columns}>
        {Array.from({ length: rows * columns }, (_, i) => {
          const column = Math.floor(i / columns) + 1;
          const row = (i % rows) + 1;

          return <GameBoardCell row={row} column={column} />;
        })}
        <GameBoardTile value={2} row={1} column={1} />
      </GameBoard>
    </div>
  );
}

export default Homepage;

import * as React from "react";

interface GameBoardProps extends React.ComponentProps<"div"> {}

function GameBoard({ className, children, ...props }: GameBoardProps) {
  return <div>GameBoard</div>;
}

export { GameBoard };

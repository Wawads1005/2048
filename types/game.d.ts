declare namespace Game {
  interface GameCell {
    row: number;
    column: number;
  }

  interface GameTile extends GameCell {
    value: number;
  }
}

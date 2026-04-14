const MOVES = ["L", "R", "U", "D", "F", "B"];
const MODIFIERS = ["", "'", "2"];

export function generateScramble(length = 20) {
  const scramble = [];
  let lastMoveIndex = -1;
  let secondLastMoveIndex = -1;

  while (scramble.length < length) {
    const moveIndex = Math.floor(Math.random() * MOVES.length);
    
    // Avoid double face moves like R R'
    if (moveIndex === lastMoveIndex) continue;
    
    // Avoid redundant parallel slice moves like L R L
    if (Math.floor(moveIndex / 2) === Math.floor(lastMoveIndex / 2) && moveIndex === secondLastMoveIndex) {
      continue;
    }

    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    scramble.push(MOVES[moveIndex] + modifier);

    secondLastMoveIndex = lastMoveIndex;
    lastMoveIndex = moveIndex;
  }

  return scramble;
}

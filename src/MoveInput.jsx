import { useState } from 'react'
import { executeMove } from './moves'

export default function MoveInput({ cubeGroup, rotationGroup, rotate, resetCube }) {
  const [input, setInput] = useState('')

  function runMovesSequentially(moves) {
    let index = 0

    function nextMove() {
      if (index >= moves.length) return

      // Safety check
      if (!cubeGroup?.current || !rotationGroup?.current) {
        console.error("Cube groups not ready")
        return
      }

      executeMove(moves[index], cubeGroup, rotationGroup, rotate)

      index++

      // Wait slightly longer than animation duration
      setTimeout(nextMove, 500)
    }

    nextMove()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const moves = input.trim().split(/[ ,]+/).filter(Boolean)

    if (moves.length === 0) return

    runMovesSequentially(moves)

    setInput('')
  }

  const handleReset = () => {
    if (resetCube) {
      resetCube()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10
      }}
    >
      <input
        type="text"
        placeholder="Enter moves (ex: R U R')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button type="submit">Run</button>

      {/* VERY IMPORTANT */}
      <button type="button" onClick={handleReset}>
        Reset Cube
      </button>
    </form>
  )
}

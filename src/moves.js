export function executeMove(move, cubeGroup, rotationGroup, rotate) {
  if (!cubeGroup.current || !rotationGroup.current) {
    console.warn('Cube not ready yet')
    return
  }
  switch (move) {
    // ===== LEFT =====
    case 'L':
      rotate(cubeGroup.current, rotationGroup.current, 'x', -1, 1)
      break

    case "L'":
      rotate(cubeGroup.current, rotationGroup.current, 'x', -1, -1)
      break

    case 'L2':
      rotate(cubeGroup.current, rotationGroup.current, 'x', -1, 2)
      break


    // ===== RIGHT =====
    case 'R':
      rotate(cubeGroup.current, rotationGroup.current, 'x', 1, -1)
      break

    case "R'":
      rotate(cubeGroup.current, rotationGroup.current, 'x', 1, 1)
      break

    case 'R2':
      rotate(cubeGroup.current, rotationGroup.current, 'x', 1, -2)
      break


    // ===== UP =====
    case 'U':
      rotate(cubeGroup.current, rotationGroup.current, 'y', 1, -1)
      break

    case "U'":
      rotate(cubeGroup.current, rotationGroup.current, 'y', 1, 1)
      break

    case 'U2':
      rotate(cubeGroup.current, rotationGroup.current, 'y', 1, -2)
      break


    // ===== DOWN =====
    case 'D':
      rotate(cubeGroup.current, rotationGroup.current, 'y', -1, 1)
      break

    case "D'":
      rotate(cubeGroup.current, rotationGroup.current, 'y', -1, -1)
      break

    case 'D2':
      rotate(cubeGroup.current, rotationGroup.current, 'y', -1, 2)
      break


    // ===== FRONT =====
    case 'F':
      rotate(cubeGroup.current, rotationGroup.current, 'z', 1, -1)
      break

    case "F'":
      rotate(cubeGroup.current, rotationGroup.current, 'z', 1, 1)
      break

    case 'F2':
      rotate(cubeGroup.current, rotationGroup.current, 'z', 1, -2)
      break


    // ===== BACK =====
    case 'B':
      rotate(cubeGroup.current, rotationGroup.current, 'z', -1, 1)
      break

    case "B'":
      rotate(cubeGroup.current, rotationGroup.current, 'z', -1, -1)
      break

    case 'B2':
      rotate(cubeGroup.current, rotationGroup.current, 'z', -1, 2)
      break


    default:
      console.warn('Invalid move:', move)
  }
}

export function resetCube(cubeGroup, rotationGroup) {
  if (!cubeGroup || !rotationGroup) return

  // Move all cubelets back to main group
  rotationGroup.children
    .slice()
    .reverse()
    .forEach((cubelet) => {
      cubeGroup.attach(cubelet)
    })

  // Reset rotation group
  rotationGroup.rotation.set(0, 0, 0)
  rotationGroup.quaternion.set(0, 0, 0, 1)

  // Reset each cubelet fully
  cubeGroup.children.forEach((cubelet) => {

    // Snap position
    cubelet.position.set(
      Math.round(cubelet.position.x),
      Math.round(cubelet.position.y),
      Math.round(cubelet.position.z)
    )

    // Reset orientation
    cubelet.rotation.set(0, 0, 0)
    cubelet.quaternion.set(0, 0, 0, 1)

    // 🔥 Force Three.js to rebuild transforms
    cubelet.updateMatrix()
    cubelet.updateMatrixWorld()
  })
}


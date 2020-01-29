
const Assign = {
  assign() {
    let distMatrix = []
    for (let point of App.points) {
      let distArray = []
      for (let id = 0; id < App.max; id++) {
        let robot = App.scene.getObjectByName(id)
        let dist = Math.sqrt(
          (point.x - robot.position.x)**2 +
          (point.y - robot.position.y)**2
        )
        distArray.push(dist)
      }
      distMatrix.push(distArray)
    }
    return distMatrix
  }

}

export default Assign
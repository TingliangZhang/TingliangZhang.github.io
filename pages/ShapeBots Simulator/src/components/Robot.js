import * as THREE from 'three'

const Robot = {
  addRobots() {
    for (let id = 0; id < App.max; id++) {
      let xsign = Math.random() > 0.5 ? 1 : -1
      let ysign = Math.random() > 0.5 ? 1 : -1
      let x = Math.random() * 10 * xsign
      let y = Math.random() * 10 * ysign
      this.addRobot(id, x, y)
    }
  },

  addRobot(id, x, y) {
    let robotGeometry = new THREE.CubeGeometry(1, 1, 1)
    let robotMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      opacity: 1,
      transparent: true
    })
    robotMaterial.color.setRGB(0.3, 0.3, 0.3)
    let robot = new THREE.Mesh(robotGeometry, robotMaterial)
    let wireGeometry = new THREE.EdgesGeometry(robotGeometry)
    let wireMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    })

    robot.velocity = { x: 0, y: 0 }
    robot.prefSpeed = 0.5
    robot.size = 1

    robot.wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial)
    robot.isRobot = true
    robot.robotId = id
    robot.name = id
    robot.position.x = x
    robot.position.y = y
    robot.wireMesh.name = `${id}-wire`
    robot.wireMesh.position.copy(robot.position)
    robot.updateMatrix()
    robot.overdraw = false
    // this.pin = pin
    App.scene.add(robot)
    App.scene.add(robot.wireMesh)
  },

  resetRobots(newMax) {
    for (let id = 0; id < App.max; id++) {
      let robot = App.scene.getObjectByName(id)
      App.scene.remove(robot)
      App.scene.remove(robot.wireMesh)
    }
    App.max = Number(newMax)
    this.addRobots()
  }


}

export default Robot
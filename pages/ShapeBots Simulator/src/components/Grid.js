import * as THREE from 'three'

const Grid = {
  addGrid() {
    let size = 100
    let divisions = 100
    let grid = new THREE.GridHelper(size, divisions)
    grid.geometry.rotateX( Math.PI / 2 )
    grid.position.z = -0.5
    App.grid = grid
    App.scene.add(grid)
  }
}

export default Grid
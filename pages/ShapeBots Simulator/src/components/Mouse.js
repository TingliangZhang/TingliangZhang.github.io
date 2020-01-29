
const Mouse = {
  init() {
    App.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    App.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    App.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false)
  },

  onMouseDown(event) {
    return false
    event.preventDefault()
    this.isMouseDown = true
    this.onMouseDownPosition.x = event.clientX
    this.onMouseDownPosition.y = event.clientY

    let intersect = this.getIntersecting()
    if (intersect) {
      this.currentObject = intersect.object
      this.controls.enabled = false

      let id = this.currentObject.name
      console.log(id)
      let ids = this.state.ids
      if (this.state.ids.includes(id)) {
        ids = _.difference(ids, [id])
      } else {
        if (this.state.single) {
          ids = [id]
        } else {
          ids = _.union(ids, [id])
        }
      }
      this.setState({ ids: ids })
      console.log(this.state.ids)
    }
  },

  onMouseMove(event) {
    return false
    event.preventDefault()
    this.mouse2D.x = (event.clientX / this.width) * 2 - 1
    this.mouse2D.y = - (event.clientY / this.height) * 2 + 1

    this.scene.children.filter((c) => c.isPin).map((c) => {
      if (this.broken.includes(c.name)) {
        c.material.color.setRGB(0.7, 0.7, 0.7)
      } else {
        let pos = c.position.y
        c.material.color.setHSL(0.1, pos * 0.2, 0.5)
        if (pos < 0) {
          c.material.color.setHSL(0.1, 1 + pos * 0.2, 0.3)
        }
      }
    })

    let intersect = this.getIntersecting()
    if (intersect) {
      if (this.isMouseDown && this.currentObject) {
        let vector = new THREE.Vector3(this.mouse2D.x, this.mouse2D.y, -1).unproject(this.camera)
        // this.currentObject.position.y = vector.z
      } else {
        intersect.object.material.color.setRGB(0.5, 0, 0)
      }

      let id = intersect.object.name
      console.log(id)
      let ids = this.state.ids
      // if (this.state.ids.includes(id)) {
      //   ids = _.difference(ids, [id])
      // } else {
        // ids = _.union(ids, [id])
      // }
      // this.setState({ ids: ids })
      console.log(this.state.ids)

    }
  },

  onMouseUp(event) {
    return false
    event.preventDefault()
    this.isMouseDown = false
    this.controls.enabled = true
    this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x
    this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y

    if (this.onMouseDownPosition.length() > 5) return
    let intersect = this.getIntersecting()
    if (intersect) {
    }
  },

  getIntersecting() {
    let intersectable = []
    this.scene.children.map((c) => { if (c.isPin) intersectable.push(c) })

    this.raycaster.setFromCamera(this.mouse2D, this.camera)
    let intersections = this.raycaster.intersectObjects( intersectable )
    if (intersections.length > 0) {
      let intersect = intersections[0]
      return intersect
    }
  }
}

export default Mouse

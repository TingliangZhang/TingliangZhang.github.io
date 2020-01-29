import React, { Component } from 'react'
import _ from 'lodash'

import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'

import Menu from './Menu'

import Grid from './Grid'
import Robot from './Robot'

import Draw from './Draw'
import Visualize from './Visualize'
import Assign from './Assign'

import Move from './Move'
import Mouse from './Mouse'


class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this
    this.state = {}

    this.max = 60
    this.type = 'horizontal'
    this.graph = 'dots'

    this.targets = {}

    this.width = 1000
    this.height = 800

    // this.width = 700
    // this.height = 600

    this.raycaster = new THREE.Raycaster()
    this.mouse2D = new THREE.Vector3(0, 10000, 0.5)
    this.radius = 1600
    this.theta = 90
    this.phi = 60
    this.onMouseDownPosition = new THREE.Vector2()
    this.onMouseDownPhi = 60
    this.onMouseDownTheta = 45
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    camera.position.set(0, -10, 50) // ryo
    camera.up.set(0, 0, 1)

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0

    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.renderer = renderer

    this.mount.appendChild(this.renderer.domElement)
    this.init()
  }

  init() {
    Mouse.init()
    // Grid.addGrid() ryo
    Robot.addRobots()
    this.renderScene()
    this.start()
  }

  renderScene() {
    let target = new THREE.Vector3(0, 10, 0)
    this.camera.lookAt(target)
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate.bind(this))
    }
  }

  animate() {
    this.controls.update()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate.bind(this))
    Move.move()
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
          style={{ width: this.width, height: this.height }}
          ref={(mount) => { this.mount = mount }}
        />
        <Menu />
      </div>
    )
  }
}

export default App
import munkres from 'munkres-js'

import Move from './Move'
import Assign from './Assign'

const Visualize = {

  visualize() {
    switch (App.graph) {
      case 'dots':
        this.visualizeDots()
        break
      case 'lines':
        this.visualizeLines()
        break
      case 'bars':
        this.visualizeBars()
        break
    }

    let distMatrix = Assign.assign()
    let ids = munkres(distMatrix)
    let rids = [...Array(App.max).keys()]
    for (let id of ids) {
      let pid = id[0]
      let rid = id[1]
      let point = App.points[pid]
      Move.moveRobot(rid, point.x, point.y, point.angle, point.length)
      _.pull(rids, rid)
    }
    console.log(rids)
    let i = 0
    for (let rid of rids) {
      Move.moveRobot(rid, i, -5)
      i++
    }
  },

  visualizeDots() {
    let graph = this.getGraph()
    App.points = graph.points
  },

  visualizeLines() {
    let graph = this.getGraph()
    let lines = graph.lines
    let points = []
    for (let line of lines) {
      let p1 = line[0]
      let p2 = line[1]
      let dx = p2.x - p1.x
      let dy = p2.y - p1.y
      let dist = Math.sqrt(dx**2 + dy**2)
      let center = { x: (p2.x + p1.x)/2, y: (p2.y + p1.y)/2 }
      let angle = Math.atan2(dx, dy)
      let point = {
        x: center.x,
        y: center.y,
        angle: -angle,
        length: dist,
      }
      points.push(point)
    }
    App.points = points
  },

  visualizeBars() {
    let graph = this.getGraph()
    let points = []
    for (let dot of graph.points) {
      let point = {
        x: dot.x,
        y: dot.y / 2,
        angle: Math.PI,
        length: dot.y,
      }
      points.push(point)
    }
    App.points = points
  },

  getGraph() {
    if (!App.data) return
    let points = []
    let index = 0
    let maxX = 0
    let minY = Infinity
    let maxY = 0
    for (let item of App.data) {
      let x = index
      let y = item.value
      maxX = Math.max(maxX, Math.abs(x))
      minY = Math.min(minY, Math.abs(y))
      maxY = Math.max(maxY, Math.abs(y))
      points.push({ x: x, y: y, group: 0 })
      index++
    }

    let scaleY = 1/3
    let offsetX = - maxX / 2
    let offsetY = - maxY / 2

    points = points.map((point) => {
      return { x: point.x + offsetX, y: (point.y +offsetY) * scaleY, group: point.group }
    })

    let ratio = Math.round(points.length / App.max)
    points = points.map((point, i) => {
      if (ratio === 0 || i % ratio === 0) return point
    })
    points = _.compact(points)
    console.log(points)


    let prev
    let lines = []
    for (let point of points) {
      if (prev && prev.group === point.group) {
        let line = [prev, point]
        lines.push(line)
      }
      prev = point
    }
    return { points: points, lines: lines }
  }

}

export default Visualize
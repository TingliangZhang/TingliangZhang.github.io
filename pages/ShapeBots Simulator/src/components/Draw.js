import munkres from 'munkres-js'
import parse from 'parse-svg-path'
import getContours from 'svg-path-contours'
import simplify from 'simplify-path'

import Move from './Move'
import Assign from './Assign'

const Draw = {
  draw() {
    switch (App.type) {
      case 'horizontal':
        this.drawLines()
        break
      case 'none':
        this.drawDots()
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
      Move.moveRobot(rid, i, -30) // 30 ryo
      i++
    }
  },

  drawDots() {
    let outline = this.getOutline()
    App.points = outline.points
  },

  drawLines() {
    let outline = this.getOutline()
    let lines = outline.lines
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

  getOutline() {
    if (!App.pathData) return
    let path = parse(App.pathData)
    let contours = getContours(path)
    let scale = 0.1 // 1 ryo
    let ryo = 2
    scale = scale * ryo

    let points = []
    let group = 0
    let maxX = 0
    let maxY = 0
    for (let contour of contours) {
      contour = simplify.radialDistance(contour, 1)
      for (let point of contour) {
        let x = point[0] * scale
        let y = -point[1] * scale
        maxX = Math.max(maxX, Math.abs(x))
        maxY = Math.max(maxY, Math.abs(y))
        points.push({ x: x, y: y, group: group })
      }
      group++
    }

    // let offsetX = - maxX / 2 ryo
    // let offsetY = + maxY / 2 ryo

    let offsetX = - maxX / 2 - 12 * ryo
    let offsetY = + maxY / 2 + 275 * ryo

    points = points.map((point) => {
      return { x: point.x + offsetX, y: point.y + offsetY, group: point.group }
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

export default Draw
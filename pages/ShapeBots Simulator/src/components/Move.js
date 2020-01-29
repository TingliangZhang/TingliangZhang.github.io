
// parameters
const enableRvo = false
const acceleration = 1
const avoidanceTendency = 10

const Move = {

  moveRobot(id, x, y, angle, length) {
    if (!angle) angle = 0
    if (!length) length = 1
    for (let id = 0; id < App.max; id++) {
      let robot = App.scene.getObjectByName(id)
      robot.init = false
    }

    App.targets[id] = { x: x, y: y, angle: angle, length: length }
  },

  move() {
    for (let id = 0; id < App.max; id++) {
      let robot = App.scene.getObjectByName(id)
      let current = {
        x: robot.position.x,
        y: robot.position.y,
        angle: robot.rotation.z,
        length: robot.scale.y,
      }
      let target = App.targets[id]
      if (!target) continue

      let diff = {
        x: target.x - current.x,
        y: target.y - current.y,
        angle: target.angle - current.angle,
        length: target.length - current.length
      }
      if (!robot.init) {
        if (robot.scale.y > 1) {
          robot.scale.y -= 0.1
          robot.wireMesh.scale.y -= 0.1
          continue
        } else {
          robot.init = true
        }
      }

      if (Math.abs(diff.x) < 1 && Math.abs(diff.y) < 1 && Math.abs(diff.angle) < 0.1) {
        if (Math.abs(diff.length) > 0.1) {
          robot.scale.y += diff.length / 30
          robot.wireMesh.scale.y += diff.length / 30
        }
      }

      if (enableRvo) {
        const dt = 0.1
        const v = this.getRvoVelocity(id, dt)
        robot.velocity.x = v.x
        robot.velocity.y = v.y
        robot.position.x += dt * robot.velocity.x
        robot.position.y += dt * robot.velocity.y
        robot.rotation.z += diff.angle / 50
        robot.wireMesh.position.x = robot.position.x
        robot.wireMesh.position.y = robot.position.y
        robot.wireMesh.rotation.z += diff.angle / 50
      } else {
        robot.position.x += diff.x / 100
        robot.position.y += diff.y / 100
        robot.rotation.z += diff.angle / 50
        robot.wireMesh.position.x = robot.position.x
        robot.wireMesh.position.y = robot.position.y
        robot.wireMesh.rotation.z = robot.rotation.z
      }

    }
  },

  getCollisionTime(id, vx, vy) {
    let tmin = Infinity
    let a = App.scene.getObjectByName(id)

    for (let i = 0; i < App.max; i++) {
      if (i == id) continue;

      const b = App.scene.getObjectByName(i)
      const ux = 2 * vx - a.velocity.x - b.velocity.x
      const uy = 2 * vy - a.velocity.y - b.velocity.y
      const dx = b.position.x - a.position.x
      const dy = b.position.y - a.position.y
      const s = a.size + b.size
      const c2 = ux * ux + uy * uy
      const c1 = -2 * (ux * dx + uy * dy)
      const c0 = dx * dx + dy * dy - s * s

      let t = Infinity;
      if (c2 == 0) {
        t = -c0 / c1
      } else {
        const discriminant = c1 * c1 - 4 * c2 * c0
        if (discriminant >= 0) {
          const sq = Math.sqrt(discriminant)
          const t1 = (-c1 - sq) / (2 * c2)
          const t2 = (-c1 + sq) / (2 * c2)
          if (c0 < 0) {
            t = 0;  // Already collided!
          } else if (c1 <= 0) {
            t = t1;
          }
        }
      }

      if (t < tmin) {
        tmin = t
      }
    }
    return tmin
  },

  getRvoVelocity(id, dt) {
    const accel = acceleration
    const w = avoidanceTendency

    const a = App.scene.getObjectByName(id)
    const target = App.targets[id]
    if (!target) return { x: 0, y: 0 }

    let prefVx = target.x - a.position.x
    let prefVy = target.y - a.position.y
    const l = Math.sqrt(prefVx**2 + prefVy**2)
    if (l > 1) {
      prefVx *= a.prefSpeed / l
      prefVy *= a.prefSpeed / l
    }

    // const scale = 20
    // this.ctx.fillRect(a.x + scale * prefVx - 1, a.y + scale * prefVy - 1, 3, 3);

    let rvoVx = prefVx
    let rvoVy = prefVy
    let min = Infinity

    for (let i = 0; i < 100; i++) {
      const vx = a.velocity.x + accel * dt * (2 * Math.random() - 1)
      const vy = a.velocity.y + accel * dt * (2 * Math.random() - 1)
      const collisionTime = this.getCollisionTime(id, vx, vy)
      const dvx = vx - prefVx
      const dvy = vy - prefVy
      const penalty = w / collisionTime + Math.sqrt(dvx**2 + dvy**2)
      if (penalty < min) {
        rvoVx = vx
        rvoVy = vy
        min = penalty
      }
    }

    // this.ctx.beginPath();
    // this.ctx.moveTo(a.x, a.y);
    // this.ctx.lineTo(a.x + scale * rvoVx, a.y + scale * rvoVy);
    // this.ctx.stroke();

    return { x: rvoVx, y: rvoVy };
  },

}

export default Move
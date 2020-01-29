import React, { Component } from 'react'
import simpleIcons from 'simple-icons'

import data from './data.json'

import Robot from './Robot'
import Draw from './Draw'
import Visualize from './Visualize'


class Menu extends Component {
  constructor(props) {
    super(props)
    window.menu = this

    let icons = []
    let keys = Object.keys(simpleIcons)
    for (let key of keys) {
      let logo = simpleIcons[key]
      let icon = {
        name: logo.title,
        svg: logo.svg
      }
      icons.push(icon)
    }

    this.icons = icons
    this.graphs = ['dots', 'lines', 'bars']
    this.sources = ['data']

    this.state = {
      type: App.type,
      max: App.max,
      graph: App.graph,
      icon: null,
      source: null,
    }
  }

  componentDidMount() {
    this.onDrawLogo()
  }

  onDrawLogo() {
    $.get('/sigchi.svg', function(svg){
      // let svg = icon.svg
      let parser = new DOMParser()
      let dom = parser.parseFromString(svg, 'text/xml')
      let d = dom.querySelector('path').getAttribute('d')
      console.log(d)
      App.pathData = d
      Draw.draw()
    }, 'text')
  }

  onChangeSvg(event) {
    let id = event.target.value
    let icon = this.icons[id]
    this.setState({ icon: icon })
    let svg = icon.svg
    let parser = new DOMParser()
    let dom = parser.parseFromString(svg, 'text/xml')
    let d = dom.querySelector('path').getAttribute('d')
    App.pathData = d
    Draw.draw()
  }

  onChangeType(event) {
    let type = event.target.value
    this.setState({ type: type })
    App.type = type
    Draw.draw()
  }

  onChangeNumber(event) {
    let max = event.target.value
    this.setState({ max: max })
    Robot.resetRobots(max)
  }

  onChangeGraph(event) {
    let graph = event.target.value
    this.setState({ graph: graph })
    App.graph = graph
    Visualize.visualize()
  }

  onChangeSource(event) {
    let source = event.target.value
    this.setState({ source: source })
    App.data = data
    Visualize.visualize()
  }

  render() {
    return (
      <div id="menu">
        <div className="ui form">
          <h3>Settings</h3>
          <div className="field">
            <label>Robot Type</label>
            <div className="field">
              <div className="ui radio checkbox">
                <input type="radio" value="horizontal" checked={ this.state.type === 'horizontal' } onChange={ this.onChangeType.bind(this) } />
                <label>ShapeBots</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input type="radio" value="none" checked={ this.state.type === 'none' } onChange={ this.onChangeType.bind(this) }/>
                <label>Swarm Robots</label>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Number of Robots</label>
            <select className="ui dropdown" onChange={this.onChangeNumber.bind(this)}>
              <option value="">{ App.max }</option>
              { [...Array(20).keys()].map(i => (i + 1) * 10).map((num, id) => {
                return (
                  <option key={ id } value={ num }>{num}</option>
                )
              })}
            </select>
          </div>
          <div className="ui divider"></div>
          <h3>Display</h3>
          <div className="field">
            <label>SVG</label>
            <select className="ui dropdown" onChange={this.onChangeSvg.bind(this)}>
              <option value="">Select SVG</option>
              { this.icons.map((icon, id) => {
                return (
                  <option key={ id } value={ id }>{icon.name}</option>
                )
              })}
            </select>
          </div>
          <div className="ui divider"></div>
          <h3>Data Viz</h3>
          <div className="field">
            <label>Graph Type</label>
            <select className="ui dropdown" onChange={this.onChangeGraph.bind(this)}>
              { this.graphs.map((graph, id) => {
                return (
                  <option key={ id } value={ graph }>{ graph }</option>
                )
              })}
            </select>
          </div>
          <div className="field">
            <label>Data Source</label>
            <select className="ui dropdown" onChange={this.onChangeSource.bind(this)}>
              <option value="">Select Data Source</option>
              { this.sources.map((source, id) => {
                return (
                  <option key={ id } value={ source }>{ source }</option>
                )
              })}
            </select>
          </div>

        </div>
      </div>
    )
  }
}

export default Menu
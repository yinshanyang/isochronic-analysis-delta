const path = require('path')
const json = require('node-json')
const turf = require('@turf/helpers')
const _ = require('lodash')
const program = require('commander')

program
  .version(require('./package.json').version)
  .option('-a, --a <path>', 'Path to first GeoJSON, `./data/a.geo.json`')
  .option('-b, --b <path>', 'Path to second GeoJSON, `./data/b.geo.json`')
  .option('-o, --output <path>', 'Path to save output GeoJSON, `./output/delta.geo.json`')
  .parse(process.argv)

const A = program.a || './data/a.geo.json'
const B = program.b || './data/b.geo.json'
const OUTPUT = program.output || './output/delta.geo.json'

const geojsons = {
  a: json.read(path.resolve(__dirname, A)),
  b: json.read(path.resolve(__dirname, B))
}

const features = _.zip(
    geojsons.a.features,
    geojsons.b.features
  )
  .map(([ a, b ]) => {
    const value = a.properties.value - b.properties.value
    const feature = Object.assign({}, a, {
      properties: { value }
    })
    return feature
  })

json.write(path.resolve(__dirname, OUTPUT), turf.featureCollection(features))

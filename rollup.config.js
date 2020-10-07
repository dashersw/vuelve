import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const input = 'src/index.js'
const outputName = 'vuelve'
const external = Object.keys(pkg.peerDependencies || {})
const esExternal = external.concat(Object.keys(pkg.dependencies || {}))
const banner = `/*
 * ${pkg.name}
 * ${pkg.description}
 * ${pkg.repository.url}
 * v${pkg.version}
 * ${pkg.license} License
 */
`

export default [
  {
    input,
    output: {
      name: outputName,
      file: pkg.main,
      format: 'umd',
      banner,
      globals: {
        vue: 'Vue',
      },
    },
    external,
    plugins: [resolve(), commonjs(), buble()],
  },
  {
    input,
    output: {
      name: outputName,
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      globals: {
        vue: 'Vue',
      },
    },
    external,
    plugins: [resolve(), commonjs(), buble(), uglify()],
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'es',
      banner,
    },
    external: esExternal,
    plugins: [buble()],
  },
]

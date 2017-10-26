const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const svelte = require('rollup-plugin-svelte')
const buble = require('rollup-plugin-buble')
const resolve = require('rollup-plugin-node-resolve')

const prod = process.env.NODE_ENV === 'production';

rollup.rollup({
  input: './src/App.html',
  plugins: [
    svelte({
      css: css => css.write('./dist/photos.css', !prod),
			cascade: false
    }),
    resolve(),
    prod && buble({ exclude: 'node_modules/**' }),
    prod && uglify()
  ]
}).then(bundle => {
  bundle.write({
    format: 'iife',
    name: 'Photos',
    file: './dist/photos.js'
  })
})

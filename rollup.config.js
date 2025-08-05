import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

const isProduction = process.env.NODE_ENV === 'production'

export default [
  // ES modules build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    external: ['jspdf', 'html2canvas'],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }]
        ]
      }),
      isProduction && terser()
    ].filter(Boolean)
  },
  
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    external: ['jspdf', 'html2canvas'],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: '14'
            }
          }]
        ]
      }),
      isProduction && terser()
    ].filter(Boolean)
  },

  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'UniversalPDFGenerator',
      sourcemap: true,
      globals: {
        'jspdf': 'jsPDF',
        'html2canvas': 'html2canvas'
      }
    },
    external: ['jspdf', 'html2canvas'],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }]
        ]
      }),
      isProduction && terser()
    ].filter(Boolean)
  }
] 
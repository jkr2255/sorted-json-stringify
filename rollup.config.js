// rollup.config.js
// import nodeResolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  plugins: [
    // nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
    // commonjs(), // CommonJSモジュールをES6に変換
    babel(), // ES5に変換
    uglify()
  ],
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'sortedJSONStringify'
  }
};

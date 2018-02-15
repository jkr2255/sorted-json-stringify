// rollup.config.js
// import nodeResolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    // nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
    // commonjs(), // CommonJSモジュールをES6に変換
    babel()
  ],
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'sortedJSONStringify'
  }
};

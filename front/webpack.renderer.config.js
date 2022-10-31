// eslint-disable-next-line @typescript-eslint/no-var-requires
const rules = require('./webpack.rules');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugins = require('./webpack.plugins');

rules.push({
    test: /\.css$/i,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
});

module.exports = {
  target: 'web',
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    fallback: {
      "path": require.resolve("path-browserify") //npm i path-browserify
    }
  }
};

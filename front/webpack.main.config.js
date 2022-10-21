let rules = require('./webpack.rules')

rules.push({
  test: /\.(png|jpg|svg|jpeg|gif)$/i,
  use: [
      {
          loader: 'file-loader',
          options: {
              name: 'img/[name].[ext]',
              publicPath: '../.'
          }
      },
  ],
});


module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  
    // for files that should be compiled for electron main process
  target: 'electron-main',
  
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};

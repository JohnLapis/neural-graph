const path = require('path')
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('./js'),
    filename: 'main.js',
  },
  // externals: {
  //   'react': 'react',
  //   'react-dom': 'react-dom',
  // },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },
    ],
  },
}

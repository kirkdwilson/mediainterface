var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var plugins = [];
plugins.push(
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /(ionic-angular)|(angular(\\|\/)core(\\|\/)@angular)/,
    root('./src'), // location of your src
    {} // a map of your routes
  )
);

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    alias: {
      "@app": path.resolve('./src/app/'),
      "@constants": path.resolve('./src/constants/'),
      "@components": path.resolve('./src/components/'),
      "@env": path.resolve('./src/environments/environment.ts'),
      "@helpers": path.resolve('./src/helpers/'),
      "@interfaces": path.resolve('./src/interfaces/'),
      "@mocks": path.resolve('./src/mocks/'),
      "@models": path.resolve('./src/models/'),
      "@pages": path.resolve('./src/pages/'),
      "@providers": path.resolve('./src/providers/'),
    },
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'ts-loader'
          } , 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=false'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader'
      }
    ]
  },
  plugins: plugins
};

function root(localPath) {
  return path.resolve(__dirname, localPath);
}

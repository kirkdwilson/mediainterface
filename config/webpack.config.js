/*
 * The webpack config exports an object that has a valid webpack configuration
 * For each environment name. By default, there are two Ionic environments:
 * "dev" and "prod". As such, the webpack.config.js exports a dictionary object
 * with "keys" for "dev" and "prod", where the value is a valid webpack configuration
 * For details on configuring webpack, see their documentation here
 * https://webpack.js.org/configuration/
 */
const path = require('path');

const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');

webpackConfig['dev'].resolve.alias = {
  "@app": path.resolve('./src/app/'),
  "@constants": path.resolve('./src/constants/'),
  "@helpers": path.resolve('./src/helpers/'),
  "@mocks": path.resolve('./src/mocks/'),
  "@models": path.resolve('./src/models/'),
  "@pages": path.resolve('./src/pages/'),
  "@providers": path.resolve('./src/providers/'),
  "@env": path.resolve('./src/environments/environment.ts')
}
webpackConfig['prod'].resolve.alias = {
  "@app": path.resolve('./src/app/'),
  "@helpers": path.resolve('./src/helpers/'),
  "@mocks": path.resolve('./src/mocks/'),
  "@models": path.resolve('./src/models/'),
  "@pages": path.resolve('./src/pages/'),
  "@providers": path.resolve('./src/providers/'),
  "@env": path.resolve('./src/environments/environment.prod.ts')
}

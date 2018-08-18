const express = require('express');
const path = require('path');

module.exports = {
  lintOnSave: false,
  devServer: {
    before: (app) => {
      // the app is the instance of the express app
      app.use('/data', express.static(path.join(__dirname, '..', 'data')));
      app.use('/media', express.static(path.join(__dirname, '..', 'media')));
    },
  },
  configureWebpack: {
    plugins: [
    ],
  },
};

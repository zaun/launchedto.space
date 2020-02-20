module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    resolve: {
      mainFields: ['module', 'main'],
    },
  },
};

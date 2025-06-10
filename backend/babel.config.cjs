// babel.config.cjs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // compile for your current version of Node
        targets: { node: 'current' },
      },
    ],
  ],
};

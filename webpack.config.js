const path = require('path');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'better-sqlite3',
    'tedious',
    'mysql',
    'mysql2',
    'oracledb',
    'sqlite3',
    'pg-query-stream'
  ];

  return {
    ...options,
    externals: [],
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve.alias,
        'class-transformer/storage': path.resolve(
          __dirname,
          'empty-module.js',
        ),
      },
    },
  };
};
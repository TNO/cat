const path = require('path');
const devMode = process.env.NODE_ENV === 'development';
const outputPath = path.resolve(__dirname, devMode ? 'dist' : '../../docs');

console.log(`Working in ${devMode ? 'development' : 'production'} mode.`);

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    main: './src/app.ts',
  },
  devServer: {
    port: 8338,
  },
  builtins: {
    define: {
      'process.env.NODE_ENV': "'development'",
      'process.env.SERVER': devMode ? "''" : "'https://tno.github.io/cat/public'",
    },
    html: [
      {
        title: 'Capability Assessment Tool',
        publicPath: devMode ? undefined : 'https://tno.github.io/cat',
        scriptLoading: 'defer',
        minify: !devMode,
        favicon: './src/favicon.ico',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
          'og:title': 'Capability Assessment Tool',
          'og:description': "Specify your organization's capabilities, assess, and develop them.",
          'og:url': 'https://tno.github.io/cat/',
          'og:site_name': 'Capability Assessment Tool',
          'og:image:alt': 'Capability Assessment Tool',
          'og:image': './src/assets/logo.svg',
          'og:image:type': 'image/svg',
          'og:image:width': '200',
          'og:image:height': '200',
        },
      },
    ],
    minifyOptions: devMode
      ? undefined
      : {
          passes: 3,
          dropConsole: false,
        },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /^BUILD_ID$/,
        type: 'asset/source',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: outputPath,
  },
};

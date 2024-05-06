import { config } from 'dotenv';
import { resolve } from 'path';
import { Configuration } from '@rspack/cli';
import {
  DefinePlugin,
  HtmlRspackPlugin,
  HotModuleReplacementPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';

config();

const devMode = (process.env as any).NODE_ENV === 'development';
const isProduction = !devMode;
const outputPath = resolve(__dirname, devMode ? 'dist' : '../../docs');

const SERVER = process.env.SERVER;
// const publicPath = isProduction
//   ? 'https://github.io/Maplibre GUI for population simulator/popsicle'
//   : '';
const APP_PORT = 8332;

console.log(
  `Running in ${
    isProduction ? 'production' : 'development'
  } mode, serving from ${SERVER}, output directed to ${outputPath}.`
);

const buildDate = new Date().toUTCString();

const configuration: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/app.ts',
  },
  devServer: {
    port: APP_PORT,
  },
  devtool: 'source-map',
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': "'development'",
      'process.env.SERVER': devMode ? "''" : "'https://tno.github.io/cat/public'",
      'process.env.BUILD_DATE': `"${buildDate}"`,
    }),
    new HtmlRspackPlugin({
      title: 'Capability Assessment Tool',
      publicPath: devMode ? undefined : 'https://tno.github.io/cat',
      scriptLoading: 'defer',
      minify: !devMode,
      favicon: './src/favicon.ico',
      meta: {
        '': { 'http-equiv': 'Permissions-Policy', content: 'interest-cohort=()' },
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
    }),
    new HotModuleReplacementPlugin(),
    new SwcJsMinimizerRspackPlugin({
      compress: !devMode,
      // mangle: !devMode,
    }),
  ],
  resolve: {
    extensions: ['...', '.ts', '*.wasm', '*.csv', '*.json'], // "..." means to extend from the default extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
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
    // filename: '[id].bundle.js',
    // publicPath,
    path: outputPath,
  },
};

export default configuration;

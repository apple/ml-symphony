const path = require('path');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Custom webpack rules
const rules = (mode) => {
  return [
    { test: /\.ts?$/, loader: 'ts-loader' },
    { test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    },
    {
      test: /\.svelte$/,
      use: {
        loader: 'svelte-loader',
        options: {
          preprocess: SveltePreprocess({
            sourceMap: mode === 'development',
            postcss: true,
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
              require('postcss-nesting'),
            ],
          }),
          dev: mode === 'development',
        },
      },
    },
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];
};

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[name].[id].css',
  }),
];

const optimization = (mode) => {
  return {
    minimize: mode === 'production',
    minimizer: [new CssMinimizerPlugin()],
  };
};

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base'];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: ['.webpack.js', '.web.js', '.mjs', '.ts', '.js', '.svelte'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
};

module.exports = (_, argv) => [
  /**
   * ES6 module for standalone site.
   *
   * This contains the Svelte components for the standalone dashboard.
   */
  {
    entry: './src/standalone.ts',
    output: {
      filename: 'SymphonyHierarchicalConfusionMatrix.js',
      path: path.resolve(
        __dirname,
        path.basename(__dirname),
        'standalone',
        'widgets'
      ),
      libraryTarget: 'module',
    },
    experiments: {
      outputModule: true,
    },
    plugins: plugins,
    optimization: optimization(argv.mode),
    module: {
      rules: rules(argv.mode),
    },
    devtool: 'source-map',
    externals,
    resolve,
  },
  /**
   * Lab extension
   *
   * This builds the lib/ folder with the JupyterLab extension.
   */
  {
    entry: './src/plugin.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'lib'),
      libraryTarget: 'amd',
      publicPath: '',
    },
    module: {
      rules: rules(argv.mode),
    },
    externals,
    resolve,
  },
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(
        __dirname,
        'symphony_hierarchical_confusion_matrix',
        'nbextension'
      ),
      libraryTarget: 'amd',
    },
    plugins: plugins,
    optimization: optimization(argv.mode),
    module: {
      rules: rules(argv.mode),
    },
    externals,
    resolve,
  },
];

const path = require('path');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Custom webpack rules
const rules = (mode) => [
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ },
  {
    test: /\.(sa|sc|c)ss$/,
    exclude: /node_modules/,
    use: ['isomorphic-style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
  },
  {
    test: /\.svelte$/,
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
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },
];

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
  extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.svelte'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
};

module.exports = (env, argv) => [
  /** Standalone App - build the App to be used as a standalone version */
  {
    entry: {
      bundle: ['./src/standalone.ts'],
    },
    output: {
      path: path.resolve(__dirname, 'symphony_ui', 'standalone', 'widgets'),
      filename: 'StandaloneApp.js',
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
      path: path.resolve(__dirname, 'symphony_ui', 'nbextension'),
      libraryTarget: 'amd',
      publicPath: '',
    },
    module: {
      rules: rules(argv.mode),
    },
    externals,
    resolve,
  },
];

const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Enable production mode for optimizations
  mode: 'production',
  
  // Entry point
  entry: './src/index.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js', // Use content hash for cache busting
    chunkFilename: '[name].[contenthash].chunk.js', // Chunk naming for code splitting
    publicPath: '/',
    clean: true, // Clean the output directory before emit
  },
  
  // Optimization settings
  optimization: {
    minimize: true,
    minimizer: [
      // JavaScript minification
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log in production
            passes: 2, // Additional compression passes
            ecma: 2020, // Use modern JS features for better minification
          },
          mangle: true,
          format: {
            comments: false, // Remove all comments
          },
        },
        extractComments: false,
      }),
      // CSS minification
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              reduceIdents: false, // Prevents breaking keyframe animations
              colormin: true, // Minify colors
              convertValues: true, // Convert values when possible
            },
          ],
        },
      }),
    ],
    // Code splitting configuration - Optimized for mobile
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 15, // Allow more initial requests for smaller chunks
      minSize: 15000, // 15kb minimum size to create a chunk
      maxSize: 200000, // 200kb maximum size to maintain smaller chunks
      cacheGroups: {
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'framework',
          priority: 40,
          enforce: true,
        },
        animations: {
          test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
          name: 'animations',
          priority: 30,
        },
        ui: {
          test: /[\\/]node_modules[\\/](styled-components|react-icons)[\\/]/,
          name: 'ui',
          priority: 20,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get the package name
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // Create a clean package name for better readability
            return `vendor.${packageName.replace('@', '')}`;
          },
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single', // Create a single runtime bundle for all chunks
  },
  
  // Module rules for processing different file types
  module: {
    rules: [
      // JavaScript/React processing
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  esmodules: true,
                  browsers: ['>0.2%', 'not dead', 'not op_mini all']
                }
              }],
              '@babel/preset-react'
            ],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      // CSS processing with MiniCssExtractPlugin for better performance
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          }
        ],
      },
      // Image optimization - Enhanced for responsive loading
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb - inline smaller images as data URLs
          },
        },
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
                optimizationLevel: 7
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
                optimizationLevel: 3
              },
              webp: {
                quality: 75,
              },
              svgo: {
                plugins: [
                  { removeViewBox: false },
                  { removeEmptyAttrs: true }
                ]
              }
            },
          },
        ],
      },
      // Font processing
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
      // Audio files - Optimized for mobile
      {
        test: /\.(mp3|wav)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[name].[hash][ext]',
        },
      },
    ],
  },
  
  // Plugins
  plugins: [
    // Extract CSS into separate files for better loading
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
      chunkFilename: 'assets/css/[id].[contenthash].css',
    }),
    // Enable GZIP compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only compress files larger than 10kb
      minRatio: 0.8, // Only compress files that compress well
    }),
    // Bundle analyzer (disabled by default, enable for analysis)
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 244000, // 244kb - target for mobile
    maxAssetSize: 244000, // 244kb - target for mobile
  },
  
  // Development server configuration
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
  },
  
  // Source maps for production (hidden-source-map for security)
  devtool: 'hidden-source-map',
};

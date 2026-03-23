const path = require('path');
const fs = require('fs');

class MergeMdPlugin {
  constructor(options) {
    this.src = options.src;       // папка с md
    this.output = options.output; // путь до файла назначения
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MergeMdPlugin', (compilation, callback) => {
      try {
        const files = fs.readdirSync(this.src)
            .filter(f => f.endsWith('.md'))
            .sort(); // если нужно строго по алфавиту

        const content = files
            .map(f => fs.readFileSync(path.join(this.src, f), 'utf-8'))
            .join('\n\n'); // разделитель между файлами

        // записываем в файл назначения
        fs.writeFileSync(path.join(this.src, this.output), content, 'utf-8');

        console.log(`Merged ${files.length} MD files into ${this.output}`);
      } catch (err) {
        console.error(err);
      }
      callback();
    });
  }
}

const bundle = {
  mode: 'none',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'wex.js',
    library: 'jqvm',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-spread',
            '@babel/plugin-transform-parameters',
          ],
        },
      },
    ],
  },
  plugins: [
    new MergeMdPlugin({
      src: path.join(__dirname, 'book'),
      output: 'ai.txt',
    }),
  ],
  externals: {
    jquery: {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
    },
  },
  optimization: {
    minimize: false,
    usedExports: true,
    sideEffects: true,
  },
};

const mini = {
  ...bundle,
  mode: 'production',
  output: {
    ...bundle.output,
    filename: 'wex.min.js',
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: true,
  },
  devtool: 'source-map',
};

module.exports = [bundle, mini];
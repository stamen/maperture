import rollupConfig from './rollup.config';

const packageConfig = {
  ...rollupConfig,
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'esm',
    name: 'map-compare',
    file: 'dist/bundle.js',
  },
};

export default packageConfig;

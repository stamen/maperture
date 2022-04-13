import rollupConfig from './rollup.config';

const packageConfig = {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: 'dist/bundle.js',
  },
};

export default packageConfig;

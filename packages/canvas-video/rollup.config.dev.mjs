import { resolve } from 'path';
import defineConfig from '@anylab/config/rollup/rollup.config.dev.mjs';

export default defineConfig((cliArgs) => {
  const cwd = process.cwd();
  const exampleArg = cliArgs['example'] || 'index';
  const inputFile = exampleArg === 'index' ? 'index.ts' : `example_${exampleArg}.ts`;

  return {
    input: resolve(cwd, 'examples', inputFile),
  };
});

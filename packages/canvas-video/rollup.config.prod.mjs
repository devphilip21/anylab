import { resolve } from 'path';
import defineConfig from '@anylab/config/rollup/rollup.config.prod.mjs';

export default defineConfig(() => {
  const cwd = process.cwd();

  return {
    input: resolve(cwd, 'src', 'index.ts')
  }
});

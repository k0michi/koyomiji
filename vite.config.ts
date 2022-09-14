import * as path from 'path';
import license from 'rollup-plugin-license';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    license({
      banner: {
        content: `Please see /license.txt for license information`,
        commentStyle: 'ignored',
      },
      thirdParty: {
        includePrivate: false,
        output: {
          file: path.join('dist', 'license.txt')
        },
      },
    })
  ]
});
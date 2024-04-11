/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const FORMAT_MAP = {
  es: 'esm',
  cjs: 'cjs',
  umd: 'umd',
}

export default defineConfig({
  publicDir: 'examples/mouse-control',
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vuelve',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => `vuelve.${FORMAT_MAP[format]}.js`,
    },
    rollupOptions: {
      external: ['vue', 'lodash.clonedeep'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
})

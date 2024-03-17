import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const FORMAT_MAP = {
  es: 'esm',
  cjs: 'cjs',
  umd: 'umd',
}

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'vuelve',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => `vuelve.${FORMAT_MAP[format]}.js`,
    },
    rollupOptions: {
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

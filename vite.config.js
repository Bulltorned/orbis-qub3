import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    }
  },
  build: {
    target: "es2020"
  },
  alias: {
    "@": resolve(__dirname, "./src"),
    "@ensdomains/address-encoder": "@ensdomains/address-encoder/lib/index.umd.js",
    process: "process/browser",
    stream: "stream-browserify",
    zlib: "browserify-zlib",
    util: 'util',
    web3: resolve(__dirname, './node_modules/web3/dist/web3.min.js')
  }
})

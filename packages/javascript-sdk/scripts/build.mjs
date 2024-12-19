// build.mjs
import * as esbuild from 'esbuild'
import { existsSync, mkdirSync } from 'fs'
import { rimraf } from 'rimraf'

// Ensure clean build
await rimraf('./dist')

// Create dist directory structure
const distDirs = ['esm', 'cjs', 'umd', 'deno', 'workers']
distDirs.forEach((dir) => {
  const path = `./dist/${dir}`
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
})

// Common esbuild configuration
const commonConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  external: ['node:*'] // Exclude Node.js built-in modules
}

// Platform-specific configurations
const buildConfigs = [
  // ESM build (Node.js, Bun)
  {
    ...commonConfig,
    format: 'esm',
    platform: 'neutral',
    outfile: './dist/esm/index.js',
    banner: {
      js: '// @ts-ignore\nconst process = globalThis.process || { env: {} };'
    }
  },

  // CommonJS build (Node.js)
  {
    ...commonConfig,
    format: 'cjs',
    platform: 'node',
    outfile: './dist/cjs/index.js'
  },

  // UMD build (Browsers)
  {
    ...commonConfig,
    format: 'iife',
    platform: 'browser',
    globalName: 'MySDK',
    outfile: './dist/umd/index.js',
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  },

  // Deno build
  {
    ...commonConfig,
    format: 'esm',
    platform: 'neutral',
    outfile: './dist/deno/index.js',
    banner: {
      js: '// @ts-ignore\nconst process = { env: {} };'
    }
  },

  // Cloudflare Workers build
  {
    ...commonConfig,
    format: 'esm',
    platform: 'browser',
    outfile: './dist/workers/index.js',
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  }
]

// Build all configurations
try {
  await Promise.all(buildConfigs.map((config) => esbuild.build(config)))
  console.log('✨ Build completed successfully')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}

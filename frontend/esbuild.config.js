// esbuild.config.js
const res = require('esbuild').buildSync({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: true,
    format: 'cjs',
    sourcemap: true,
    outfile: 'dist/output.js',
    define: {
        'process.env.BACKEND_URL': '"http://localhost:3000"',
    }
})

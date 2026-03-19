12:06:13.368 Running build in Portland, USA (West) – pdx1
12:06:13.369 Build machine configuration: 2 cores, 8 GB
12:06:13.522 Cloning github.com/BIKASH907/nextoken-capital (Branch: main, Commit: 0f25f36)
12:06:14.649 Cloning completed: 1.127s
12:06:15.239 Restored build cache from previous deployment (AxGqGK3AmEKvJmBAFF2AsZvETVca)
12:06:15.597 Running "vercel build"
12:06:16.334 Vercel CLI 50.32.4
12:06:16.693 Installing dependencies...
12:06:18.393 
12:06:18.397 up to date in 1s
12:06:18.398 
12:06:18.398 152 packages are looking for funding
12:06:18.398   run `npm fund` for details
12:06:18.432 Detected Next.js version: 14.2.0
12:06:18.436 Running "npm run build"
12:06:18.570 
12:06:18.570 > nextoken-capital@1.0.0 build
12:06:18.571 > next build
12:06:18.571 
12:06:19.429   ▲ Next.js 14.2.0
12:06:19.430   - Environments: .env.local
12:06:19.431 
12:06:19.431    Linting and checking validity of types ...
12:06:22.115    Creating an optimized production build ...
12:06:28.122  ✓ Compiled successfully
12:06:28.122    Collecting page data ...
12:06:28.426 ReferenceError: document is not defined
12:06:28.427     at 4596 (/vercel/path0/.next/server/pages/company.js:145:1555)
12:06:28.427     at t (/vercel/path0/.next/server/webpack-runtime.js:1:127)
12:06:28.427     at 2995 (/vercel/path0/.next/server/pages/company.js:1:686)
12:06:28.428     at t (/vercel/path0/.next/server/webpack-runtime.js:1:127)
12:06:28.428     at a (/vercel/path0/.next/server/pages/company.js:145:2451)
12:06:28.428     at /vercel/path0/.next/server/pages/company.js:145:2486
12:06:28.428     at t.X (/vercel/path0/.next/server/webpack-runtime.js:1:749)
12:06:28.429     at /vercel/path0/.next/server/pages/company.js:145:2464
12:06:28.429     at Object.<anonymous> (/vercel/path0/.next/server/pages/company.js:145:2513)
12:06:28.429     at Module._compile (node:internal/modules/cjs/loader:1761:14)
12:06:28.430 
12:06:28.430 > Build error occurred
12:06:28.430 Error: Failed to collect page data for /company
12:06:28.430     at /vercel/path0/node_modules/next/dist/build/utils.js:1268:15
12:06:28.430     at process.processTicksAndRejections (node:internal/process/task_queues:103:5) {
12:06:28.430   type: 'Error'
12:06:28.430 }
12:06:28.457 Error: Command "npm run build" exited with 1
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const environment = process.argv[2]

if (environment !== 'staging' && environment !== 'production') {
  throw new Error('Build environment must be "staging" or "production".')
}

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const quasarCli = fileURLToPath(
  new URL('../node_modules/@quasar/app-vite/bin/quasar.js', import.meta.url),
)

const result = spawnSync(process.execPath, [quasarCli, 'build'], {
  cwd: projectRoot,
  env: { ...process.env, APP_ENV: environment },
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exitCode = result.status ?? 1

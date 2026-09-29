const path = require('node:path');

// Ports internes : plusieurs sites partagent le VPS, on les choisit donc à
// l'installation (IN_CUBATOR_WEB_PORT / IN_CUBATOR_API_PORT) après avoir vérifié
// qu'ils sont libres. Ils écoutent uniquement sur 127.0.0.1.
const webPort = process.env.IN_CUBATOR_WEB_PORT || '3000';
const apiPort = process.env.IN_CUBATOR_API_PORT || '4000';

const appRoot = path.resolve(
  process.env.IN_CUBATOR_ROOT || '/var/www/in-cubator/current',
);

module.exports = {
  apps: [
    {
      name: 'in-cubator-web',
      cwd: appRoot,
      script: './node_modules/next/dist/bin/next',
      args: `start --hostname 127.0.0.1 --port ${webPort}`,
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2_000,
      kill_timeout: 30_000,
      max_memory_restart: '1G',
      time: true,
      merge_logs: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: webPort,
        HOSTNAME: '127.0.0.1',
        API_INTERNAL_URL: `http://127.0.0.1:${apiPort}`,
        PRIVATE_STORAGE_DIR:
          process.env.PRIVATE_STORAGE_DIR || '/var/lib/in-cubator/documents',
        PUBLIC_MEDIA_DIR:
          process.env.PUBLIC_MEDIA_DIR || '/var/lib/in-cubator/media',
      },
    },
    {
      name: 'in-cubator-api',
      cwd: path.join(appRoot, 'backend'),
      script: './dist/server.js',
      interpreter: 'node',
      node_args: '--enable-source-maps',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2_000,
      kill_timeout: 15_000,
      max_memory_restart: '512M',
      time: true,
      merge_logs: true,
      env_production: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: apiPort,
        API_PREFIX: '/api',
        TRUST_PROXY: '1',
      },
    },
  ],
};

module.exports = {
  apps : [{
    name: 'API',
    script: './node_modules/.bin/nodemon',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    cwd : './backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'FRONTEND',
    script: './scripts/start.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'start',
    cwd : './frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

};

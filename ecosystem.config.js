module.exports = {
  apps: [
    {
      name: 'portalitFE',
      script: 'node_modules/.bin/next',
      args: 'start -p 3030',
      cwd: './',
      exec_mode: 'cluster',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

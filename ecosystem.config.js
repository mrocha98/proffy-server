module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/src/server.js',
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
}

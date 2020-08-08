module.exports = {
  apps: [
    {
      name: 'server',
      script: 'src/server.js',
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
}

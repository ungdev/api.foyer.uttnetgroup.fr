const express = require('express')
const fs = require('fs')
const path = require('path')

module.exports = app => {
  const router = new express.Router()

  router.locals = app.locals

  // Include all routes
  fs.readdirSync(__dirname)
  .filter(folder => folder !== 'index.js')
  .map(folder => path.join(__dirname, folder))
  .forEach(folderPath =>
    fs.readdirSync(folderPath)
      .map(fileName => require(path.join(folderPath, fileName)))
      .forEach(controller => controller(router))
  )

  return router
}

#!/usr/bin/env node

'use strict'

// this will be overrided by .env and .env.local
process.env.NODE_ENV = 'production'

const express = require('express')
const app = express()

require('../src')(app, express)

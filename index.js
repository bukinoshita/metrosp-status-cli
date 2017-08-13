#!/usr/bin/env node
'use strict'

const metrospStatus = require('metrosp-status')
const chalk = require('chalk')
const figures = require('figures')
const meow = require('meow')
const updateNotifier = require('update-notifier')

const cli = meow(
  `
  Usage:
    $ metrosp-status            Show metrosp status

  Options:
    -h, --help                  Show help options
    -v, --version               Show version
`,
  {
    alias: {
      h: 'help',
      v: 'version'
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

metrospStatus().then(lines => {
  lines.map(({ linha, status }) => {
    let bulletStatus

    switch (status) {
      case 'Normal':
        bulletStatus = chalk.green(figures('●'))
        break

      case 'Parcial':
        bulletStatus = chalk.yellow(figures('●'))
        break

      case 'Parada':
        bulletStatus = chalk.red(figures('●'))
        break

      default:
        bulletStatus = chalk.green(figures('●'))
        break
    }

    const operation = chalk.gray(`(${status.toLowerCase()})`)

    return console.log(`${bulletStatus} ${chalk.bold(linha)} ${operation}`)
  })
})

#!/usr/bin/env node
'use strict'

const metrospStatus = require('metrosp-status')
const { green, yellow, red, gray, bold } = require('chalk')
const figures = require('figures')
const meow = require('meow')
const updateNotifier = require('update-notifier')
const lastTweet = require('last-tweet')
const shoutMessage = require('shout-message')

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

Promise.all([metrospStatus(), lastTweet('metrosp_oficial')]).then(result => {
  const lines = result[0]
  const { tweet, time, user } = result[1]

  const cleanTweet = tweet.substring(
    tweet.indexOf('#metrosp') + 11,
    tweet.length - 1
  )
  shoutMessage(`${bold('@' + user)}: ${cleanTweet}. ${gray('[' + time + ']')}
  `)

  lines.map(({ linha, status }) => {
    let bulletStatus

    switch (status) {
      case 'Normal':
        bulletStatus = green(figures('●'))
        break

      case 'Parcial':
        bulletStatus = yellow(figures('●'))
        break

      case 'Parada':
        bulletStatus = red(figures('●'))
        break

      default:
        bulletStatus = green(figures('●'))
        break
    }

    const operation = gray(`(${status.toLowerCase()})`)

    return console.log(`${bulletStatus} ${bold(linha)} ${operation}`)
  })
})

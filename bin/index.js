#! /usr/bin/env node

const { program } = require('commander')

const { create } = require('../lib/commands')
const pkg = require('../package.json')

// 注册 create 命令
program
  .command('create <name>')
  .description('use senscape create [name] init a template')
  .action(create)

program
  .version(pkg.version)
  .parse(process.argv)

const cp = require('child_process')
// loading效果
function spinnerStart(msg, spinnerString = '|/-\\') {
  const Spinner = require('cli-spinner').Spinner

  const spinner = new Spinner(msg + ' %s')

  spinner.setSpinnerString(spinnerString)
  spinner.start()
  return spinner
}

// 延迟方法
function sleep(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 执行命令方法
function exec(command, args, options = {}) {
  const win32 = process.platform === 'win32'

  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args

  return cp.spawn(cmd, cmdArgs, options)
}

function execPromise(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const p = exec(command, args, options)
    p.on('error', e => {
      reject(e)
    })
    p.on('exit', c => {
      resolve(c)
    })
  })
}
module.exports = {
  spinnerStart,
  sleep,
  exec,
  execPromise
}
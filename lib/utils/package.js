const path = require('path')
// 文件操作
const fse = require('fs-extra')
// 递归读取指定目录下的所有文件
const glob = require('glob')
// ejs模板渲染
const ejs = require('ejs')
// 命令式交互
const inquirer = require('inquirer')

const { spinnerStart, sleep, execPromise } = require('./index')

const ejsIgnore = ['node_modules/**', 'public/**', 'src/**']
module.exports = class Package {
  constructor(options) {
    this.version = options.version || options.templateInfo.version
    this.templateName = options.templateName
    this.pkgName = options.pkgName
    this.templateInfo = options.templateInfo
    this.desc = path.resolve(process.cwd(), this.pkgName)
    this.templateDir = path.resolve(__dirname, '../../template', this.templateName)
    this.mkProject()
  }

  async mkProject() {
    let spinner
    try {
      // 判断目标文件夹是否存在
      const isExists = fse.pathExistsSync(this.desc)
      if (isExists) { // 如果存在就提示是否覆盖
        const answer = await inquirer.prompt([
          {
            message: '该文件夹已存在，是否覆盖?[yes/no]',
            type: 'input',
            name: 'isOver'
          }
        ])
        if (/y/i.test(answer.isOver)) {
          fse.emptyDirSync(this.desc)
        } else {
          return
        }
      } else {
        fse.mkdirSync(this.desc)
      }
      spinner = spinnerStart('正在初始化模板...')
      await sleep(1000)

      fse.copySync(this.templateDir, this.desc)
      
      await this.renderEjsFile({ ignore: ejsIgnore })
    } catch (error) {
      console.log(error)
    } finally {
      spinner && spinner.stop(true)
    }
    this.installAndStart()
  }

  async installAndStart() {
    // 依赖安装
    const { installCommand, startCommand } = this.templateInfo
    let result
    if (installCommand) {
      const [cmd, ...args] = installCommand.split(' ')
      console.log('正在下载依赖...')
      result = await execPromise(cmd, args, {
        stdio: 'inherit',
        cwd: this.desc
      })
    }
    if (result !== 0) {
      throw new Error('依赖安装过程失败')
    }
    await sleep(1000)
    // 启动命令
    if (startCommand) {
      const [cmd, ...args] = startCommand.split(' ')
      console.log('正在启动项目...')
      result = await execPromise(cmd, args, {
        stdio: 'inherit',
        cwd: this.desc
      })
    }
    if (result !== 0) {
      throw new Error('依赖安装过程失败')
    }
  }

  async renderEjsFile(options) {
    const data = { pkgName: this.pkgName, version: this.version }
    const dir = this.desc
    return new Promise((resolve, reject) => {
      glob('**', {
        cwd: dir,
        ignore: options.ignore || '',
        nodir: true
      }, (err, files) => {
        if (err) {
          reject(err)
        }

        Promise.all(files.map(file => {
          const filePath = path.resolve(dir, file)
          return new Promise((resolve2, rejecte2) => {
            ejs.renderFile(filePath, data, {}, function(err, result){
              if (err) {
                rejecte2(err)
              } else {
                fse.writeFileSync(filePath, result)
                resolve2(result)
              }
            })
          })
        })).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
}

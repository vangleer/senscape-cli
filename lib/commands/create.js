
const inquirer = require('inquirer')

const Package = require('../utils/package')
const templates = require('../../package.json').templates
/**
 * 
 * @param {项目名称} name 
 * 1.让用户选择项目
 *  > vue项目模板
 *  > egg项目模板
 * 2.创建名为name的文件夹，并将提前创建好的模板拷贝到新创建的文件夹下
 * 3.由于要填充项目名称到package.json中，需要使用ejs模板
 */
module.exports = async function(name) {
  
  inquirer.prompt([
    {
      prefix: '请选择模板?',
      suffix: '',
      type: 'list',
      name: 'templateName',
      choices: templates.map(item => item.name)
    },
    {
      message: '请输入版本号?',
      type: 'input',
      name: 'version'
    }
  ]).then(answer => {
    const templateInfo = templates.find(item => answer.templateName == item.name)
    const package = new Package({ ...answer, pkgName: name, templateInfo })
  })
}
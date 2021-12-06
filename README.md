# 一个简单的脚手架

<p align="center">
	<a href="https://www.npmjs.com/package/commander" target="_blank">
		<img src="https://img.shields.io/badge/commander-8.3.0-green" alt="commander">
	</a>
	<a href="https://www.npmjs.com/package/inquirer" target="_blank">
		<img src="https://img.shields.io/badge/inquirer-8.2.0-blue" alt="inquirer">
	</a>
	<a href="https://www.npmjs.com/package/ejs" target="_blank">
		<img src="https://img.shields.io/badge/ejs-3.1.6-red" alt="ejs">
	</a>
</p>
<p>&nbsp;</p>

#### 🌈介绍

基于 commander + inquirer + ejs + cli-spinner + fs-extra，脚手架，可根据自定义模板创建项目。

#### ⚡ 使用说明
```bash
# 克隆项目
git clone https://gitee.com/coderhwt/senscape-cli.git

# 进入项目
cd senscape-cli

# 安装依赖
npm install

# 建立本地链接
npm link

# 使用脚手架创建项目
senscape create projectName

```

#### ⛱️ 修改脚手架名称和配置模板

修改package.json中的bin
```javascript
"bin": {
	"senscape": "./bin/index.js", // delete
	"your-cli": "./bin/index.js" // add
}
```

添加项目模板
- 在templates目录下创建模板项目，例如：vue-element-admin
- package.json的templates下添加相关的信息
```javascript
 {
	"name": "vue-element-admin", // 对应templates目录下的项目名称
	"version": "0.1.0", // 将会渲染到新建项目的package.json的版本号
	"installCommand": "npm install", // 安装依赖命令
	"startCommand": "npm run serve" // 启动命令
},
```







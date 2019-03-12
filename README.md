# mono-stater-kit
monorepo项目演示，使用 lerna + yarn workspaces, 主要为了解决项目内依赖引用和配置文件共用问题

# 背景
团队内多项目开发经常会遇到以下几个问题
1. 新建项目需要重新配置各种工具，繁琐，虽然也可以用脚手架生成，但后期涉及到依赖的升级也麻烦
2. 项目内的依赖互相引用虽然有yarn/npm link，但还是影响开发体验
3. babel等配置希望可以多项目共享

为了解决上述问题，决定在项目内使用 lerna + yarn workspaces。

我们使用下面的项目结构模拟团队内常见的情景，[演示项目](https://github.com/wowlusitong/mono-stater-kit)

- 两个毫无关系的web项目
  - www-a，使用antd
  - www-b，使用react-bootstrap
- 三个组件项目
  - component-a
  - component-b
  - component-c

他们的依赖关系:
  - www-a 依赖 component-a
  - www-b 依赖 component-b
  - component-a 和 component-b 依赖component-c

# 创建项目
先新建一个文件夹，然后初始化git
```sh
# 初始化git
git init 
```

```sh
# 初始化项目
$ npm init -f 
# 安装lerna，也可以全局安装，非全局安装记得在命令前加上npx
$ yarn add lerna --dev
```

```js
// 使用workspace需在package.json内增加如下内容
"private": true,
  "workspaces": [
    "packages/*" 
  ],
```

```sh
# 初始化lerna
$ lerna init
```

```js
// 在lerna.json内增加如下内容以在lerna内启用yarn workspaces
{
  "npmClient": "yarn"
  "useWorkspaces": true
}
```

接下来就是创建package了，可以在packages文件夹内手动创建文件夹，或者使用lerna命令：
```sh
$ npx lerna create XXX 
```

# 依赖管理
开发中基本会遇到三种依赖安装情况
1. package依赖
也就是某个具体package的依赖，安装方式有两种
使用yarn，参照 [yarn-workspace](https://yarnpkg.com/lang/en/docs/cli/workspace/#toc-yarn-workspace)
```sh
# yarn workspace www add react
$ yarn workspace <workspace_name> <command>
```
使用lerna，具体用法参照 [lerna add](https://github.com/lerna/lerna/tree/master/commands/add#readme)
```sh
#  npx lerna add react --scope www 
$ lerna add <package>[@version] [--dev] [--exact]
```
2. workspace依赖
 workspace依赖是指mono repo项目内依赖互相引用
```sh
#  npx lerna add component-a --scope www 
$ lerna add <package>[@version] [--dev] [--exact]
```
3. 共用的工具依赖 
比如babel，eslint等工具依赖，需要共享配置
```sh
# 注意： 一定要在项目根目录下
yarn add @babel/core @babel/preset-env --dev -W
```

我们现在抽取出可复用的内容:
- 代码编译，使用babel
- css预处理，使用postcss
- eslint，项目使用一致的语法规范
- commitlint，项目使用一致的commit提交规范

这些工具按照使用习惯正常安装就行，重点说下babel。

bable配置文件使用`babel.config.js`，代码编译配置全局共享，然后通过`overrides`进行差异化配置，比如项目`www-a`使用antd，可以单独配置按需加载
```js
const presets = [
  "@babel/preset-env",
  "@babel/preset-react"
];

const overrides = [
  {
    test: ["packages/www-a"],
    plugins: [
      ["module-resolver", {
        "alias": { "~": "./src/scripts" }
      }],
      ["import", {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css"
      }]
    ]
  },
  {
    test: ["packages/www-b"],
    plugins: [
      ["module-resolver", {
        "alias": { "~": "./src/scripts" }
      }]
    ]
  },
]
```
# npm script
使用lerna管理项目，
每个项目下都写自己的npm script，比如 `start` `build`，然后使用lerna执行，一般将命令写到根目录下的npm script，比如:
```json
"scripts": {
   "start:www-a": "lerna run start --parallel --scope www-a --scope component-a --scope component-c"
  },
```

```sh
# 执行所有packages的build命令
$ lerna run build

# 并行执行所有packages的start命令
$ lerna run start --parallel 

```

> 注: 文章内不会说过多的基础内容，默认你有搭建开发环境的基础技能。

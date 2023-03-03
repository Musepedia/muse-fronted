<div align="center">
  <img alt="MGS Logo" width="120" height="120" src="./src/assets/layout/logo.png">
  <h1>MGS_Fronted</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

## 特性

- **Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API
- **Element Plus**：Element UI 的 Vue3 版本
- **Pinia**: 传说中的 Vuex5
- **Vite**：真的很快
- **Vue Router**：路由路由
- **TypeScript**：JavaScript 语言的超集
- **PNPM**：更快速的，节省磁盘空间的包管理工具
- **Scss**：和 Element Plus 保持一致
- **CSS 变量**：主要控制项目的布局和颜色
- **ESlint**：代码校验
- **Prettier**：代码格式化
- **Axios**：发送网络请求（已封装好）
- **UnoCSS**：具有高性能且极具灵活性的即时原子化 CSS 引擎
- **注释**：各个配置项都写有尽可能详细的注释
- **兼容移动端**: 布局兼容移动端页面分辨率

## 功能

- **用户管理**：登录、登出演示
- **权限管理**：内置页面权限（动态路由）、指令权限、权限函数、路由守卫
- **多环境**：开发环境（development）、预发布环境（staging）、正式环境（production）
- **多主题**：内置普通、黑暗、深蓝三种主题模式
- **错误页面**: 403、404
- **Dashboard**：根据不同用户显示不同的 Dashboard 页面
- **其他内置功能**：SVG、动态侧边栏、动态面包屑、标签页快捷导航、Screenfull 全屏、自适应收缩侧边栏



##  开发

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
3. node 版本 16+
4. pnpm 版本 7.x


# 安装依赖
pnpm i 或 npm i

# 启动服务
pnpm dev 或 npm run dev
```

##  预览

```bash
# 预览预发布环境
pnpm preview:stage

# 预览正式环境
pnpm preview:prod
```

##  多环境打包

```bash
# 构建预发布环境
pnpm build:stage

# 构建正式环境
pnpm build:prod
```

##  代码格式检查

```bash
pnpm lint
```

##  License

[MIT](./LICENSE)

Copyright (c) 2022 [pany](https://github.com/pany-ang)


## 目录组成
├─ .husky                # 用户提交代码时格式化代码
├─ .vscode               # 本项目推荐的 vscode 配置和拓展
├─ public
│  ├─ favicon.ico
│  ├─ app-loading.css    # 首屏加载 loading
├─ src
│  ├─ api                # api 接口
│  ├─ assets             # 静态资源
│  ├─ components         # 全局组件
│  ├─ config             # 全局配置
│  ├─ constant           # 常量/枚举
│  ├─ directives         # 全局指令
│  ├─ hooks              # 全局 hook
│  ├─ icons              # svg icon
│  ├─ layout             # 布局
│  ├─ plugins            # 全局插件
│  ├─ router             # 路由
│  ├─ store              # pinia store
│  ├─ styles             # 全局样式
│  ├─ utils              # 全局公共方法
│  └─ views              # 所有页面
│  ├─ App.vue            # 入口页面
│  └─ main.ts            # 入口文件
├─ types                 # ts 声明
├─ .env.development      # 开发环境
├─ .env.production       # 正式环境
├─ .env.staging          # 预发布环境
├─ .eslintrc.js          # eslint 配置
├─ .prettier.config.js   # prettier 配置
├─ tsconfig.json         # ts 编译配置
├─ unocss.config.ts      # unocss 配置
└─ vite.config.ts        # vite 配置。
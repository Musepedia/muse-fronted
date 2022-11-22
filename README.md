<div align="center">
  <img alt="V3 Admin Vite Logo" width="120" height="120" src="./src/assets/layout/logo.png">
  <h1>V3 Admin Vite</h1>
  <span>English | <a href="./README.zh-CN.md">中文</a></span>
</div>

## Feature

- **Vue3**：The latest Vue3 composition API using Vue3 + script setup
- **Element Plus**：Vue3 version of Element UI
- **Pinia**: An alternative to Vuex in Vue3
- **Vite**：Really fast
- **Vue Router**：router
- **TypeScript**：JavaScript With Syntax For Types
- **PNPM**：Faster, disk space saving package management tool
- **Scss**：Consistent with Element Plus
- **CSS variable**：Mainly controls the layout and color of the item
- **ESlint**：Code verification
- **Prettier**： Code formatting
- **Axios**: Promise based HTTP client (encapsulated)
- **UnoCSS**: Real-time atomized CSS engine with high performance and flexibility
- **Annotation**：Each configuration item is written with as detailed comments as possible
- **Mobile Compatible**: The layout is compatible with mobile page resolution

## Functions

- **User management**: log in, log out of the demo
- **Authority management**: Built-in page permissions (dynamic routing), instruction permissions, permission functions
- **Multiple Environments**: Development, Staging, Production
- **Multiple themes**: Normal, Dark, Dark Blue, theme modes
- **Error page**: 403, 404
- **Dashboard**: Display different Dashboard pages according to different users
- **Other functions**：SVG, Dynamic Sidebar, Dynamic Breadcrumb Navigation, Tabbed Navigation, Screenfull, Adaptive Shrink Sidebar

##  Development

```bash
# configure
1. installation of the recommended plugins in the .vscode directory
3. node version 16+
4. pnpm version 7.x

# clone
git clone https://github.com/un-pany/v3-admin-vite.git

# enter the project directory
cd v3-admin-vite

# install dependencies
pnpm i

# start the service
pnpm dev
```

##  Preview

```bash
# stage environment
pnpm preview:stage

# prod environment
pnpm preview:prod
```

##  Multi-environment packaging

```bash
# build the stage environment
pnpm build:stage

# build the prod environment
pnpm build:prod
```

##  Code formatting check

```bash
pnpm lint
```

##  License

[MIT](./LICENSE)

Copyright (c) 2022 [pany](https://github.com/pany-ang)

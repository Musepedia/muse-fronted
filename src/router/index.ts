import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "基本信息",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/menu",
    component: Layout,
    redirect: "/menu/menu1",
    name: "Menu",
    meta: {
      title: "管理",
      svgIcon: "menu"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/menu/menu1/index.vue"),
        name: "Menu1",
        meta: {
          title: "展区管理"
        }
      },
      {
        path: "zonePosition",
        component: () => import("@/views/menu/menu1/zonePosition.vue"),
        name: "zonePosition",
        meta: {
          title: "编辑展区位置",
          hidden: true,
          activeMenu: "/menu/menu1"
        }
      },
      {
        path: "menu2",
        component: () => import("@/views/menu/menu2/index.vue"),
        name: "Menu2",
        meta: {
          title: "展品管理"
        }
      },
      {
        path: "exhibitPosition",
        component: () => import("@/views/menu/menu2/exhibitPosition.vue"),
        name: "exhibitPosition",
        meta: {
          title: "编辑展品位置",
          hidden: true,
          activeMenu: "/menu/menu2"
        }
      },
      {
        path: "menu3",
        component: () => import("@/views/menu/menu3/index.vue"),
        name: "Menu3",
        meta: {
          title: "数据分析"
        }
      }
    ]
  },
  {
    path: "/muse-school",
    component: Layout,
    redirect: "/muse-school/home-page",
    name: "muse-school",
    meta: {
      title: "MuseSchool",
      svgIcon: "muse-school"
    },
    children: [
      {
        path: "home-page",
        component: () => import("@/views/muse-school/home-page/index.vue"),
        name: "home-page",
        meta: {
          title: "首页"
        }
      },
      {
        path: "manual-design",
        component: () => import("@/views/muse-school/manual-design/index.vue"),
        name: "manual-design",
        meta: {
          title: "设计手册"
        }
      }
    ]
  },
  {
    path: "/link",
    component: Layout,
    children: [
      {
        path: "https://pt.musepedia.cn",
        component: () => {},
        name: "Link",
        meta: {
          title: "官网",
          svgIcon: "link"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/userControl",
    name: "Permission",
    meta: {
      title: "多任务管理",
      svgIcon: "lock",
      roles: ["sys_admin"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      // {
      //   path: "page",
      //   component: () => import("@/views/permission/page.vue"),
      //   name: "PagePermission",
      //   meta: {
      //     title: "页面权限",
      //     roles: ["sys_admin"] // 或者在子导航中设置角色
      //   }
      // },
      {
        path: "userControl",
        component: () => import("@/views/permission/userTable.vue"),
        name: "UserControl",
        meta: {
          title: "用户管理"
        }
      },
      {
        path: "museumControl",
        component: () => import("@/views/permission/museumTable.vue"),
        name: "MuseumControl",
        meta: {
          title: "博物馆管理" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router

declare module "museschool" {
  //研学清单类型
  interface MuseManual {
    id: number
    title: string
    pages: MusePage[]
  }

  //研学清单页面类型
  interface MusePage {
    page: number
    background: string
    componentList: MuseComponent[]
  }

  //组件类型
  interface MuseComponent {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW: number
    minH: number
    maxW: number
    maxH: number
    type: number
    componentProps: {
      content?: string
      fontSize?: string
      fontWeight?: string
      color?: string
      background?: string
      url?: string
    }
  }

  //图片类型
  interface MuseImage {
    url: string
  }
}

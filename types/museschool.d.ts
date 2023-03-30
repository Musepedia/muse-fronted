declare module "museschool" {
  //组件类型
  interface Component {
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

  //研学清单类型
  interface Manual {
    id: number
    title: string
    componentList: Component[]
  }

  //图片类型
  interface MuseschoolImage {
    url: string
  }
}

declare module "museschool" {
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
    type: string
    componentProps?: {
      content?: string
      fontSize?: string
      fontWeight?: string
      color?: string
      background?: string
      url?: string
    } | null
  }
}

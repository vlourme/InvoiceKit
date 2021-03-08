export interface HSLA {
  a: number
  h: number
  l: number
  s: number
}

export interface HSVA {
  a: number
  h: number
  v: number
  s: number
}

export interface RGBA {
  a: number
  r: number
  g: number
  b: number
}

export interface ColorPicker {
  alpha: number
  hex: string
  hexa: string
  hsla: HSLA
  hsva: HSVA
  hue: number
  rgba: RGBA
}

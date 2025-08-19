export interface WorkingArea {
  id: string
  name: string
  type: 'polygon' | 'neighborhood'
  coordinates?: number[][]
  neighborhoods?: string[]
  isActive: boolean
}

export interface WorkingAreaFormData {
  name: string
  isActive: boolean
}

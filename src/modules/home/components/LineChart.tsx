'use client'

import BasicLine from '@/components/charts/BasicLine'

interface LineChartProps {
  data: Array<{
    label: string
    value: number
  }>
  title?: string
  color?: string
  height?: number
  yAxisLabel?: string
}

export function LineChart({ data, title, color = '#2196F3', height = 300, yAxisLabel }: LineChartProps) {
  const series = [
    {
      name: title || 'Data',
      data: data.map(item => item.value)
    }
  ]

  const categories = data.map(item => item.label)

  return <BasicLine series={series} categories={categories} colors={[color]} height={height} yAxisLabel={yAxisLabel} />
}

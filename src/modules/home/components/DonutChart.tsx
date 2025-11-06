import BasicDonut, { type BasicDonutProps } from '@/components/charts/BasicDonut'

export type DashboardDonutProps = {
  data: { label: string; value: number; color: string }[]
  height?: number
}

export function DashboardDonut({ data, height = 320 }: DashboardDonutProps) {
  const series: BasicDonutProps['series'] = data.map(d => d.value)
  const labels: BasicDonutProps['labels'] = data.map(d => d.label)
  const colors: BasicDonutProps['colors'] = data.map(d => d.color)
  return (
    <BasicDonut
      series={series}
      width='80%'
      labels={labels}
      colors={colors}
      height={height}
      dataLabels={{ enabled: false }}
    />
  )
}

'use client'

import type { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface BasicDonutProps extends ApexOptions {
  series: number[]
  labels: string[]
  colors?: string[]
  height?: number
  width?: number | string
}

export default function BasicDonut({ series, labels, colors, height = 320, width, ...options }: BasicDonutProps) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chartWidth, setChartWidth] = useState<number>(0)

  const total = Math.max(
    1,
    series.reduce((acc, v) => acc + v, 0)
  )

  useEffect(() => {
    if (chartRef.current) setChartWidth(chartRef.current.offsetWidth)
  }, [])

  const chartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false }
    },
    labels,
    colors,
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px' },
      formatter: function (_val, opts) {
        const value = series[opts.seriesIndex] ?? 0
        const percent = (value / total) * 100
        return `${percent.toFixed(0)}%`
      }
    },
    stroke: { width: 0 },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (value: number, opts) {
          const label = labels[opts.seriesIndex] ?? ''
          const percent = (value / total) * 100
          return `${label}: ${value} (${percent.toFixed(1)}%)`
        }
      }
    },
    legend: {
      position: 'bottom',
      itemMargin: { horizontal: 6, vertical: 6 },
      markers: { size: 10, offsetX: -5 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    ...options
  }

  return (
    <div ref={chartRef} className='flex items-center justify-center' style={{ width: width || '100%' }}>
      <Chart options={chartOptions} series={series} type='donut' height={height} width={width || chartWidth} />
    </div>
  )
}

'use client'

import type { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface BasicLineProps extends ApexOptions {
  series: Array<{
    name: string
    data: number[]
  }>
  categories: string[]
  colors?: string[]
  height?: number
  width?: number | string
}

export default function BasicLine({
  series,
  categories,
  colors = ['#2196F3'],
  height = 300,
  width,
  ...options
}: BasicLineProps) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [chartWidth, setChartWidth] = useState<number>(0)

  useEffect(() => {
    if (chartRef.current) setChartWidth(chartRef.current.offsetWidth)
  }, [])

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors,
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 3
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#64748b'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#64748b'
        }
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => value.toString()
      }
    },
    legend: {
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        size: 6
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: colors,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    ...options
  }

  return (
    <div ref={chartRef} style={{ width: width || '100%' }}>
      <Chart options={chartOptions} series={series} type='line' height={height} width={width || chartWidth} />
    </div>
  )
}

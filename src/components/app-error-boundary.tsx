'use client'

import ErrorPage from '@/components/error-page'
import React from 'react'

type AppErrorBoundaryProps = {
  children: React.ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

class AppErrorBoundaryImpl extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error caught by AppErrorBoundary', error)
  }

  private reset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          image='/images/error/light-500.png'
          title='Bir hata oluştu'
          description='Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
          action={{ label: 'Tekrar dene', onClick: this.reset }}
        />
      )
    }

    return this.props.children
  }
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return <AppErrorBoundaryImpl>{children}</AppErrorBoundaryImpl>
}

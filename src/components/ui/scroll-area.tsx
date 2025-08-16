import { cn } from '@/lib/utils'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'vertical' | 'horizontal' | 'both'
  scrollHideDelay?: number
  className?: string
}

interface ScrollBarProps {
  orientation: 'vertical' | 'horizontal'
  scrollRatio: number
  scrollPosition: number
  containerSize: number
  contentSize: number
  onScroll: (position: number) => void
  className?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'both', scrollHideDelay = 600, ...props }) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [showScrollbars, setShowScrollbars] = React.useState(false)
    const [scrollState, setScrollState] = React.useState({
      vertical: { ratio: 0, position: 0, containerSize: 0, contentSize: 0 },
      horizontal: { ratio: 0, position: 0, containerSize: 0, contentSize: 0 }
    })

    const updateScrollState = React.useCallback(() => {
      if (!containerRef.current || !contentRef.current) return

      const container = containerRef.current
      const content = contentRef.current

      const verticalRatio = container.clientHeight / content.scrollHeight
      const horizontalRatio = container.clientWidth / content.scrollWidth

      setScrollState({
        vertical: {
          ratio: verticalRatio,
          position: content.scrollTop,
          containerSize: container.clientHeight,
          contentSize: content.scrollHeight
        },
        horizontal: {
          ratio: horizontalRatio,
          position: content.scrollLeft,
          containerSize: container.clientWidth,
          contentSize: content.scrollWidth
        }
      })
    }, [])

    const handleScroll = React.useCallback(() => {
      updateScrollState()
      setShowScrollbars(true)

      // Hide scrollbars after delay
      const timeout = setTimeout(() => {
        setShowScrollbars(false)
      }, scrollHideDelay)

      return () => clearTimeout(timeout)
    }, [updateScrollState, scrollHideDelay])

    const handleVerticalScroll = React.useCallback((position: number) => {
      if (contentRef.current) {
        contentRef.current.scrollTop = position
      }
    }, [])

    const handleHorizontalScroll = React.useCallback((position: number) => {
      if (contentRef.current) {
        contentRef.current.scrollLeft = position
      }
    }, [])

    React.useEffect(() => {
      updateScrollState()
      const resizeObserver = new ResizeObserver(updateScrollState)

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => resizeObserver.disconnect()
    }, [updateScrollState])

    const shouldShowVertical = orientation === 'vertical' || orientation === 'both'
    const shouldShowHorizontal = orientation === 'horizontal' || orientation === 'both'

    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', className)} {...props}>
        <div
          ref={contentRef}
          className='scrollbar-hide h-full w-full overflow-auto'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onScroll={handleScroll}
          onMouseEnter={() => setShowScrollbars(true)}
          onMouseLeave={() => setShowScrollbars(false)}
        >
          {children}
        </div>

        {shouldShowVertical && scrollState.vertical.ratio < 1 && (
          <ScrollBar
            orientation='vertical'
            scrollRatio={scrollState.vertical.ratio}
            scrollPosition={scrollState.vertical.position}
            containerSize={scrollState.vertical.containerSize}
            contentSize={scrollState.vertical.contentSize}
            onScroll={handleVerticalScroll}
            className={cn(
              'absolute top-0 right-0 w-2 transition-opacity duration-200',
              showScrollbars ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {shouldShowHorizontal && scrollState.horizontal.ratio < 1 && (
          <ScrollBar
            orientation='horizontal'
            scrollRatio={scrollState.horizontal.ratio}
            scrollPosition={scrollState.horizontal.position}
            containerSize={scrollState.horizontal.containerSize}
            contentSize={scrollState.horizontal.contentSize}
            onScroll={handleHorizontalScroll}
            className={cn(
              'absolute bottom-0 left-0 h-2 transition-opacity duration-200',
              showScrollbars ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

const ScrollBar: React.FC<ScrollBarProps> = ({
  orientation,
  scrollRatio,
  scrollPosition,
  containerSize,
  contentSize,
  onScroll,
  className
}) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState(0)
  const [dragStartPosition, setDragStartPosition] = React.useState(0)
  const scrollbarRef = React.useRef<HTMLDivElement>(null)

  const thumbSize = Math.max(20, containerSize * scrollRatio)
  const maxScroll = contentSize - containerSize
  const thumbPosition = maxScroll > 0 ? (scrollPosition / maxScroll) * (containerSize - thumbSize) : 0

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart(orientation === 'vertical' ? e.clientY : e.clientX)
    setDragStartPosition(scrollPosition)
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const delta = (orientation === 'vertical' ? e.clientY : e.clientX) - dragStart
      const scrollDelta = (delta / (containerSize - thumbSize)) * maxScroll
      const newPosition = Math.max(0, Math.min(maxScroll, dragStartPosition + scrollDelta))

      onScroll(newPosition)
    },
    [isDragging, dragStart, dragStartPosition, containerSize, thumbSize, maxScroll, onScroll, orientation]
  )

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const isVertical = orientation === 'vertical'

  return (
    <div
      ref={scrollbarRef}
      className={cn(
        'flex touch-none transition-opacity duration-200 select-none',
        isVertical ? 'h-full w-2 border-l border-l-transparent p-[1px]' : 'h-2 border-t border-t-transparent p-[1px]',
        className
      )}
    >
      <div
        className={cn(
          'bg-primary hover:bg-primary/80 relative rounded-full transition-colors',
          isVertical ? 'w-full' : 'h-full'
        )}
        style={{
          [isVertical ? 'height' : 'width']: `${thumbSize}px`,
          [isVertical ? 'top' : 'left']: `${thumbPosition}px`
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export { ScrollArea }

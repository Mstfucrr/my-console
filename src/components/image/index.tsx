import { ImgHTMLAttributes, forwardRef } from 'react'

export interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  height?: number | string
  width?: number | string
  fill?: boolean
  alt?: string
}

const CustomImage = forwardRef<HTMLImageElement, CustomImageProps>((props, ref) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      decoding='async'
      loading='lazy'
      alt={props.alt}
      ref={ref}
      {...props}
      src={props.src}
      style={{
        ...props.style,
        height: props.height,
        width: props.width
      }}
    />
  )
})

CustomImage.displayName = 'CustomImage'

export default CustomImage

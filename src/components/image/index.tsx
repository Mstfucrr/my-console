import { ImgHTMLAttributes } from 'react'

export interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  height?: number | string
  width?: number | string
  fill?: boolean
  alt?: string
}

const CustomImage = (props: CustomImageProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      decoding='async'
      loading='lazy'
      alt={props.alt}
      {...props}
      src={props.src}
      style={{
        ...props.style,
        height: props.height,
        width: props.width
      }}
    />
  )
}

CustomImage.displayName = 'CustomImage'

export default CustomImage

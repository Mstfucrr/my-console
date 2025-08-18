const isLocationMatch = (href: string | undefined, locationName: string | null) => {
  if (!locationName || !href) return false
  return href === locationName
}

export { isLocationMatch }

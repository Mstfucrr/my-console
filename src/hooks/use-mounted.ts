import { useState } from 'react'

export function useMounted() {
  const [mounted] = useState(() => true)

  return mounted
}

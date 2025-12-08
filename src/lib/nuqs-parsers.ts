import { createParser } from 'nuqs'

const parseAsDateTime = createParser({
  type: 'single',
  parse: (value: string) => new Date(value),
  serialize: (value: Date) => value.toISOString().slice(0, 16)
})

export { parseAsDateTime }

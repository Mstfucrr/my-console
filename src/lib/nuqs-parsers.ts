import { APPLICATION_STEPS } from '@/modules/tenant/applications/create/constants'
import { WELCOME_ONBOARDING_STEP_QUERY_KEYS } from '@/modules/welcome/constants'
import { createParser, parseAsStringLiteral } from 'nuqs'

export const parseWelcomeOnboardingStep = parseAsStringLiteral(WELCOME_ONBOARDING_STEP_QUERY_KEYS)
  .withDefault(WELCOME_ONBOARDING_STEP_QUERY_KEYS[0])
  .withOptions({ history: 'push' })

export const parseStoreApplicationWizardStep = parseAsStringLiteral(APPLICATION_STEPS.map(step => step.key))
  .withDefault(APPLICATION_STEPS[0].key)
  .withOptions({ history: 'push' })

const parseAsDateTime = createParser({
  type: 'single',
  parse: (value: string) => new Date(value),
  serialize: (value: Date) => value.toISOString().slice(0, 16)
})

export { parseAsDateTime }

export const ONBOARDING_STEPS = {
  NAME_AGE: 'NameAge',
  PROFESSION: 'Profession',
  INTERESTS: 'Interests',
  SOURCE: 'Source',
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

export const ONBOARDING_STEPS = {
  NAME_AGE: 'NameAge',
  PROFESSION: 'Profession',
  INTERESTS: 'Interests',
  SOURCE: 'Source',
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

export const PROFESSIONS = [
  'Senior Frontend Developer',
  'Crypto Architect',
  'Data Scientist',
  'Day Trader',
  'Blockchain Developer',
  'AI Researcher',
  'Investment Banker',
  'Quantitative Analyst',
  'Portfolio Manager',
  'Risk Manager',
  'Compliance Officer',
  'Financial Analyst',
  'HFT Trader',
  'Algo Trader',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Mobile Developer',
  'Frontend Developer',
] as const;

export const INTEREST_TAGS = [
  'AI & Autonomous Agents',
  'Crypto Volatility',
  'Market Psychology',
  'High-Frequency Algos',
  'Machine Learning',
  'Reinforcement Learning',
  'Deep Learning',
  'Neural Networks',
  'Trading Algorithms',
  'Financial Analysis',
  'Quantitative Trading',
  'Algorithmic Trading',
  'High-Frequency Trading',
  'Low-Frequency Trading',
  'Medium-Frequency Trading',
] as const;

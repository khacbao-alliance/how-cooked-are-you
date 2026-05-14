export interface QuizAnswers {
  name: string
  gender: 'male' | 'female' | 'other'
  sleepHours: number
  meetings: number
  bugs: number
  coffeeCount: number
  fridayDeploy: boolean
  quickCalls: number
  stressLevel: number
  overtime: boolean
}

export interface RoastResult {
  burnoutAnalysis: string
  roast: string
  advice: string
  score: number
  level: BurnoutLevel
}

export type BurnoutLevel =
  | 'Suspiciously Fine'
  | 'Mildly Toasted'
  | 'Cooked'
  | 'Well Done'
  | 'Fully Carbonized'

import type { QuizAnswers, BurnoutLevel } from '@/types'

// Max theoretical raw score across all inputs at their maximums
const MAX_SCORE = 544

export function calculateCookedScore(answers: QuizAnswers): number {
  const raw =
    answers.meetings * 5 +
    answers.bugs * 10 +
    answers.coffeeCount * 4 +
    Math.max(0, 8 - answers.sleepHours) * 8 +
    (answers.fridayDeploy ? 20 : 0) +
    answers.quickCalls * 7 +
    answers.stressLevel * 6 +
    (answers.overtime ? 15 : 0)
  return Math.min(Math.round((raw / MAX_SCORE) * 100), 100)
}

export function getBurnoutLevel(score: number): {
  level: BurnoutLevel
  emoji: string
  description: string
  color: string
  bgColor: string
  barColor: string
} {
  if (score <= 20)
    return {
      level: 'Suspiciously Fine',
      emoji: '🌱',
      description: 'Bạn đang nói dối hoặc bạn là robot. Đáng ngờ lắm.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      barColor: 'bg-green-500',
    }
  if (score <= 40)
    return {
      level: 'Mildly Toasted',
      emoji: '🍞',
      description: 'Dev chín vừa, còn dùng được. Nhưng đừng chủ quan.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
    }
  if (score <= 60)
    return {
      level: 'Cooked',
      emoji: '🔥',
      description: 'Chín kỹ rồi đấy. Kèm theo một bên burnout thượng hạng.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      barColor: 'bg-orange-500',
    }
  if (score <= 80)
    return {
      level: 'Well Done',
      emoji: '💀',
      description: 'Bên ngoài cháy đen, bên trong chưa chín. Classic.',
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200',
      barColor: 'bg-red-500',
    }
  return {
    level: 'Fully Carbonized',
    emoji: '☠️',
    description: 'Bạn không còn là dev nữa. Bạn là than củi.',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-300',
    barColor: 'bg-red-700',
  }
}

export function answersFromParams(params: URLSearchParams): QuizAnswers {
  return {
    name: params.get('nm') ?? '',
    gender: (params.get('gd') as QuizAnswers['gender']) ?? 'other',
    sleepHours: Number(params.get('sl') ?? 6),
    meetings: Number(params.get('mt') ?? 0),
    bugs: Number(params.get('bg') ?? 0),
    coffeeCount: Number(params.get('cf') ?? 0),
    fridayDeploy: params.get('fd') === '1',
    quickCalls: Number(params.get('qc') ?? 0),
    stressLevel: Number(params.get('st') ?? 5),
    overtime: params.get('ot') === '1',
  }
}

export function answersToParams(answers: QuizAnswers): string {
  const p = new URLSearchParams({
    nm: answers.name,
    gd: answers.gender,
    sl: String(answers.sleepHours),
    mt: String(answers.meetings),
    bg: String(answers.bugs),
    cf: String(answers.coffeeCount),
    fd: answers.fridayDeploy ? '1' : '0',
    qc: String(answers.quickCalls),
    st: String(answers.stressLevel),
    ot: answers.overtime ? '1' : '0',
  })
  return p.toString()
}

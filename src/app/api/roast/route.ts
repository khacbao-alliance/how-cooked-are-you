import { GoogleGenerativeAI } from '@google/generative-ai'
import { calculateCookedScore, getBurnoutLevel } from '@/lib/score'
import type { QuizAnswers } from '@/types'

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    )
  }

  const answers: QuizAnswers = await request.json()
  const score = calculateCookedScore(answers)
  const { level } = getBurnoutLevel(score)

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite',
  })

  const genderLabel = answers.gender === 'male'
    ? 'Nam (xưng hô: anh)'
    : answers.gender === 'female'
    ? 'Nữ (xưng hô: chị)'
    : 'Không xác định (xưng hô: bạn)'

  const nameHint = answers.name
    ? `Hãy dùng tên "${answers.name}" ít nhất 1 lần trong burnoutAnalysis hoặc roast.`
    : ''

  const prompt = `Bạn là một senior dev Việt Nam 10 năm kinh nghiệm, kiêm AI chẩn đoán burnout cực hài. Bạn nói chuyện theo phong cách meme dev Việt, brutal honest nhưng luôn quan tâm. Bạn dùng ẩn dụ kỹ thuật phần mềm như bác sĩ dùng thuật ngữ y khoa.

Dữ liệu hôm nay của dev:
- Tên: ${answers.name || 'Ẩn danh'}
- Giới tính: ${genderLabel}
- Ngủ: ${answers.sleepHours} tiếng
- Tab Chrome đang mở: ${answers.meetings}
- Bug production: ${answers.bugs}
- Ly cà phê: ${answers.coffeeCount}
- Deploy thứ 6: ${answers.fridayDeploy ? 'CÓ 💀' : 'Không'}
- Task bị gắn "URGENT": ${answers.quickCalls}
- Mức stress: ${answers.stressLevel}/10
- OT cứu production: ${answers.overtime ? 'Có' : 'Không'}
- Điểm Cháy: ${score}%
- Mức: ${level}
${nameHint}

Trả về ONLY valid JSON (không markdown, không code block, không backtick):
{
  "burnoutAnalysis": "2-3 câu chẩn đoán theo kiểu incident report của SRE. Dùng ít nhất 2 thuật ngữ kỹ thuật (memory leak, stack overflow, deadlock, race condition, null pointer exception, segfault, SIGKILL...) để mô tả tình trạng tinh thần. Phải nhắc đến ÍT NHẤT 2 con số cụ thể từ dữ liệu của họ. Kết thúc bằng một câu chẩn đoán chính thức kiểu doctor.",
  "roast": "2-3 câu roast cực kỳ specific với data của người dùng — nhắc thẳng đến con số tab, bug, hoặc giờ ngủ cụ thể. Phong cách như người anh senior vừa xem code review của junior và không nhịn được. Brutal nhưng không mean. Câu cuối phải acknowledge rằng họ vẫn đang cố gắng và điều đó đáng được công nhận.",
  "advice": "Ba lời khuyên sinh tồn — mỗi tip trên một dòng, bắt đầu bằng •. Mỗi tip gồm: tên tip sáng tạo dùng thuật ngữ kỹ thuật + một hành động cụ thể có thể làm trong 5 phút. Hài nhưng thực sự hữu ích."
}

Quan trọng: Toàn bộ tiếng Việt. Không dùng từ offensive/toxic. Phải specific với data — tránh câu chung chung như 'bạn cần nghỉ ngơi'."
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'AI response was not valid JSON' }, { status: 500 })
    }

    const data = JSON.parse(jsonMatch[0])
    return Response.json({ ...data, score, level })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: `AI generation failed: ${message}` }, { status: 500 })
  }
}

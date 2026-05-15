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

  const roastIntensity = score < 40
    ? 'Roast nhẹ như bạn thân trêu nhau — vui vẻ, không châm chích. Câu cuối: một câu trêu dí dỏm kiểu "ít ra còn sống sót đến đây".'
    : score < 70
    ? 'Roast vừa — thẳng thắn, hơi cay, kiểu anh senior code review không giữ ý. Câu cuối: công nhận họ vẫn đang cố nhưng đừng quá ngọt.'
    : 'Roast brutal — không khoan nhượng, thẳng tay, đọc xong phải tự nhìn lại cuộc đời. Câu cuối: một câu cảnh báo nghiêm túc kiểu "đây là production incident thật rồi đấy".'

  const prompt = `Bạn là senior dev Việt Nam 10 năm kinh nghiệm, chuyên chẩn đoán burnout theo phong cách meme dev. Bạn CHỈ dùng ẩn dụ lập trình/kỹ thuật phần mềm — KHÔNG bao giờ dùng thuật ngữ y khoa (viêm, phản ứng, liều thuốc, bệnh...).

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
  "burnoutAnalysis": "2-3 câu, tone nhẹ nhàng như người anh nói chuyện — không khô cứng, không liệt kê. Dùng đúng 1 thuật ngữ lập trình duy nhất để ví von, kèm giải thích trong ngoặc đơn theo kiểu 'áp vào người thì trông như thế nào' chứ KHÔNG phải định nghĩa kỹ thuật. Ví dụ đúng: 'memory leak (não cứ giữ mãi không chịu buông)'. Ví dụ sai: 'memory leak (rò rỉ tài nguyên khiến bộ nhớ đầy)'. Nhắc ít nhất 2 con số thực từ data. Câu cuối là một nhận xét thẳng thắn nhưng không lạnh.",
  "roast": "2-3 câu, gắn thẳng vào data cụ thể (tab, bug, giờ ngủ). ${roastIntensity} Nếu dùng thuật ngữ kỹ thuật, chỉ giải thích tối đa 1 cái trong ngoặc đơn — theo kiểu áp vào người, không phải định nghĩa. Xưng hô nhất quán theo giới tính đã cho, giữ nguyên từ đầu đến cuối.",
  "advice": "Ba mẹo sinh tồn — mỗi mẹo trên một dòng, bắt đầu bằng •. Mỗi mẹo: tên mẹo là một lệnh/khái niệm dev + giải thích nghĩa trong ngoặc đơn ngay sau tên, ví dụ: '• git stash (cất tạm mọi thứ sang một bên)' rồi mô tả hành động cụ thể dưới 15 giây để làm ngay. Viết ngắn, đọc xong hiểu liền, có thể hơi hài nhưng phải làm được thật."
}

Quan trọng: Toàn bộ tiếng Việt. Câu ngắn, dễ hiểu. Không dùng từ offensive. Không câu chung chung kiểu 'hãy nghỉ ngơi đầy đủ'."
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

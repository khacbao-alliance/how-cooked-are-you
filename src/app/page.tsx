'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DevCharacter from '@/components/DevCharacter'

const levels = [
  { emoji: '🌱', label: 'Bình Thường Đáng Ngờ', range: '0–20%',   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Bạn đang nói dối hoặc là robot.' },
  { emoji: '🍞', label: 'Hơi Ám Khói',          range: '21–40%',  color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Dev chín vừa. Còn dùng được.' },
  { emoji: '🔥', label: 'Đang Cháy',             range: '41–60%',  color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', desc: 'Chín kỹ rồi. Kèm một bên burnout.' },
  { emoji: '💀', label: 'Chín Tới Rồi',          range: '61–80%',  color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Bên ngoài cháy, bên trong chưa chín.' },
  { emoji: '☠️', label: 'Thành Tro Rồi',         range: '81–100%', color: '#991b1b', bg: '#fef2f2', border: '#fca5a5', desc: 'Bạn không còn là dev. Bạn là than.' },
]

const testimonials = [
  { quote: 'Tôi đạt mức "Thành Tro Rồi". Sếp tôi tự hào. Tôi thì không còn cảm giác nữa.', author: 'senior_dev_khoc', role: '15 năm kinh nghiệm · 0 work-life balance', avatar: '😭' },
  { quote: 'AI roast tôi chính xác hơn cả đánh giá hiệu suất hàng năm của HR.', author: 'nan_kho_agile', role: 'Nạn nhân chuyên nghiệp của scrum', avatar: '🤡' },
  { quote: 'Cuối cùng có thứ gì đó hiểu nỗi đau hotfix lúc 3 giờ sáng.', author: 'deployThu6', role: 'Chaos engineer — không tự nguyện', avatar: '💀' },
]

const mascotLines = [
  { face: '🔥', say: 'Bạn có đang cháy không? Hãy để tôi đo!' },
  { face: '🤨', say: 'Ngủ mấy tiếng? Họp bao nhiêu buổi?' },
  { face: '😱', say: 'Deploy thứ 6??? Bạn có ổn không???' },
  { face: '☕', say: 'Cà phê thứ 6 của ngày... bình thường mà.' },
  { face: '💀', say: 'Production đang khóc... cùng bạn.' },
  { face: '🎉', say: 'Xong rồi! Kết quả sẽ làm bạn... không chắc.' },
]

const steps = [
  { step: 1, icon: '📋', title: 'Trả lời 8 câu hỏi', desc: 'Giấc ngủ, cuộc họp, bug, cà phê — danh sách chấn thương kinh điển của dev.', color: '#f97316' },
  { step: 2, icon: '🧮', title: 'Tính điểm Cháy',    desc: 'Thuật toán tính mức burnout từ 0–100% dựa trên trọng số từng yếu tố.', color: '#ec4899' },
  { step: 3, icon: '🤖', title: 'Nhận phân tích AI',  desc: 'Gemini AI roast bạn, phân tích burnout và đưa ra lời khuyên sinh tồn.', color: '#8b5cf6' },
]

function FloatingMascot() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % mascotLines.length), 3000)
    return () => clearInterval(t)
  }, [])

  const m = mascotLines[idx]

  return (
    <DevCharacter
      face={m.face}
      say={m.say}
      size={140}
      questionKey="landing"
    />
  )
}

function AnimatedScoreBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="mt-10 pt-8 border-t border-orange-100">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Thang điểm burnout</p>
      <div className="flex h-4 rounded-full overflow-hidden gap-1">
        {levels.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={visible ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
            className="flex-1 rounded-full origin-left"
            style={{ backgroundColor: l.color }}
            title={`${l.label} — ${l.range}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2.5">
        {levels.map((l) => (
          <span key={l.label} className="text-base">{l.emoji}</span>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-base text-gray-900 flex items-center gap-2"
          >
            🔥 BurnoutMeter
          </motion.span>
          <Link
            href="/quiz"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Bắt đầu →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-orange-50 via-amber-50/40 to-white px-6 pt-16 pb-20 overflow-hidden">

        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 right-10 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 left-6 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ y: [-5, 5, -5], x: [3, -3, 3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-32 left-1/4 w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-7"
              >
                <span>✦</span>
                Powered by Gemini AI · Miễn phí · Không cần đăng ký
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 mb-5"
              >
                Bạn đang cháy
                <br />
                <span className="text-orange-500">đến mức nào?</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg"
              >
                Trả lời 8 câu hỏi về ngày làm việc. AI tính điểm burnout,
                phân tích tình trạng và roast bạn theo phong cách dev Việt.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/quiz">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg cursor-pointer select-none"
                    style={{ boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}
                  >
                    🔥 Kiểm tra ngay
                  </motion.span>
                </Link>
                <a href="#scale">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600 font-medium text-sm bg-white cursor-pointer select-none transition-colors"
                  >
                    Xem thang đo ↓
                  </motion.span>
                </a>
              </motion.div>
            </div>

            {/* Right — mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center justify-center"
            >
              <FloatingMascot />

              {/* Mini stats */}
              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[320px]">
                {[
                  { n: '8', label: 'câu hỏi', icon: '📋' },
                  { n: '5',  label: 'mức cháy', icon: '🌡️' },
                  { n: 'AI', label: 'phân tích', icon: '🤖' },
                ].map(({ n, label, icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                    className="flex flex-col items-center gap-1 py-4 px-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-2xl font-extrabold text-gray-900">{n}</span>
                    <span className="text-xs text-gray-400 font-medium">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <AnimatedScoreBar />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Cách hoạt động</h2>
            <p className="text-gray-400 text-sm mb-12">3 bước để đối mặt với sự thật.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, icon, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm"
                  style={{ background: color + '18', border: `2px solid ${color}30` }}
                >
                  {icon}
                </motion.div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
                  Bước {String(step).padStart(2, '0')}
                </p>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>

                {/* connector arrow */}
                {i < steps.length - 1 && (
                  <span className="hidden md:block absolute top-6 -right-4 text-gray-200 text-xl select-none">→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Burnout scale */}
      <section id="scale" className="bg-gradient-to-b from-orange-50/40 to-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Thang đo Burnout</h2>
            <p className="text-gray-400 text-sm mb-10">Bạn sẽ rơi vào mức nào?</p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {levels.map(({ emoji, label, range, color, bg, border, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border transition-shadow hover:shadow-md cursor-default"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <motion.span
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  className="text-2xl w-8 text-center shrink-0 select-none"
                >
                  {emoji}
                </motion.span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-bold text-sm" style={{ color }}>{label}</span>
                    <span className="text-gray-400 text-xs font-mono bg-white/60 px-2 py-0.5 rounded-full">{range}</span>
                  </div>
                  <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: range.split('–')[1] }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color, opacity: 0.6 }}
                    />
                  </div>
                </div>
                <span className="text-gray-400 text-xs hidden sm:block max-w-[160px] text-right shrink-0">{desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Dev nói gì</h2>
            <p className="text-gray-400 text-sm mb-10">Testimonial từ các dev tưởng tượng đang rất cháy.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ quote, author, role, avatar }, i) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4, type: 'spring', stiffness: 250 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
                className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-orange-100 hover:bg-orange-50/30 transition-colors"
              >
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-lg shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">@{author}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-orange-500 to-pink-500 py-20 px-6 overflow-hidden">
        {/* background bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {['☕', '🐛', '💀', '🔥', '☠️'].map((e, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl select-none opacity-20"
              style={{ top: `${15 + i * 18}%`, left: `${8 + i * 18}%` }}
              animate={{ y: [-6, 6, -6], rotate: [-5, 5, -5] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold text-white mb-2"
            >
              Sẵn sàng đối mặt<br />với sự thật? 🔥
            </motion.h2>
            <p className="text-orange-100 text-sm">Làm quiz · Bị roast · Chia sẻ với team · Cùng nhau khóc.</p>
          </div>
          <Link href="/quiz">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-bold text-base shadow-xl cursor-pointer select-none whitespace-nowrap"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            >
              Bắt đầu kiểm tra →
            </motion.span>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>🔥 BurnoutMeter · Powered by Gemini AI</span>
          <span>Không phải lời khuyên y tế.</span>
        </div>
      </footer>

    </main>
  )
}

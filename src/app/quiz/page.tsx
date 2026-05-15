'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { answersToParams } from '@/lib/score'
import type { QuizAnswers } from '@/types'
import Link from 'next/link'
import DevCharacter from '@/components/DevCharacter'

/* ─── defaults ─────────────────────────────────── */
const DEFAULT: QuizAnswers = {
  name: '', gender: 'other',
  sleepHours: 6, meetings: 3, bugs: 1, coffeeCount: 2,
  fridayDeploy: false, quickCalls: 1, stressLevel: 5, overtime: false,
}

/* ─── mascot reactions per question+value ────────── */
function getMascot(key: keyof QuizAnswers, val: QuizAnswers[keyof QuizAnswers]) {
  const n = Number(val)
  const b = Boolean(val)
  switch (key) {
    case 'sleepHours':
      return n <= 3 ? { face: '💀', say: 'Bạn sống bằng gì vậy trời...' }
           : n <= 5 ? { face: '😵', say: 'Mắt đang nhắm không?' }
           : n <= 7 ? { face: '😐', say: 'Tạm ổn... tạm thôi.' }
           :          { face: '🤨', say: 'Ngủ nhiều thế? Nghi lắm 👀' }
    case 'coffeeCount':
      return n === 0 ? { face: '😶', say: 'Không cà phê?? Bạn là ai??' }
           : n <= 2  ? { face: '☕', say: 'Bình thường phết.' }
           : n <= 5  ? { face: '😬', say: 'Hơi nhiều đó nha...' }
           :           { face: '⚡', say: 'TIM ĐANG ĐẬP KHÔNG??' }
    case 'meetings':
      return n === 0  ? { face: '🧘', say: 'Không tab nào? Bạn là thiền sư số.' }
           : n <= 5   ? { face: '😌', say: 'Bình thường. RAM ổn.' }
           : n <= 15  ? { face: '😵', say: 'PC bạn có còn thở không??' }
           : n <= 30  ? { face: '🤯', say: 'Đây không phải tab, đây là khủng hoảng.' }
           :            { face: '🔥', say: 'RAM đã bốc hơi. PC đang cầu nguyện.' }
    case 'quickCalls':
      return n === 0  ? { face: '🧘', say: 'Backlog sạch bóng. Hiếm lắm!' }
           : n <= 2   ? { face: '😐', say: 'Vẫn chịu đựng được...' }
           : n <= 5   ? { face: '😰', say: 'URGENT ở đâu cũng thấy...' }
           : n <= 10  ? { face: '💀', say: 'Tất cả urgent = không cái nào urgent.' }
           :            { face: '☠️', say: '"URGENT" đã là trạng thái bình thường của bạn rồi.' }
    case 'bugs':
      return n === 0 ? { face: '✨', say: 'Code xịn! Hay là chưa test?' }
           : n <= 3  ? { face: '🐛', say: 'Ai code cũng có bug cả.' }
           : n <= 8  ? { face: '😰', say: 'Production đang khóc...' }
           :           { face: '☠️', say: 'Hệ thống đang cầu nguyện.' }
    case 'fridayDeploy':
      return !b ? { face: '😇', say: 'Khôn ngoan lắm!' }
               : { face: '😱', say: 'WHY?! WHY WOULD YOU?!' }
    case 'stressLevel':
      return n <= 3 ? { face: '🧘', say: 'Zen master! Dạy tôi với.' }
           : n <= 5 ? { face: '😊', say: 'Ổn mà...' }
           : n <= 7 ? { face: '😅', say: 'Thở đều đi nào...' }
           : n <= 9 ? { face: '😨', say: 'Đừng đập bàn nhé!' }
           :          { face: '🤯', say: 'MÀN HÌNH CÒN NGUYÊN KHÔNG?!' }
    case 'overtime':
      return !b ? { face: '🎉', say: 'Production ổn! Bạn cũng ổn!' }
               : { face: '😔', say: 'Deploy gì mà OT cứu production...' }
    default: return { face: '🤖', say: 'Hmm...' }
  }
}

/* ─── question config ────────────────────────────── */
type QStyle = 'bubbles' | 'emoji-scale' | 'big-cards' | 'coffee-tap' | 'bug-grid' | 'clock-cards'

interface QDef {
  key: keyof QuizAnswers
  style: QStyle
  question: string
  subtext: string
  bg: string        // background color of the card
  accent: string    // accent hex for selected state
  options?: { value: number; label: string; icon?: string }[]
}

const QUESTIONS: QDef[] = [
  {
    key: 'sleepHours', style: 'bubbles',
    question: 'Tối qua ngủ được mấy tiếng?',
    subtext: 'Ngủ gật trong meeting không tính nhé.',
    bg: 'from-indigo-50 to-blue-50', accent: '#6366f1',
    options: [0,1,2,3,4,5,6,7,8,9,10,11,12].map(v => ({
      value: v,
      label: `${v}h`,
      icon: v <= 3 ? '💀' : v <= 5 ? '😴' : v <= 7 ? '😅' : '✨',
    })),
  },
  {
    key: 'coffeeCount', style: 'coffee-tap',
    question: 'Hôm nay uống mấy ly cà phê?',
    subtext: 'Cà phê, trà sữa, nước tăng lực — tất cả đều tính.',
    bg: 'from-amber-50 to-orange-50', accent: '#f59e0b',
    options: [0,1,2,3,4,5,6,7,8,9,10].map(v => ({ value: v, label: `${v}` })),
  },
  {
    key: 'meetings', style: 'bubbles',
    question: 'Hiện đang mở bao nhiêu tab Chrome?',
    subtext: 'Google Slide, Google Chat, docs, YouTube "học" — tất cả đều tính.',
    bg: 'from-sky-50 to-cyan-50', accent: '#0ea5e9',
    options: [0,1,2,3,4,5,6,7,8,10,12,15,20,25,30,40,50,69,99].map(v => ({
      value: v,
      label: v === 99 ? '99+' : `${v}`,
      icon: v === 0 ? '🧘' : v <= 5 ? '😌' : v <= 15 ? '😵' : v <= 30 ? '🤯' : '🔥',
    })),
  },
  {
    key: 'quickCalls', style: 'bubbles',
    question: 'Có bao nhiêu task bị gắn "URGENT"?',
    subtext: 'Alliance App, tin nhắn sếp — chỉ cần có chữ URGENT là tính.',
    bg: 'from-violet-50 to-purple-50', accent: '#8b5cf6',
    options: [0,1,2,3,4,5,6,7,8,9,10,12,15,20].map(v => ({
      value: v,
      label: `${v}`,
      icon: v === 0 ? '🌱' : v <= 2 ? '📌' : v <= 5 ? '🔥' : v <= 10 ? '☠️' : '💀',
    })),
  },
  {
    key: 'bugs', style: 'bug-grid',
    question: 'Bao nhiêu bug production hôm nay?',
    subtext: 'Cứ thành thật. AI biết hết rồi.',
    bg: 'from-red-50 to-rose-50', accent: '#ef4444',
    options: [0,1,2,3,4,5,6,8,10,12,15,20].map(v => ({
      value: v,
      label: `${v}`,
      icon: v === 0 ? '✨' : v <= 3 ? '🐛' : v <= 8 ? '🪲' : '☠️',
    })),
  },
  {
    key: 'fridayDeploy', style: 'big-cards',
    question: 'Deploy lên production vào thứ 6 không?',
    subtext: 'Bạn có biết mình đang làm gì không?',
    bg: 'from-yellow-50 to-orange-50', accent: '#f97316',
  },
  {
    key: 'stressLevel', style: 'emoji-scale',
    question: 'Độ stress hiện tại từ 1 đến 10?',
    subtext: '1 = thiền sư, 10 = màn hình đang rung.',
    bg: 'from-pink-50 to-rose-50', accent: '#ec4899',
    options: [
      { value: 1, label: '1', icon: '🧘' },
      { value: 2, label: '2', icon: '😌' },
      { value: 3, label: '3', icon: '🙂' },
      { value: 4, label: '4', icon: '😐' },
      { value: 5, label: '5', icon: '😅' },
      { value: 6, label: '6', icon: '😓' },
      { value: 7, label: '7', icon: '😰' },
      { value: 8, label: '8', icon: '😱' },
      { value: 9, label: '9', icon: '🤬' },
      { value: 10, label: '10', icon: '🤯' },
    ],
  },
  {
    key: 'overtime', style: 'clock-cards',
    question: 'Hôm nay có OT cứu production không?',
    subtext: '"Deploy thử xem" lúc 8h tối cũng tính.',
    bg: 'from-teal-50 to-green-50', accent: '#14b8a6',
  },
]

/* ─── sub-components ─────────────────────────────── */

function BubbleGrid({ options, selected, accent, onChange }: {
  options: NonNullable<QDef['options']>
  selected: number
  accent: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {options.map((opt, i) => {
        const active = selected === opt.value
        return (
          <motion.button
            key={opt.value}
            initial={{ y: 24, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 380, damping: 22 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-colors min-w-[52px]"
            style={{
              borderColor: active ? accent : '#e5e7eb',
              background: active ? accent : 'white',
              color: active ? 'white' : '#374151',
              boxShadow: active ? `0 4px 14px ${accent}40` : '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
            <span>{opt.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

function CoffeeTap({ selected, accent, onChange }: {
  selected: number; accent: string; onChange: (v: number) => void
}) {
  const MAX = 10
  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={   { scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="text-6xl font-extrabold tabular-nums text-amber-700 text-center"
        >
          {selected}
          <span className="text-2xl font-normal text-amber-400 ml-2">ly</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
        {Array.from({ length: MAX + 1 }, (_, i) => {
          // i = cup index (0-based).  Cup i is filled when i < selected.
          // Clicking a filled cup (i < selected) trims down to i cups.
          // Clicking the next/empty cup (i >= selected) fills up to i+1 cups.
          const filled = i < selected
          const isNext = i === selected
          return (
            <motion.button
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 400 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => onChange(i + 1 === selected ? i : Math.min(MAX, i + 1))}
              className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2"
              style={{
                background:  filled ? accent : isNext ? '#fff7ed' : '#f9fafb',
                borderColor: filled ? accent : isNext ? '#fed7aa' : '#e5e7eb',
                filter: filled ? 'none' : 'grayscale(0.5)',
              }}
              title={`${i + 1} ly`}
            >
              ☕
            </motion.button>
          )
        })}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => onChange(Math.max(0, selected - 1))}
          className="w-12 h-12 rounded-full border-2 border-gray-200 text-gray-500 text-xl font-bold hover:border-gray-300 transition-colors"
        >−</button>
        <button
          onClick={() => onChange(Math.min(MAX, selected + 1))}
          className="w-12 h-12 rounded-full border-2 font-bold text-xl transition-colors text-white"
          style={{ background: accent, borderColor: accent }}
        >+</button>
      </div>
    </div>
  )
}

function LadybugIcon({ size = 36, filled = true }: { size?: number; filled?: boolean }) {
  const body  = filled ? '#dc2626' : '#d1d5db'
  const dark  = filled ? '#1a1208' : '#9ca3af'
  return (
    <svg width={size} height={size} viewBox="0 0 40 44" style={{ overflow: 'visible' }}>
      {/* antennae */}
      <line x1="15" y1="6"  x2="10" y2="1"  stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9.5" cy="0.5" r="1.8" fill={dark} />
      <line x1="25" y1="6"  x2="30" y2="1"  stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="30.5" cy="0.5" r="1.8" fill={dark} />
      {/* head */}
      <circle cx="20" cy="10" r="7.5" fill={dark} />
      {filled && (
        <>
          <circle cx="17" cy="9"  r="1.8" fill="white" />
          <circle cx="23" cy="9"  r="1.8" fill="white" />
        </>
      )}
      {/* body */}
      <ellipse cx="20" cy="29" rx="14" ry="13" fill={body} />
      {/* shine */}
      {filled && <ellipse cx="13" cy="24" rx="4" ry="2.5" fill="white" opacity="0.28" transform="rotate(-20,13,24)" />}
      {/* center line */}
      <line x1="20" y1="17" x2="20" y2="42" stroke={dark} strokeWidth="1.6" />
      {/* spots */}
      {filled && (
        <>
          <circle cx="13.5" cy="27" r="2.8" fill={dark} />
          <circle cx="26.5" cy="27" r="2.8" fill={dark} />
          <circle cx="13"   cy="34" r="2.2" fill={dark} />
          <circle cx="27"   cy="34" r="2.2" fill={dark} />
        </>
      )}
    </svg>
  )
}

const BUG_PRESETS = [10, 12, 15, 20]

function LadybugTap({ selected, onChange }: { selected: number; onChange: (v: number) => void }) {
  const MAX = 8

  return (
    <div className="flex flex-col items-center gap-5">
      {/* count display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={   { scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="text-center min-h-[64px] flex flex-col items-center justify-center"
        >
          {selected === 0 ? (
            <>
              <span className="text-5xl">✨</span>
              <p className="text-xs text-green-600 font-semibold mt-1">Không bug nào! Thiên tài vậy?</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-black text-red-600 tabular-nums">{selected}</span>
                <span className="text-lg text-red-400 font-medium">con 🐞</span>
              </div>
              <p className="text-xs text-red-400 font-medium mt-0.5">
                {selected <= 3 ? 'Ai code cũng có bug...' : selected <= 8 ? 'Production đang khóc...' : 'Hệ thống đang cầu nguyện.'}
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ladybug tap row (0–8) */}
      <div className="flex flex-wrap gap-2 justify-center max-w-[300px]">
        {/* slot 0 */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0, type: 'spring', stiffness: 380 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => onChange(0)}
          className="w-11 h-11 rounded-xl flex items-center justify-center border-2 text-xl transition-all"
          style={{
            borderColor: selected === 0 ? '#16a34a' : '#e5e7eb',
            background:  selected === 0 ? '#f0fdf4' : '#f9fafb',
          }}
          title="0 bugs"
        >✨</motion.button>

        {/* slots 1–8 */}
        {Array.from({ length: MAX }, (_, i) => {
          const n = i + 1
          // Filled if n <= selected (even when selected > MAX, all 8 show red)
          const filled = n <= selected
          // Active highlight only on the exact selected slot (not presets)
          const active = selected === n
          return (
            <motion.button
              key={n}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: active ? 1.1 : 1, rotate: 0, opacity: 1 }}
              transition={{ delay: n * 0.055, type: 'spring', stiffness: 360, damping: 20 }}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.78 }}
              // Click active slot → deselect (n−1). Click any other → set to n.
              onClick={() => onChange(n === selected ? n - 1 : n)}
              className="w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-all"
              style={{
                borderColor: active ? '#dc2626' : filled ? '#fca5a5' : '#e5e7eb',
                background:  active ? '#fee2e2' : filled ? '#fff5f5' : '#f9fafb',
                boxShadow:   active ? '0 4px 12px rgba(220,38,38,0.28)' : 'none',
              }}
              title={`${n} bug${n > 1 ? 's' : ''}`}
            >
              <LadybugIcon size={28} filled={filled} />
            </motion.button>
          )
        })}
      </div>

      {/* large-value presets */}
      <div className="flex gap-2 flex-wrap justify-center">
        {BUG_PRESETS.map((val, i) => {
          const active = selected === val
          return (
            <motion.button
              key={val}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.06, type: 'spring' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(val)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 text-sm font-bold transition-all"
              style={{
                borderColor: active ? '#dc2626' : '#fecaca',
                background:  active ? '#dc2626' : 'white',
                color:        active ? 'white'   : '#dc2626',
                boxShadow:   active ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
              }}
            >
              <LadybugIcon size={16} filled={!active} />
              ×{val}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function EmojiScale({ options, selected, accent, onChange }: {
  options: NonNullable<QDef['options']>; selected: number; accent: string; onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {options.map((opt, i) => {
        const active = selected === opt.value
        return (
          <motion.button
            key={opt.value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, scale: active ? 1.12 : 1, opacity: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 350, damping: 20 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl border-2"
            style={{
              borderColor: active ? accent : '#e5e7eb',
              background:  active ? accent : 'white',
              boxShadow:   active ? `0 6px 16px ${accent}40` : 'none',
            }}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-xs font-bold" style={{ color: active ? 'white' : '#6b7280' }}>
              {opt.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

function BigCards({ questionKey, selected, onChange }: {
  questionKey: keyof QuizAnswers; selected: boolean; onChange: (v: boolean) => void
}) {
  const isDeployQ = questionKey === 'fridayDeploy'
  return (
    <div className="grid grid-cols-2 gap-4">
      {[false, true].map((val) => {
        const active = selected === val
        const isYes = val
        const yesLabel = isDeployQ ? '💀 Có — YOLO' : '😔 Có'
        const noLabel  = isDeployQ ? '🙏 Không — wise' : '🎉 Không'
        const yesColor = isDeployQ ? { bg: '#fef2f2', border: '#fca5a5', active: '#ef4444', text: '#dc2626' }
                                   : { bg: '#fff7ed', border: '#fed7aa', active: '#f97316', text: '#c2410c' }
        const noColor  = { bg: '#f0fdf4', border: '#bbf7d0', active: '#22c55e', text: '#15803d' }
        const c = isYes ? yesColor : noColor
        return (
          <motion.button
            key={String(val)}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: val ? 0.1 : 0, type: 'spring', stiffness: 350 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(val)}
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-3xl border-2 font-bold text-base transition-all"
            style={{
              borderColor: active ? c.active : c.border,
              background: active ? c.active : c.bg,
              color: active ? 'white' : c.text,
              boxShadow: active ? `0 8px 24px ${c.active}35` : 'none',
            }}
          >
            <span className="text-4xl">{isYes ? (isDeployQ ? '💀' : '😔') : (isDeployQ ? '😇' : '🎉')}</span>
            <span>{isYes ? yesLabel : noLabel}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

function ClockCards({ selected, onChange }: { selected: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { val: false, icon: '🏠', label: 'Không', sub: 'Production ổn cả!', bg: '#f0fdf4', border: '#86efac', active: '#22c55e', textColor: '#15803d' },
        { val: true,  icon: '🚨', label: 'Có',    sub: 'OT cứu production', bg: '#fef2f2', border: '#fca5a5', active: '#ef4444', textColor: '#dc2626' },
      ].map(({ val, icon, label, sub, bg, border, active, textColor }) => {
        const isActive = selected === val
        return (
          <motion.button
            key={String(val)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: val ? 0.1 : 0, type: 'spring', stiffness: 320 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(val)}
            className="flex flex-col items-center gap-2 py-8 rounded-3xl border-2 transition-all"
            style={{
              borderColor: isActive ? active : border,
              background: isActive ? active : bg,
              boxShadow: isActive ? `0 8px 24px ${active}35` : 'none',
            }}
          >
            <span className="text-4xl">{icon}</span>
            <span className="font-bold text-base" style={{ color: isActive ? 'white' : textColor }}>{label}</span>
            <span className="text-xs font-medium" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : textColor, opacity: 0.7 }}>{sub}</span>
          </motion.button>
        )
      })}
    </div>
  )
}


/* ─── profile step ──────────────────────────────── */
function ProfileStep({ onDone }: {
  onDone: (name: string, gender: 'male' | 'female' | 'other') => void
}) {
  const [name, setName]     = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => onDone(name.trim(), gender ?? 'other')

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      exit={   { y: -24, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex flex-col items-center"
    >
      {/* Mascot */}
      <div className="mb-5 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl select-none"
        >🤖</motion.div>
        <div className="bg-white/90 rounded-2xl px-4 py-2 shadow-sm border border-white/60 text-sm font-medium text-gray-700">
          Cho mình biết về bạn nhé!
        </div>
      </div>

      {/* Card */}
      <div className="w-full bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-white/60 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Trước khi bắt đầu...</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Để kết quả được cá nhân hoá hơn</p>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên của bạn là gì?{' '}
            <span className="text-gray-400 font-normal">(tùy chọn)</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="VD: Thọ Dev, Chị Nga BA..."
            maxLength={40}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none text-gray-900 bg-white text-sm font-medium transition-colors placeholder:text-gray-300"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bạn là?{' '}
            <span className="text-gray-400 font-normal">(tùy chọn)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: 'male'   as const, label: 'Nam',  icon: '👨', color: '#3b82f6' },
              { val: 'female' as const, label: 'Nữ',   icon: '👩', color: '#ec4899' },
              { val: 'other'  as const, label: 'Khác', icon: '🤷', color: '#8b5cf6' },
            ]).map(({ val, label, icon, color }) => {
              const active = gender === val
              return (
                <motion.button
                  key={val}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setGender(active ? null : val)}
                  className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-colors"
                  style={{
                    borderColor: active ? color : '#e5e7eb',
                    background:  active ? color : 'white',
                    boxShadow:   active ? `0 4px 14px ${color}40` : 'none',
                  }}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-bold" style={{ color: active ? 'white' : '#374151' }}>{label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={submit}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md"
          style={{ background: '#8b5cf6', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
        >
          Bắt đầu kiểm tra 🚀
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── slide transition ───────────────────────────── */
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 260 : -260, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: (d: number) => ({ x: d > 0 ? -260 : 260, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as const } }),
}

/* ─── main page ──────────────────────────────────── */
export default function QuizPage() {
  const router = useRouter()
  const [inProfile, setInProfile] = useState(true)
  const [step, setStep] = useState(0)
  const [dir,  setDir]  = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT)

  const q = QUESTIONS[step]
  const currentVal = answers[q.key]
  const mascot = getMascot(q.key, currentVal)

  function handleProfileDone(name: string, gender: 'male' | 'female' | 'other') {
    setAnswers(p => ({ ...p, name, gender }))
    setInProfile(false)
  }

  function next() {
    if (step < QUESTIONS.length - 1) { setDir(1); setStep(s => s + 1) }
    else router.push(`/result?${answersToParams(answers)}`)
  }
  function prev() {
    if (step > 0) { setDir(-1); setStep(s => s - 1) }
    else setInProfile(true)
  }
  function set<K extends keyof QuizAnswers>(key: K, val: QuizAnswers[K]) {
    setAnswers(p => ({ ...p, [key]: val }))
  }

  const bg = inProfile ? 'from-violet-50 to-indigo-50' : q.bg

  return (
    <main className={`min-h-screen bg-gradient-to-br ${bg} text-gray-900 flex flex-col transition-all duration-500`}>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur border-b border-white/60 px-6 py-4 shrink-0 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors">
            ← Thoát
          </Link>
          {inProfile ? (
            <span className="text-sm font-semibold text-violet-500">✨ Bước đầu tiên</span>
          ) : (
            <div className="flex items-center gap-2">
              {QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > step ? 1 : -1); setStep(i) }}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 6,
                    background: i === step ? q.accent : i < step ? '#9ca3af' : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          )}
          {inProfile ? (
            <div className="w-[52px]" />
          ) : (
            <span className="text-sm font-mono text-gray-400">
              {step + 1}/{QUESTIONS.length}
            </span>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6 overflow-hidden">
        <div className="max-w-lg mx-auto w-full">

          <AnimatePresence mode="wait" custom={dir}>
            {inProfile ? (
              <ProfileStep key="profile" onDone={handleProfileDone} />
            ) : (
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center"
              >
                {/* Character */}
                <DevCharacter
                  face={mascot.face}
                  say={mascot.say}
                  size={110}
                  questionKey={q.key}
                  value={currentVal as number | boolean}
                />

                {/* Question card */}
                <div className="w-full bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-white/60 p-6 mb-4"
                     style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center leading-snug">
                    {q.question}
                  </h1>
                  <p className="text-gray-400 text-sm text-center mb-6">{q.subtext}</p>

                  {/* Answer interaction */}
                  {q.style === 'bubbles' && q.options && (
                    <BubbleGrid
                      options={q.options}
                      selected={currentVal as number}
                      accent={q.accent}
                      onChange={v => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                  {q.style === 'coffee-tap' && (
                    <CoffeeTap
                      selected={currentVal as number}
                      accent={q.accent}
                      onChange={v => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                  {q.style === 'bug-grid' && (
                    <LadybugTap
                      selected={currentVal as number}
                      onChange={(v: number) => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                  {q.style === 'emoji-scale' && q.options && (
                    <EmojiScale
                      options={q.options}
                      selected={currentVal as number}
                      accent={q.accent}
                      onChange={v => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                  {q.style === 'big-cards' && (
                    <BigCards
                      questionKey={q.key}
                      selected={currentVal as boolean}
                      onChange={v => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                  {q.style === 'clock-cards' && (
                    <ClockCards
                      selected={currentVal as boolean}
                      onChange={v => set(q.key, v as QuizAnswers[typeof q.key])}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Footer nav — only for quiz questions */}
      {!inProfile && (
        <footer className="bg-white/70 backdrop-blur border-t border-white/60 px-6 py-4 shrink-0">
          <div className="max-w-lg mx-auto flex gap-3">
            <button
              onClick={prev}
              className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 text-sm font-semibold transition-colors bg-white/80"
            >
              ← Quay lại
            </button>
            <button
              onClick={next}
              className="ml-auto px-7 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ background: q.accent, boxShadow: `0 4px 16px ${q.accent}50` }}
            >
              {step === QUESTIONS.length - 1 ? 'Xem kết quả 🔥' : 'Tiếp theo →'}
            </button>
          </div>
        </footer>
      )}

    </main>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { QuizAnswers } from '@/types'

type Expr = 'happy' | 'neutral' | 'worried' | 'scared' | 'dead' | 'shocked'
type QKey = keyof QuizAnswers | 'landing'

function toExpr(face: string): Expr {
  if (['💀', '☠️'].includes(face)) return 'dead'
  if (['🤯', '😱', '⚡'].includes(face)) return 'shocked'
  if (['😨', '😰', '😤', '🔥'].includes(face)) return 'scared'
  if (['😅', '😬', '😓', '😩', '😵', '😔'].includes(face)) return 'worried'
  if (['🧘', '😌', '😇', '🎉', '✨', '☕', '😊', '😃', '😶', '🙂'].includes(face)) return 'happy'
  return 'neutral'
}

const SHIRT: Record<Expr, string> = {
  happy: '#818cf8', neutral: '#60a5fa', worried: '#fb923c',
  scared: '#f87171', dead: '#6b7280', shocked: '#a78bfa',
}

const SHOWCASE: Array<{ key: Exclude<QKey, 'landing'>; value: number | boolean }> = [
  { key: 'coffeeCount',  value: 4 },
  { key: 'sleepHours',   value: 3 },
  { key: 'bugs',         value: 5 },
  { key: 'stressLevel',  value: 8 },
  { key: 'fridayDeploy', value: true },
  { key: 'overtime',     value: true },
  { key: 'meetings',     value: 6 },
  { key: 'quickCalls',   value: 4 },
]

interface Props {
  face: string
  say?: string
  size?: number
  questionKey?: QKey
  value?: number | boolean
}

/* ── Prop components (return SVG JSX) ──────────────────── */

function BubbleTea() {
  return (
    <motion.g
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '158px 132px' }}
    >
      {/* cup body */}
      <path d="M 149 112 L 146 138 L 174 138 L 171 112 Z" fill="url(#dvc-boba)" />
      <path d="M 149 112 L 146 138 L 174 138 L 171 112 Z" fill="none" stroke="#c4b5fd" strokeWidth="1.8" />
      {/* lid */}
      <rect x="147" y="107" width="26" height="8" rx="4" fill="#c4b5fd" />
      {/* boba pearls */}
      <circle cx="153" cy="131" r="3.5" fill="#4c1d95" opacity="0.9" />
      <circle cx="160" cy="133" r="3.5" fill="#4c1d95" opacity="0.9" />
      <circle cx="167" cy="131" r="3.5" fill="#4c1d95" opacity="0.9" />
      {/* cup shine */}
      <ellipse cx="153" cy="118" rx="3" ry="6" fill="white" opacity="0.22" transform="rotate(-15,153,118)" />
      {/* straw */}
      <motion.g
        animate={{ rotate: [-4, 0, -4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        style={{ transformOrigin: '157px 107px' }}
      >
        <line x1="157" y1="107" x2="148" y2="80" stroke="#f9a8d4" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="155" y1="101" x2="150" y2="98" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <line x1="152" y1="92"  x2="149" y2="89" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </motion.g>
      {/* hand circle */}
      <circle cx="160" cy="133" r="10" fill="#EDA05A" opacity="0" />
    </motion.g>
  )
}

function SleepZzz() {
  return (
    <g>
      {[0, 1, 2].map(i => (
        <motion.g
          key={i}
          animate={{ y: [0, -20, -40], opacity: [0, 0.95, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.75, ease: 'easeOut' }}
          style={{ transformOrigin: `${32 + i * 14}px ${52 - i * 8}px` }}
        >
          <text
            x={32 + i * 14}
            y={52 - i * 8}
            fontSize={18 - i * 3}
            fontWeight="bold"
            fill="#818cf8"
            textAnchor="middle"
          >Z</text>
        </motion.g>
      ))}
    </g>
  )
}

function LadybugFriend({ count }: { count: number }) {
  const positions = [
    { x: 52, y: 163 },
    { x: 44, y: 172 },
    { x: 58, y: 175 },
  ]
  return (
    <>
      {positions.slice(0, Math.min(count, 3)).map(({ x, y }, i) => (
        <motion.g
          key={i}
          animate={{ x: [-1, 2, -1], y: [0, -1, 1, 0] }}
          transition={{ duration: 1.8 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          {/* body */}
          <ellipse cx={x} cy={y + 2} rx="7" ry="6" fill="#dc2626" />
          {/* head */}
          <circle cx={x} cy={y - 4} r="4.5" fill="#1a1208" />
          {/* center line */}
          <line x1={x} y1={y - 1} x2={x} y2={y + 7} stroke="#1a1208" strokeWidth="1.2" />
          {/* spots */}
          <circle cx={x - 3} cy={y + 1} r="1.6" fill="#1a1208" />
          <circle cx={x + 3} cy={y + 1} r="1.6" fill="#1a1208" />
          <circle cx={x - 2} cy={y + 5} r="1.2" fill="#1a1208" />
          <circle cx={x + 2} cy={y + 5} r="1.2" fill="#1a1208" />
          {/* shine */}
          <ellipse cx={x - 2} cy={y} rx="2" ry="1.2" fill="white" opacity="0.25" transform={`rotate(-20,${x-2},${y})`} />
        </motion.g>
      ))}
    </>
  )
}

function SteamWisps({ level }: { level: number }) {
  const count = level >= 9 ? 4 : level >= 7 ? 3 : 2
  const xs = [82, 100, 118, 91]
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.path
          key={i}
          d={`M ${xs[i]} 20 Q ${xs[i] - 7} 8 ${xs[i]} -2 Q ${xs[i] + 7} -12 ${xs[i]} -22`}
          stroke={level >= 9 ? '#f97316' : '#94a3b8'}
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.75, 0], y: [-4, -14, -24] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

function RocketProp() {
  return (
    <motion.g
      animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '172px 38px' }}
    >
      {/* body */}
      <ellipse cx="172" cy="42" rx="11" ry="24" fill="#f97316" />
      {/* nose cone */}
      <path d="M 161 26 Q 172 2 183 26 Z" fill="#ef4444" />
      {/* window */}
      <circle cx="172" cy="38" r="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.2" />
      <circle cx="170" cy="36" r="2" fill="white" opacity="0.5" />
      {/* fins */}
      <path d="M 161 58 L 153 72 L 163 67 Z" fill="#fb923c" />
      <path d="M 183 58 L 191 72 L 181 67 Z" fill="#fb923c" />
      {/* flame outer */}
      <motion.ellipse
        cx="172" cy="69"
        rx="8" ry="11"
        fill="#fbbf24"
        animate={{ ry: [11, 15, 9, 13, 11], opacity: [1, 0.85, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      {/* flame inner */}
      <motion.ellipse
        cx="172" cy="71"
        rx="5" ry="7"
        fill="#f97316"
        animate={{ ry: [7, 10, 5, 9, 7] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
      />
    </motion.g>
  )
}

function ShieldProp() {
  return (
    <motion.g
      animate={{ scale: [1, 1.07, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '172px 22px' }}
    >
      <path d="M 161 8 L 183 8 L 183 22 Q 183 35 172 40 Q 161 35 161 22 Z" fill="#22c55e" />
      <path d="M 164 8 L 180 8 L 180 22 Q 180 33 172 38 Q 164 33 164 22 Z" fill="#4ade80" />
      <path d="M 166 21 L 170 27 L 178 15" stroke="white" strokeWidth="3" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  )
}

function OvertimeProp() {
  return (
    <g>
      {/* moon */}
      <motion.path
        d="M 30 38 Q 20 30 26 20 Q 16 22 14 32 Q 12 44 22 48 Q 34 51 40 41 Q 32 41 30 38 Z"
        fill="#fbbf24"
        animate={{ scale: [1, 1.06, 1], rotate: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '26px 35px' }}
      />
      {/* stars */}
      {[{ x: 46, y: 12, r: 2.5 }, { x: 54, y: 28, r: 1.8 }, { x: 38, y: 52, r: 2 }].map(({ x, y, r }, i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r={r}
          fill="#fef9c3"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      {/* mini clock */}
      <circle cx="26" cy="65" r="11" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <circle cx="26" cy="65" r="9" fill="#0f172a" />
      <line x1="26" y1="65" x2="26" y2="58" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <motion.line
        x1="26" y1="65" x2="32" y2="68"
        stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '26px 65px' }}
      />
    </g>
  )
}

function PhoneProp({ count }: { count: number }) {
  return (
    <motion.g
      animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
      transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 2.5 }}
      style={{ transformOrigin: '38px 170px' }}
    >
      {/* phone body */}
      <rect x="28" y="157" width="22" height="36" rx="4.5" fill="#1e293b" />
      <rect x="30" y="160" width="18" height="26" rx="2.5" fill="#38bdf8" />
      {/* screen content */}
      <rect x="33" y="164" width="12" height="2" rx="1" fill="white" opacity="0.55" />
      <rect x="33" y="169" width="9"  height="2" rx="1" fill="white" opacity="0.38" />
      <rect x="33" y="174" width="11" height="2" rx="1" fill="white" opacity="0.38" />
      {/* home button */}
      <circle cx="39" cy="191" r="2" fill="#334155" />
      {/* notification badge */}
      {count > 0 && (
        <motion.g
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '49px 158px' }}
        >
          <circle cx="49" cy="158" r="8" fill="#ef4444" />
          <text x="49" y="162" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">
            {count > 9 ? '9+' : String(count)}
          </text>
        </motion.g>
      )}
    </motion.g>
  )
}

function PapersProp({ count }: { count: number }) {
  const layers = Math.min(count, 4)
  return (
    <motion.g
      animate={{ rotate: [-3, 0, 3, 0, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '35px 175px' }}
    >
      {Array.from({ length: layers }, (_, i) => {
        const isTop = i === layers - 1
        return (
          <g key={i} transform={`translate(${(i - layers / 2) * 2.5}, ${-i * 4})`}>
            <rect
              x="18" y={168}
              width="30" height="38"
              rx="2.5"
              fill={isTop ? 'white' : '#f1f5f9'}
              stroke="#cbd5e1" strokeWidth="1.2"
            />
            {isTop && (
              <>
                <line x1="23" y1="175" x2="43" y2="175" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="23" y1="181" x2="40" y2="181" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="23" y1="187" x2="38" y2="187" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                {count > 4 && (
                  <motion.text
                    x="33" y="198"
                    fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="middle"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >!!</motion.text>
                )}
              </>
            )}
          </g>
        )
      })}
    </motion.g>
  )
}

/* ── Main component ─────────────────────────────────────── */

export default function DevCharacter({ face, say, size = 120, questionKey, value }: Props) {
  const [blink, setBlink] = useState(false)
  const [showcaseIdx, setShowcaseIdx] = useState(0)
  const expr = toExpr(face)
  const shirt = SHIRT[expr]

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>
    function schedule() {
      tid = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); schedule() }, 120)
      }, 2500 + Math.random() * 3500)
    }
    schedule()
    return () => clearTimeout(tid)
  }, [])

  useEffect(() => {
    if (questionKey !== 'landing') return
    const t = setInterval(() => setShowcaseIdx(i => (i + 1) % SHOWCASE.length), 3000)
    return () => clearInterval(t)
  }, [questionKey])

  const effectiveKey: QKey | undefined = questionKey === 'landing'
    ? SHOWCASE[showcaseIdx].key
    : questionKey
  const effectiveVal = questionKey === 'landing'
    ? SHOWCASE[showcaseIdx].value
    : value

  const n = typeof effectiveVal === 'number' ? effectiveVal : 0
  const b = Boolean(effectiveVal)
  const holdingRight = effectiveKey === 'coffeeCount'

  const w = size
  const h = Math.round(size * 1.35)

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 200 270"
          width={w}
          height={h}
          style={{ overflow: 'visible', filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.14))' }}
        >
          <defs>
            <radialGradient id="dvc-skin" cx="35%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#FFF0D9" />
              <stop offset="100%" stopColor="#EDA05A" />
            </radialGradient>
            <radialGradient id="dvc-hair" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#6B4226" />
              <stop offset="100%" stopColor="#3B1F0B" />
            </radialGradient>
            <linearGradient id="dvc-shirt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={shirt} />
              <stop offset="100%" stopColor={shirt} stopOpacity="0.72" />
            </linearGradient>
            <linearGradient id="dvc-laptop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <radialGradient id="dvc-screen" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            <linearGradient id="dvc-boba" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>
          </defs>

          {/* ── Left arm (always hanging) ── */}
          <path d="M 74 168 Q 50 185 48 212" stroke="#EDA05A" strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M 74 168 Q 50 185 48 212" stroke="#FFF0D9" strokeWidth="15" strokeLinecap="round" fill="none" opacity="0.22" />
          {/* left hand */}
          <circle cx="48" cy="213" r="10" fill="#EDA05A" />
          <circle cx="48" cy="213" r="10" fill="#FFF0D9" opacity="0.18" />

          {/* ── Right arm hanging ── */}
          <motion.path
            d="M 126 168 Q 150 185 152 212"
            stroke="#EDA05A" strokeWidth="22" strokeLinecap="round" fill="none"
            initial={{ opacity: holdingRight ? 0 : 1 }}
            animate={{ opacity: holdingRight ? 0 : 1 }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            d="M 126 168 Q 150 185 152 212"
            stroke="#FFF0D9" strokeWidth="15" strokeLinecap="round" fill="none"
            initial={{ opacity: holdingRight ? 0 : 0.22 }}
            animate={{ opacity: holdingRight ? 0 : 0.22 }}
            transition={{ duration: 0.35 }}
          />
          <motion.circle
            cx="152" cy="213" r="10" fill="#EDA05A"
            initial={{ opacity: holdingRight ? 0 : 1 }}
            animate={{ opacity: holdingRight ? 0 : 1 }}
            transition={{ duration: 0.35 }}
          />

          {/* ── Right arm raised (holding item) ── */}
          <motion.path
            d="M 126 168 Q 148 150 160 132"
            stroke="#EDA05A" strokeWidth="22" strokeLinecap="round" fill="none"
            initial={{ opacity: holdingRight ? 1 : 0 }}
            animate={{ opacity: holdingRight ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            d="M 126 168 Q 148 150 160 132"
            stroke="#FFF0D9" strokeWidth="15" strokeLinecap="round" fill="none"
            initial={{ opacity: holdingRight ? 0.22 : 0 }}
            animate={{ opacity: holdingRight ? 0.22 : 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.circle
            cx="160" cy="132" r="10" fill="#EDA05A"
            initial={{ opacity: holdingRight ? 1 : 0 }}
            animate={{ opacity: holdingRight ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />

          {/* ── Body ── */}
          <rect x="63" y="153" width="74" height="73" rx="22" fill="url(#dvc-shirt)" />
          <rect x="76" y="146" width="48" height="20" rx="10" fill={shirt} opacity="0.6" />
          <text
            x="100" y="197"
            textAnchor="middle"
            fontSize="17"
            fontFamily="monospace"
            fontWeight="bold"
            fill="white"
            opacity="0.9"
          >{'</>'}</text>

          {/* ── Laptop ── */}
          <rect x="16" y="214" width="168" height="46" rx="7" fill="url(#dvc-laptop)" />
          <rect x="20" y="216" width="160" height="40" rx="5" fill="#0f172a" />
          <rect x="24" y="219" width="152" height="34" rx="4" fill="url(#dvc-screen)" opacity="0.88" />
          <rect x="32" y="226" width="62" height="3" rx="1.5" fill="white" opacity="0.4" />
          <rect x="32" y="232" width="82" height="3" rx="1.5" fill="white" opacity="0.25" />
          <rect x="32" y="238" width="50" height="3" rx="1.5" fill="white" opacity="0.35" />
          <rect x="16" y="258" width="168" height="6" rx="3" fill="#94a3b8" />

          {/* ── Ears ── */}
          <circle cx="33" cy="94" r="17" fill="url(#dvc-skin)" />
          <ellipse cx="33" cy="94" rx="9" ry="11" fill="#E0924A" opacity="0.45" />
          <circle cx="167" cy="94" r="17" fill="url(#dvc-skin)" />
          <ellipse cx="167" cy="94" rx="9" ry="11" fill="#E0924A" opacity="0.45" />

          {/* ── Head ── */}
          <circle cx="100" cy="88" r="65" fill="url(#dvc-skin)" />

          {/* ── Hair ── */}
          <ellipse cx="100" cy="30" rx="56" ry="32" fill="url(#dvc-hair)" />
          <ellipse cx="100" cy="24" rx="20" ry="14" fill="url(#dvc-hair)" />
          <ellipse cx="70"  cy="38" rx="18" ry="12" fill="url(#dvc-hair)" />
          <ellipse cx="130" cy="38" rx="18" ry="12" fill="url(#dvc-hair)" />
          <ellipse cx="70"  cy="56" rx="24" ry="15" fill="white" opacity="0.18" transform="rotate(-25,70,56)" />

          {/* ── Glasses ── */}
          <circle cx="80"  cy="90" r="17" fill="none" stroke="#3d2b1a" strokeWidth="2.2" opacity="0.28" />
          <circle cx="120" cy="90" r="17" fill="none" stroke="#3d2b1a" strokeWidth="2.2" opacity="0.28" />
          <line x1="97"  y1="90" x2="103" y2="90" stroke="#3d2b1a" strokeWidth="2.2" opacity="0.28" />
          <line x1="38"  y1="88" x2="63"  y2="90" stroke="#3d2b1a" strokeWidth="2.2" opacity="0.28" />
          <line x1="137" y1="90" x2="162" y2="88" stroke="#3d2b1a" strokeWidth="2.2" opacity="0.28" />

          {/* ── Face expression ── */}
          <AnimatePresence mode="wait">
            <motion.g
              key={expr}
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={   { scale: 0.75, opacity: 0 }}
              transition={{ duration: 0.18, type: 'spring', stiffness: 420, damping: 24 }}
              style={{ transformOrigin: '100px 95px' }}
            >
              {expr === 'dead' && (
                <>
                  <line x1="69" y1="80" x2="91" y2="100" stroke="#3d2b1a" strokeWidth="4"   strokeLinecap="round" />
                  <line x1="91" y1="80" x2="69" y2="100" stroke="#3d2b1a" strokeWidth="4"   strokeLinecap="round" />
                  <line x1="109" y1="80" x2="131" y2="100" stroke="#3d2b1a" strokeWidth="4" strokeLinecap="round" />
                  <line x1="131" y1="80" x2="109" y2="100" stroke="#3d2b1a" strokeWidth="4" strokeLinecap="round" />
                  <line x1="82" y1="116" x2="118" y2="116" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                  <motion.path
                    d="M 72 28 Q 80 10 88 26 Q 93 6 100 22 Q 107 8 114 26 Q 120 12 128 28"
                    fill="#f97316"
                    animate={{ y: [0,-4,1,0], scaleY:[1,1.12,0.93,1] }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '100px 20px' }}
                  />
                  <motion.path
                    d="M 76 28 Q 84 14 90 27 Q 94 9 100 23 Q 106 11 116 28"
                    fill="#fbbf24"
                    opacity="0.7"
                    animate={{ y: [0,-6,2,0], scaleY:[1,1.18,0.88,1] }}
                    transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    style={{ transformOrigin: '100px 18px' }}
                  />
                </>
              )}

              {expr === 'shocked' && (
                <>
                  {blink ? (
                    <>
                      <line x1="69" y1="90" x2="91" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="109" y1="90" x2="131" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="80"  cy="90" r="11" fill="#3d2b1a" />
                      <circle cx="120" cy="90" r="11" fill="#3d2b1a" />
                      <circle cx="75"  cy="85" r="4"  fill="white" />
                      <circle cx="115" cy="85" r="4"  fill="white" />
                    </>
                  )}
                  <ellipse cx="100" cy="116" rx="8" ry="10" fill="#3d2b1a" />
                  <path d="M 66 72 Q 80 66 91 72"  stroke="#3d2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 109 72 Q 120 66 134 72" stroke="#3d2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </>
              )}

              {expr === 'scared' && (
                <>
                  {blink ? (
                    <>
                      <line x1="69" y1="90" x2="91" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="109" y1="90" x2="131" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="80"  cy="90" r="8" fill="#3d2b1a" />
                      <circle cx="120" cy="90" r="8" fill="#3d2b1a" />
                      <circle cx="76"  cy="86" r="2.5" fill="white" />
                      <circle cx="116" cy="86" r="2.5" fill="white" />
                    </>
                  )}
                  <path d="M 66 78 L 90 84"  stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 110 84 L 134 78" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 82 112 Q 100 122 118 112" stroke="#3d2b1a" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <ellipse cx="140" cy="72" rx="4.5" ry="7" fill="#93c5fd" opacity="0.9" transform="rotate(15,140,72)" />
                </>
              )}

              {expr === 'worried' && (
                <>
                  {blink ? (
                    <>
                      <line x1="69" y1="90" x2="91" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="109" y1="90" x2="131" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <ellipse cx="80"  cy="90" rx="7" ry="6" fill="#3d2b1a" />
                      <ellipse cx="120" cy="90" rx="7" ry="6" fill="#3d2b1a" />
                    </>
                  )}
                  <path d="M 66 80 L 90 86"  stroke="#3d2b1a" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 110 86 L 134 80" stroke="#3d2b1a" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 80 112 Q 87 107 94 112 Q 100 117 106 112 Q 113 107 120 112"
                    stroke="#3d2b1a" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              )}

              {expr === 'happy' && (
                <>
                  {blink ? (
                    <>
                      <line x1="69" y1="90" x2="91" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="109" y1="90" x2="131" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M 70 92 Q 80 80 90 92"  stroke="#3d2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      <path d="M 110 92 Q 120 80 130 92" stroke="#3d2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    </>
                  )}
                  <path d="M 78 108 Q 100 126 122 108" stroke="#3d2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="62"  cy="104" rx="13" ry="8" fill="#ff9999" opacity="0.42" />
                  <ellipse cx="138" cy="104" rx="13" ry="8" fill="#ff9999" opacity="0.42" />
                </>
              )}

              {expr === 'neutral' && (
                <>
                  {blink ? (
                    <>
                      <line x1="69" y1="90" x2="91" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="109" y1="90" x2="131" y2="90" stroke="#3d2b1a" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="80"  cy="90" r="6" fill="#3d2b1a" />
                      <circle cx="120" cy="90" r="6" fill="#3d2b1a" />
                      <circle cx="77"  cy="87" r="2" fill="white" />
                      <circle cx="117" cy="87" r="2" fill="white" />
                    </>
                  )}
                  <path d="M 86 110 Q 100 118 114 110" stroke="#3d2b1a" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              )}
            </motion.g>
          </AnimatePresence>

          {/* ── Prop accessories ── */}
          <AnimatePresence mode="wait">
            <motion.g
              key={`prop-${String(effectiveKey)}`}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1,  scale: 1 }}
              exit={   { opacity: 0,  scale: 0.75 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 280, damping: 22 }}
              style={{ transformOrigin: '100px 100px' }}
            >
              {effectiveKey === 'coffeeCount' && <BubbleTea />}

              {effectiveKey === 'sleepHours' && n > 0 && n <= 5 && <SleepZzz />}

              {effectiveKey === 'bugs' && n > 0 && <LadybugFriend count={n} />}

              {effectiveKey === 'stressLevel' && n >= 5 && <SteamWisps level={n} />}

              {effectiveKey === 'fridayDeploy' && b  && <RocketProp />}
              {effectiveKey === 'fridayDeploy' && !b && <ShieldProp />}

              {effectiveKey === 'overtime' && b && <OvertimeProp />}

              {effectiveKey === 'meetings' && <PhoneProp count={n} />}

              {effectiveKey === 'quickCalls' && n > 0 && <PapersProp count={n} />}
            </motion.g>
          </AnimatePresence>

        </svg>
      </motion.div>

      {say && (
        <AnimatePresence mode="wait">
          <motion.div
            key={say}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={   { opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="relative px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 max-w-[220px] text-center leading-snug"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.1)' }}
          >
            {say}
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"
              style={{ zIndex: -1 }}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

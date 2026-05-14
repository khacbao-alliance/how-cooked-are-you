'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { answersFromParams, calculateCookedScore, getBurnoutLevel } from '@/lib/score'
import type { RoastResult } from '@/types'

function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let current = 0
    const step = target / (1200 / 16)
    const interval = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplay(Math.round(current))
      if (current >= target) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [target])
  return <span>{display}</span>
}

function ScoreRing({ score }: { score: number }) {
  const radius = 72
  const circ = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circ)

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 200)
    return () => clearTimeout(t)
  }, [score, circ])

  const ringColor =
    score <= 20 ? '#16a34a' :
    score <= 40 ? '#d97706' :
    score <= 60 ? '#ea580c' :
    score <= 80 ? '#dc2626' : '#991b1b'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="176" height="176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="88" cy="88" r={radius}
          fill="none" stroke={ringColor} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold tabular-nums" style={{ color: ringColor }}>
          <AnimatedScore target={score} />%
        </span>
        <span className="text-gray-400 text-xs mt-0.5 uppercase tracking-widest font-semibold">cháy</span>
      </div>
    </div>
  )
}

function ShareButton({ score, level, name, roastText }: {
  score: number; level: string; name?: string; roastText?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    const who = name ? `${name} ` : 'Tôi '
    const snippet = roastText ? `\n\n"${roastText.slice(0, 100).trimEnd()}..."` : ''
    const text = `${who}vừa đạt ${score}% trên máy đo burnout 🔥\nMức độ: ${level}${snippet}\nThử xem bạn cháy đến đâu:\n`
    if (navigator.share) {
      await navigator.share({ title: 'Bạn Đang Cháy Đến Mức Nào?', text, url })
    } else {
      await navigator.clipboard.writeText(`${text}${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-sm font-medium transition-colors bg-white"
    >
      {copied ? '✓ Đã copy' : '↗ Chia sẻ'}
    </button>
  )
}

function encodeResult(r: RoastResult): string {
  const json = JSON.stringify({ a: r.burnoutAnalysis, ro: r.roast, ad: r.advice })
  const bytes = new TextEncoder().encode(json)
  const binary = Array.from(bytes, b => String.fromCodePoint(b)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function decodeResult(encoded: string, score: number, level: RoastResult['level']): RoastResult | null {
  try {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, c => c.codePointAt(0)!)
    const { a, ro, ad } = JSON.parse(new TextDecoder().decode(bytes))
    return { burnoutAnalysis: a, roast: ro, advice: ad, score, level }
  } catch { return null }
}

export default function ResultClient() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  const answers = answersFromParams(searchParams)
  const score = calculateCookedScore(answers)
  const burnout = getBurnoutLevel(score)
  const name = answers.name

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    // Shared link: result already encoded in URL → display immediately, no API call
    const rParam = searchParams.get('r')
    if (rParam) {
      const decoded = decodeResult(rParam, score, burnout.level)
      if (decoded) { setResult(decoded); setLoading(false); return }
    }

    fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else {
          setResult(d)
          // Encode result into URL so sharing this link shows the same text
          const p = new URLSearchParams(searchParams.toString())
          p.set('r', encodeResult(d))
          window.history.replaceState(null, '', `?${p.toString()}`)
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/quiz" className="text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors">
            ← Làm lại
          </Link>
          <span className="text-sm font-semibold text-gray-700">
            {name ? `🔥 Kết quả của ${name}` : '🔥 Kết quả của bạn'}
          </span>
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors">
            Trang chủ
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Score card */}
        <div className={`rounded-2xl border p-7 bg-white shadow-sm ${burnout.bgColor}`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">
            <ScoreRing score={score} />
            <div className="flex-1 text-center sm:text-left">
              <div className={`text-2xl font-bold flex items-center gap-2 justify-center sm:justify-start mb-1 ${burnout.color}`}>
                <span>{burnout.emoji}</span>
                <span>{burnout.level}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{burnout.description}</p>

              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { label: 'Ngủ',    value: `${answers.sleepHours}h`,  icon: '😴' },
                  { label: 'Tab',    value: `${answers.meetings}`,     icon: '🌐' },
                  { label: 'Bug',    value: answers.bugs,              icon: '🐛' },
                  { label: 'Cà phê', value: answers.coffeeCount,       icon: '☕' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                    <div className="text-base mb-1">{icon}</div>
                    <div className="font-bold text-sm text-gray-900">{value}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span className="animate-spin inline-block text-orange-400">⚙</span>
              <span>Gemini AI đang phân tích nỗi đau của bạn...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <p className="text-red-600 font-semibold text-sm mb-1">Lỗi tạo nội dung AI</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* AI Results */}
        {result && (
          <>
            {/* Burnout Analysis */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                  <span>🔬</span> Chẩn đoán burnout
                </h2>
                <span className="text-xs text-gray-300 font-mono">Gemini AI</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{result.burnoutAnalysis}</p>
            </div>

            {/* Roast — prominent */}
            <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm"
                 style={{ boxShadow: '0 4px 24px rgba(249,115,22,0.1)' }}>
              <h2 className="font-bold text-sm text-orange-600 flex items-center gap-2 mb-4">
                <span>🔥</span> Màn roast
                <span className="ml-auto text-xs text-orange-300 font-normal">từ senior dev AI</span>
              </h2>
              <blockquote className="relative">
                <span className="absolute -top-1 -left-1 text-4xl text-orange-200 font-serif leading-none select-none">&ldquo;</span>
                <p className="text-gray-800 text-base leading-relaxed font-medium pl-6">
                  {result.roast}
                </p>
                <span className="text-4xl text-orange-200 font-serif leading-none select-none float-right -mt-2">&rdquo;</span>
              </blockquote>
            </div>

            {/* Advice tips — as cards */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h2 className="font-semibold text-sm text-gray-800 flex items-center gap-2 mb-4">
                <span>💊</span> Lời khuyên sinh tồn
              </h2>
              <div className="flex flex-col gap-3">
                {result.advice
                  .split('\n')
                  .filter((line: string) => line.trim().startsWith('•'))
                  .map((tip: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-3.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <span className="text-base shrink-0 mt-0.5">
                        {i === 0 ? '🛠️' : i === 1 ? '⚡' : '🌿'}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {tip.replace(/^•\s*/, '')}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-2">
          <Link
            href="/quiz"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors shadow-md shadow-orange-100"
          >
            Làm lại
          </Link>
          <ShareButton score={score} level={burnout.level} name={name || undefined} roastText={result?.roast} />
        </div>

        <p className="text-gray-400 text-xs pb-4">
          Không phải lời khuyên y tế. Nếu điểm &gt; 80%, uống nước và ra ngoài đi. 🌿
        </p>

      </div>
    </main>
  )
}

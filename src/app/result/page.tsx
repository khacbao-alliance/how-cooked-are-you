import { Suspense } from 'react'
import ResultClient from './ResultClient'

export const metadata = {
  title: 'Kết quả | Bạn Đang Cháy Đến Mức Nào?',
  description: 'Xem điểm burnout AI của bạn.',
}

function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 inline-block" style={{ animation: 'bounce-character 1s ease-in-out infinite' }}>🔥</div>
        <p className="text-zinc-400 font-medium">Đang tải kết quả...</p>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultClient />
    </Suspense>
  )
}

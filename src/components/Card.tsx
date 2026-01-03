import type { ReactNode } from 'react'

type CardProps = {
    children: ReactNode
    className?: string
}

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={`rounded-2xl border border-slate-800/70 bg-slate-950/50 p-6 shadow-[0_0_0_1px_rgba(15,23,42,0.15),0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur ${className ?? ''}`}
        >
            {children}
        </div>
    )
}

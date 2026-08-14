import * as React from "react"

import { cn } from "@/lib/utils"

export function LiveDot({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
    </span>
  )
}

// Empty State
export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description: string; action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon}
      </div>
      <div className="text-[15px] font-semibold text-slate-800 mb-1">{title}</div>
      <div className="text-[13px] text-slate-500 max-w-xs mb-6">{description}</div>
      {action}
    </div>
  )
}
'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'

export default function FaqAccordion({ items }) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={`${t(item.q)}-${index}`} className="surface-panel overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-medium text-white">{t(item.q)}</span>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen ? <div className="border-t border-white/10 px-6 py-5 text-sm leading-7 text-slate-300">{t(item.a)}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

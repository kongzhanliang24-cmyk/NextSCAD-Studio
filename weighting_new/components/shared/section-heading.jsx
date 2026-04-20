'use client'

import { useLanguage } from '@/components/providers/language-provider'

export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const { t } = useLanguage()
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start text-left'

  return (
    <div className={`flex max-w-3xl flex-col ${alignment} ${className}`.trim()}>
      {eyebrow ? <div className="eyebrow">{t(eyebrow)}</div> : null}
      <h2 className="section-title mt-6">{t(title)}</h2>
      {description ? <p className="section-subtitle">{t(description)}</p> : null}
    </div>
  )
}

'use client'

import { useLanguage } from '@/components/providers/language-provider'

export default function MediaShell({ eyebrow, title, description, src = '', className = '', compact = false }) {
  const { t } = useLanguage()

  return (
    <div className={`surface-panel relative overflow-hidden ${compact ? 'min-h-[320px]' : 'min-h-[440px]'} ${className}`.trim()}>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15,31,51,0.92) 0%, rgba(45,90,142,0.52) 40%, rgba(232,168,56,0.16) 100%), url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="grid-backdrop absolute inset-0 opacity-30" />
      <div className="ambient-orb -right-16 top-8 h-40 w-40 bg-accent/20" />
      <div className="ambient-orb left-8 top-24 h-56 w-56 bg-primary-300/20" />
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="space-y-4">
          {eyebrow ? <div className="eyebrow">{t(eyebrow)}</div> : null}
          {title ? <div className="text-2xl font-semibold leading-tight text-white md:text-3xl">{t(title)}</div> : null}
          {description ? <div className="max-w-xl text-sm leading-7 text-slate-200">{t(description)}</div> : null}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-200">
          <span className="data-chip">{t({ zh: 'Immersive Product Canvas', en: 'Immersive Product Canvas' })}</span>
          <span className="data-chip">{src ? t({ zh: '可替換真實素材', en: 'Ready for real media' }) : t({ zh: '品牌視覺佔位', en: 'Brand visual placeholder' })}</span>
        </div>
      </div>
    </div>
  )
}

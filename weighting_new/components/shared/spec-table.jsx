'use client'

import { useLanguage } from '@/components/providers/language-provider'

export default function SpecTable({ specs }) {
  const { t } = useLanguage()

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {specs.map((spec, index) => (
            <tr key={`${t(spec.name)}-${index}`} className="border-b border-white/10 last:border-b-0">
              <th className="w-1/3 px-5 py-4 font-medium text-slate-300 md:px-6">{t(spec.name)}</th>
              <td className="px-5 py-4 text-white md:px-6">{typeof spec.value === 'object' ? t(spec.value) : spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
